import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export async function main() {
  const params = {
    TableName: Table.DataTracker.tableName,
    IndexName: "gsi1",
    KeyConditionExpression: "gsi1pk = :pk",
    ExpressionAttributeValues: {
      ":pk": "TAG",
    },
  };
  const results = await dynamoDb.query(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(results.Items),
  };
}
