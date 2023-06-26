import { getAllNotes } from "./database";

export async function main() {
  const payloadList = await getAllNotes();

  return {
    statusCode: 200,
    body: JSON.stringify(payloadList),
  };
}
