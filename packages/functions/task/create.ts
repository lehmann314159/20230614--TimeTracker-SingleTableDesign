import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";
import { createTask } from "./database";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  // Get/default incoming data
  const {
    id = randomUUID(),
    title = "0",
    content = "0",
    status = "OPEN",
    crdate = "1970-01-01",
    codate = "3000-01-01",
    //rtask = "0",
    //ptask = "0",
    //childTaskList = [],
    tagList = [],
  } = JSON.parse(event?.body || "");

  // insert into database
  await createTask({
    id,
    title,
    content,
    status,
    crdate,
    codate,
    //rtask,
    //ptask,
    tagList,
    //childTaskList,
  });

  // respond
  return {
    statusCode: 200,
    body: JSON.stringify({
      id,
      title,
      content,
      status,
      crdate,
      codate,
      //rtask,
      //ptask,
      tagList,
      //childTaskList,
    }),
  };
};
