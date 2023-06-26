import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { filterOnMatch, filterOnRange } from "./database";

// This function gets all notes, includding those in logs and tasks
export const byDate: APIGatewayProxyHandlerV2 = async (event) => {
  const { startDate = "1970-01-01", endDate = "3000-01-01" } =
    event?.pathParameters || {};
  const resp = await filterOnRange("date", startDate, endDate);
  console.log({ message: "returned resp", resp });

  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};

export const byTag: APIGatewayProxyHandlerV2 = async (event) => {
  const { id = "0" } = event?.pathParameters || {};
  const resp = await filterOnMatch("tag", id);
  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};

export const byTask: APIGatewayProxyHandlerV2 = async (event) => {
  const { id = "0" } = event?.pathParameters || {};
  const resp = await filterOnMatch("task", id);
  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};
