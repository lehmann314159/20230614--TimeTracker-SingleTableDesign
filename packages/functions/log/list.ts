import { getAllLogs } from "./database";

export async function main() {
  const payloadList = await getAllLogs();

  return {
    statusCode: 200,
    body: JSON.stringify(payloadList),
  };
}
