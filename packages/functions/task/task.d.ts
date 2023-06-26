interface Task {
  id: string;
  title: string;
  content: string;
  status: string;
  crdate: string;
  codate: string;
  rtask?: string;
  ptask?: string;
  childTaskList?: Array<string>;
  tagList: Array<string>;
}

type TaskKeys = keyof Task;

interface TaskDynamoStructure {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  payload: Task;
}
