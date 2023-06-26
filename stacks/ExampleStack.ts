import { Api, StackContext, Table } from "sst/constructs";

export function ExampleStack({ stack }: StackContext) {
  const table = new Table(stack, "DataTracker", {
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
    globalIndexes: {
      gsi1: { partitionKey: "gsi1pk", sortKey: "gsi1sk" },
    },
  });

  // Create the HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [table],
      },
    },
    routes: {
      "GET /admin/clear": "packages/functions/admin/admin.clear",
      "GET /admin/dump": "packages/functions/admin/admin.dump",

      "POST /log": "packages/functions/log/create.main",
      "GET /log/{id}": "packages/functions/log/get.main",
      "GET /log": "packages/functions/log/list.main",
      "PUT /log/{id}": "packages/functions/log/update.main",
      "DELETE /log/{id}": "packages/functions/log/delete.main",

      "GET /log/byDate/{startDate}/{endDate}":
        "packages/functions/log/filter.byDate",
      "GET /log/byTag/{id}": "packages/functions/log/filter.byTag",
      "GET /log/byTask/{id}": "packages/functions/log/filter.byTask",

      "POST /note": "packages/functions/note/create.main",
      "GET /note/{id}": "packages/functions/note/get.main",
      "GET /note": "packages/functions/note/list.main",
      "PUT /note/{id}": "packages/functions/note/update.main",
      "DELETE /note/{id}": "packages/functions/note/delete.main",

      "GET /note/byDate/{startDate}/{endDate}":
        "packages/functions/note/filter.byDate",
      "GET /note/byLog/{id}": "packages/functions/note/filter.byLog",
      "GET /note/byTag/{id}": "packages/functions/note/filter.byTag",

      "POST /tag": "packages/functions/tag/create.main",
      "GET /tag": "packages/functions/tag/list.main",
      //"PUT /tag": "packages/functions/tag/update.main",
      //"DELETE /tag": "packages/functions/tag/delete.main",

      "POST /task": "packages/functions/task/create.main",
      "GET /task/{id}": "packages/functions/task/get.main",
      "GET /task": "packages/functions/task/list.main",
      //"PUT /task": "packages/functions/task/update.main",
      //"DELETE /task": "packages/functions/task/delete.main",

      "GET /task/byCreationDate/{startDate}/{endDate}":
        "packages/functions/task/filter.byDate",
      "GET /task/byCompletionDate/{startDate}/{endDate}":
        "packages/functions/task/filter.byDate",
      "GET /task/byChild/{id}": "packages/functions/task/filter.byChild",
      "GET /task/byParent/{id}": "packages/functions/task/filter.byParent",
      "GET /task/byRoot/{id}": "packages/functions/task/filter.byRoot",
      "GET /task/byStatus/{id}": "packages/functions/task/filter.byStatus",
      "GET /task/byTag/{id}": "packages/functions/task/filter.byTag",
    },
  });

  // Show the URLs in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
