/* Update is complicated:
 * - We're splitting an item into slices
 * - We have a lot of many to many relationships
 * - The GSI contains the load-bearing search data
 *
 * To keep things simple rather than performant I will destroy the original
 * item and then create a new one.  If I create a library to generate these I
 * will add functionality to only delete slices that are changes.
 */
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { createNote, deleteNote } from "./database";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  // Get input
  const { id = "0" } = event?.pathParameters || {};
  const newItemBody = JSON.parse(event?.body || "");
  console.log(id, newItemBody);
  await deleteNote(id);
  const resp = await createNote(newItemBody);

  return {
    statusCode: 200,
    body: JSON.stringify(resp),
  };
};
