import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteLog } from "./database";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  // Get input
  const { id = "0" } = event?.pathParameters || {};
  await deleteLog(id);

  return {
    statusCode: 200,
    body: JSON.stringify("all gone"),
  };
};
