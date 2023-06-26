/* Task deletion is complicated, in that deletions and updates are subject to
 * cascades.  Because this is a demo of single table design rather than of
 * tree management, this system will only allow deletion and emancipation to
 * occur for nodes that have no children.  I think it'd be cool to write up a
 * full demo of a digraph with cascade handling, but doing that here would
 * represent scope creep, and as the customer I find that idea unacceptable.
 */
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteTask } from "./database";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  // Get input
  const { id = "0" } = event?.pathParameters || {};
  await deleteTask(id);

  return {
    statusCode: 200,
    body: JSON.stringify("all gone"),
  };
};
