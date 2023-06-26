import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";
import { createLog } from "./database";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  // Get/default incoming data
  const {
    id = randomUUID(),
    title = "0",
    content = "0",
    duration = 0,
    tagList = [],
    task = "0",
    date = "1970-01-01",
  } = JSON.parse(event?.body || "");

  // insert into database
  await createLog({ id, title, content, duration, tagList, task, date });

  // respond
  return {
    statusCode: 200,
    body: JSON.stringify({ id, title, content, duration, tagList, task, date }),
  };
};
