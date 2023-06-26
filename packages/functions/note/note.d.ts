interface Note {
  id: string;
  title: string;
  content: string;
  tagList: Array<string>;
  date: string;
}

interface NoteDynamoStructure {
  pk: string;
  sk: string;
  gsi1pk: string;
  gsi1sk: string;
  payload: Note;
}
