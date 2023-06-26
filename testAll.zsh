host="https://62672smzi1.execute-api.us-east-1.amazonaws.com";

echo "\n\nUsing $host..."

echo "\n\nClearing database..."
curl $host/admin/clear


echo "\n\nInserting task..."
curl -d '{"id":"10001", "first task", "content": "this is the first one", "status": "open", "crdate": "2023-06-25", "tagList": ["admin"]}' -H "Content-Type: application/json"  -X POST $host/task

echo "\n\nInserting note..."
curl -d '{"id":"101", "title":"first note", "content":"first description", "tagList":["exercise","test"], "date":"2023-06-01"}' -H "Content-Type: application/json" -X POST $host/note

echo "\n\nDumping database..."
curl $host/admin/dump
