import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";
import { createNote } from "./database";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  // Get/default incoming data
  const {
    id = randomUUID(),
    title = "0",
    content = "0",
    tagList = [],
    date = "1970-01-01",
  } = JSON.parse(event?.body || "");

  // insert into database
  await createNote({ id, title, content, tagList, date });

  // respond
  return {
    statusCode: 200,
    body: JSON.stringify({ id, title, content, tagList, date }),
  };
};
