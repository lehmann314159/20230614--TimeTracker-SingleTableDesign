import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { filterOnMatch, filterOnRange } from "./database";

//////////////////////////
// Date range functions //
//////////////////////////

// Creation date
export const byCreationDate: APIGatewayProxyHandlerV2 = async (event) => {
  const { startDate = "1970-01-01", endDate = "3000-01-01" } =
    event?.pathParameters || {};
  const resp = await filterOnRange("crdate", startDate, endDate);
  console.log({ message: "returned resp", resp });

  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};

// Completion date
export const byCompletionDate: APIGatewayProxyHandlerV2 = async (event) => {
  const { startDate = "1970-01-01", endDate = "3000-01-01" } =
    event?.pathParameters || {};
  const resp = await filterOnRange("codate", startDate, endDate);
  console.log({ message: "returned resp", resp });

  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};

/////////////////////
// Match functions //
/////////////////////

/*
// By child task
export const byTask: APIGatewayProxyHandlerV2 = async (event) => {
  const { id = "0" } = event?.pathParameters || {};
  const resp = await filterOnMatch("ctask", id);
  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};

// By parent task
export const byParentTask: APIGatewayProxyHandlerV2 = async (event) => {
  const { id = "0" } = event?.pathParameters || {};
  const resp = await filterOnMatch("ptask", id);
  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};

// By root task
export const byRootTask: APIGatewayProxyHandlerV2 = async (event) => {
  const { id = "0" } = event?.pathParameters || {};
  const resp = await filterOnMatch("rtask", id);
  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};
*/

// By status
export const byStatus: APIGatewayProxyHandlerV2 = async (event) => {
  const { id = "0" } = event?.pathParameters || {};
  const resp = await filterOnMatch("status", id);
  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};

// by tag
export const byTag: APIGatewayProxyHandlerV2 = async (event) => {
  const { id = "0" } = event?.pathParameters || {};
  const resp = await filterOnMatch("tag", id);
  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};
