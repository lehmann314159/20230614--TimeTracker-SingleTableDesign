/* Notes are stored as a set of items, all of which contain the same payload.
 * This payload is roughly a collection of the assembled items for the note.
 * I'm doing this so that it's easy to search by most of the properties
 * without having to do a second read to get the properties.  The biggest
 * downside to this method is a complicated/expensive update, but I expect
 * that updates will be a small portion of the overall data access space.
 *
 * A note about notes:
 * Because notes are conceptually simple but could appear on their own or as
 * a part of a log or task, we're handling them as something of a union.  A
 * note that is part of a log or task uses the date and tag list of the log
 * or task to which it is connected, while independant notes have their own.
 * In either case, the note can be identified as having a GSI1 pk of "NOTE".
 * This makes it possible to easily obtain all notes in a single query.  In
 * order to get all notes associated with logs or tasks post-query filtering
 * is necessary, but I see that as a fairly narow use case.
 *
 * A note about model layer versus physical layer:
 * I don't think that the actual database operations are worth abstracting away
 * from the model logic, because the model is tied so closely to the database
 * structure.  So I've abstracted them from the endpoints, but not from each
 * other.
 */
import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";
const dynamoDb = new DynamoDB.DocumentClient();

/////////////////
// Create Note //
/////////////////
export const createNote = async (payload: Note) => {
  const { id, title, content, tagList, date } = payload;

  const paramList = [
    // Top level item
    { pk: `NOTE#${id}`, sk: "0", gsi1pk: "NOTE", gsi1sk: `DATE#${date}` },

    // Title
    {
      pk: `NOTE#${id}`,
      sk: `TITLE#${title}`,
      gsi1pk: "0",
      gsi1sk: "0",
    },

    // Content
    {
      pk: `NOTE#${id}`,
      sk: `CONTENT#${content}`,
      gsi1pk: "0",
      gsi1sk: "0",
    },

    // Date
    {
      pk: `NOTE#${id}`,
      sk: `DATE#${date}`,
      gsi1pk: `DATE#${date}`,
      gsi1sk: `NOTE#${id}`,
    },
  ];

  // Tags
  const tagParamList = tagList.map((aTag: string) => {
    return {
      pk: `NOTE#${id}`,
      sk: `TAG#${aTag}`,
      gsi1pk: `TAG#${aTag}`,
      gsi1sk: `NOTE#${id}`,
    };
  });

  // Put items for each one of these
  for await (const aItem of paramList.concat(tagParamList)) {
    const resp = await dynamoDb
      .put({
        TableName: Table.DataTracker.tableName,
        Item: { ...aItem, payload },
      })
      .promise();

    console.log(resp);
  }

  return payload;
};

////////////////////////////
// Read Single Note by ID //
////////////////////////////
export const getNote = async (id: string): Promise<Note> => {
  const params = {
    TableName: Table.DataTracker.tableName,
    Key: {
      pk: `NOTE#${id}`,
      sk: "0",
    },
  };
  const resp = await dynamoDb.get(params).promise();

  return (
    resp?.Item?.payload || {
      id: "error",
      title: "error",
      content: "error",
      tagList: [],
      date: "1900-01-01",
    }
  );
};

////////////////////////////////
// Read all slices for a Note //
////////////////////////////////
export const getFullNote = async (
  id: string
): Promise<Array<NoteDynamoStructure>> => {
  const params = {
    TableName: Table.DataTracker.tableName,
    Key: {
      pk: `NOTE#${id}`,
    },
  };
  const resp = await dynamoDb.query(params).promise();
  const retList = (resp?.Items || []).map((x) => {
    const {
      string: pk,
      string: sk,
      string: gsi1pk,
      string: gsi1sk,
      Object: payload,
    } = x;
    return { pk, sk, gsi1pk, gsi1sk, payload };
  });
  return retList;
};

////////////////////
// Read All Notes //
////////////////////
export const getAllNotes = async (): Promise<Array<Note>> => {
  const params = {
    TableName: Table.DataTracker.tableName,
    IndexName: "gsi1",
    KeyConditionExpression: "gsi1pk = :pk",
    ExpressionAttributeValues: {
      ":pk": "NOTE",
    },
  };
  const resp = await dynamoDb
    .query(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        //console.log(data);
      }
    })
    .promise();

  const bob = (resp?.Items || []).map((x) => x.payload);
  console.log(bob);
  return bob;
};

/////////////////////////////
// Filter based on a match //
/////////////////////////////

/* This one is funny, because notes could be inside of logs or tasks.
 * So we just grab all payloads that have this tag, and let the consumer
 * pick out the title and content data themselves, as well as log- and task-
 * specific stuff if they want.
 */
export const filterOnMatch = async (
  property: string,
  value: string
): Promise<Array<Note>> => {
  const params = {
    TableName: Table.DataTracker.tableName,
    IndexName: "gsi1",
    KeyConditionExpression: "gsi1pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `${property.toUpperCase()}#${value}`,
    },
  };
  const resp = await dynamoDb.query(params).promise();
  console.log(params);
  console.log(resp.Items);
  return (resp?.Items || []).map((x) => x.payload);
};

///////////////////////////
// Filter based on range //
///////////////////////////
export const filterOnRange = async (
  property: string,
  value1: string,
  value2: string
): Promise<Array<Note>> => {
  const params = {
    TableName: Table.DataTracker.tableName,
    IndexName: "gsi1",
    KeyConditionExpression:
      "gsi1pk = :pk AND gsi1sk BETWEEN :value1 AND :value2",
    ExpressionAttributeValues: {
      ":pk": "NOTE",
      ":value1": `${property.toUpperCase()}#${value1}`,
      ":value2": `${property.toUpperCase()}#${value2}`,
    },
  };
  const resp = await dynamoDb.query(params).promise();
  console.log(params);
  console.log(resp.Items);
  const ret = (resp?.Items || []).map((x) => x.payload);
  console.log(ret);

  return ret;
};

//////////////////////////////////
// Delete all slices for a Note //
//////////////////////////////////
export const deleteNote = async (id: string): Promise<void> => {
  // Get old item
  const oldResults = await dynamoDb
    .query({
      TableName: Table.DataTracker.tableName,
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `NOTE#${id}`,
      },
    })
    .promise();

  // And destroy it
  for await (const aItem of oldResults?.Items || []) {
    const { pk, sk } = aItem;
    await dynamoDb
      .delete({
        TableName: Table.DataTracker.tableName,
        Key: { pk, sk },
      })
      .promise();
  }
};
