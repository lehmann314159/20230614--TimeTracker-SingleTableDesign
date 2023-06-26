interface Log {
  id: string;
  title?: string;
  content?: string;
  duration: number;
  tagList: Array<string>;
  task?: string;
  date: string;
}

type LogKeys = keyof Log;

interface LogDynamoStructure {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  payload: Log;
}
