import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getTask } from "./database";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  // Get the id from the request
  const { id = "0" } = event?.pathParameters || {};

  // Get the Note from the database
  const payload = await getTask(id);

  // Return the response
  return {
    statusCode: 200,
    body: JSON.stringify(payload),
  };
};
