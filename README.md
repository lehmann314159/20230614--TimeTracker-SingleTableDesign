# 20230614--TimeTracker-SingleTableDesign
Time, Note, and Task tracker that uses dynamoDB and single-table design

To use this you'll need:
* An AWS account
* SST (a serverless JavaScript framework)
* Something like hoppscotch to hit the http endpoints

N.B. I'm using typescript, but almost 100% for type/shape considerations.  Strictly speaking I might be using some very simple generics, but I don't plan to flex any real typescript muscles unless/until I re-write this to
make the items and relationships declarative (which is like 4 steps down the road, tbh).

This project is intended as a proof of concept for using time tracking as a proxy for goal tracking, using connections between time, tasks, and tags.  The next steps will add:
* generic unit measurement
* programmable goals
* subtasks in a tree structure

But I wanted to solve some of the problems (and test with a front end) rather than wait for everything to be done to have anything done.

This project also utilizes sing-table design, a way to get join-like behavior from DynamoDB while still benefitting from natural partitioning and extremely fast read access.

A good introduction to single table design in DynamoDB can be found here:
https://www.alexdebrie.com/posts/dynamodb-single-table/

I consider his "The DynamoDB Book" to be essential reading if you are using AWS with non-trivial database operations.

The design that led to this repo can be found here (use the "TimeLog" sheet): 
https://docs.google.com/spreadsheets/d/1PTTI5xFoYDwCX09DskpG36NbnM2-_ZaJalkHKjGilx4/edit?usp=sharing

The other sheets reflect how I plan to collect measurements into activities, to be automatically aggregated via related goals (in the next version).

As an up-front caveat, I want to talk about some of the complexities/drawbacks of a system like this:
1. You have to know what questions you'll want to ask.  In order to pre-join the data, you have to have a sense of what the relationships are.  If you're lucky then the questions that you didn't anticipate will still work in the existing system; if you're unlucky you'll have to migrate the data to the new version.

2. A lot of the speed benefits from join-like behavior somes from some pretty aggressive denormalization.  This has two potential drawbacks: extra storage costs and complicated update behavior.

   I expect that extra storage will be less expensive than extra query costs. Further, I expect that most data in the system will have a low incidence of updating relative to reading, and near-zero contention in terms of simultaneous updates.  An easy compromise for high-frequency updates would be to lower the number of properties that are indexable.

   A relatively simple response to update contention would be to add a
   timestamp column and utilize conditional writes to implement an optimistic
   file-locking mechanism.  I haven't done so here because it's a personal
   prototype and I didn't want to over-engineer at the expense of delaying the
   MVP.  Plus I'd have to implement failure detection and a re-write strategy.

   
