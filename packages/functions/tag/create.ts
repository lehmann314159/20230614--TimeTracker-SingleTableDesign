import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Table } from "sst/node/table";
const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const { tag } = JSON.parse(event?.body || "");

  const params = {
    // Get the table name from the environment variable
    TableName: Table.DataTracker.tableName,
    Item: {
      pk: `TAG#${tag}`,
      sk: "0",
      gsi1pk: "TAG",
      gsi1sk: `TAG#${tag}`,
    },
  };
  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  };
};
