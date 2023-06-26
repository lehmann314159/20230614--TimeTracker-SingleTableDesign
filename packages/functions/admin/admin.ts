import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export async function clear() {
  const params = {
    TableName: Table.DataTracker.tableName,
  };
  const results = await dynamoDb.scan(params).promise();

  for await (const aItem of results?.Items || []) {
    const { pk, sk } = aItem;
    console.log({ pk, sk });

    const resp = await dynamoDb
      .delete(
        {
          TableName: Table.DataTracker.tableName,
          Key: { pk, sk },
        },
        function (err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data);
          }
        }
      )
      .promise();
    //console.log(resp.response);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results.Items),
  };
}

export async function dump() {
  const params = {
    TableName: Table.DataTracker.tableName,
  };
  const results = await dynamoDb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(results.Items),
  };
}
