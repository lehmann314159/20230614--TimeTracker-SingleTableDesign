import { getAllTasks } from "./database";

export async function main() {
  const payloadList = await getAllTasks();

  return {
    statusCode: 200,
    body: JSON.stringify(payloadList),
  };
}
