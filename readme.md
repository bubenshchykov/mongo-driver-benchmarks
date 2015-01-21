v1.X vs v2.X
===

Mongodb native driver has been changed a lot in 2.X [(doc)](https://github.com/mongodb/node-mongodb-native/blob/2.0/docs/content/meta/changes-from-1.0.md).

A simple test performs the same operations for each driver: connects to the specified or local db, runs each crud command 1000 times in series within _mongobench collection, reports total duration in ms.

Some common patters data shows
- driver v2 is visibly faster on all basic CRUD queries when journal:false 
- driver v2 is visibly slower on inserts with journal:true
- driver v2 is slightly faster on other crud with journal:true

Of course results depend on environment, mogno version, connection strings and somthing else.

```shell
mongod --journal

npm install
npm test

testing localhost mongo with journal:false
uri: mongodb://localhost/_mongobench?journal=false
opts: {}
drivers: v1.4.28 vs v2.0.13
running benchmarks...
┌────────────┬────────┬────────┬────────┬──────┬───────────────┐
│ n=1000, ms │ insert │ update │ remove │ save │ findAndModify │
├────────────┼────────┼────────┼────────┼──────┼───────────────┤
│ v1         │ 1607   │ 1709   │ 1742   │ 1599 │ 1540          │
├────────────┼────────┼────────┼────────┼──────┼───────────────┤
│ v2         │ 1264   │ 1360   │ 1423   │ 1257 │ 1273          │
└────────────┴────────┴────────┴────────┴──────┴───────────────┘

testing localhost mongo with journal:true
uri: mongodb://localhost/_mongobench?journal=true
opts: {}
drivers: v1.4.28 vs v2.0.13
running benchmarks...
┌────────────┬────────┬────────┬────────┬───────┬───────────────┐
│ n=1000, ms │ insert │ update │ remove │ save  │ findAndModify │
├────────────┼────────┼────────┼────────┼───────┼───────────────┤
│ v1         │ 23175  │ 37440  │ 37403  │ 36776 │ 25931         │
├────────────┼────────┼────────┼────────┼───────┼───────────────┤
│ v2         │ 35607  │ 35660  │ 35590  │ 35569 │ 17693         │
└────────────┴────────┴────────┴────────┴───────┴───────────────┘

```

options
---

You can pass customer connection string and replica set name
```javascript
node index.js [connection string] [replica set name]
node index.js mongodb://m0.ocean.com,m1.ocean.com/_mongobench?journal=true&ssl=true
```

You can see and trigger the benchmark on travis [![Build Status](https://travis-ci.org/bubenshchykov/mongo-driver-benchmarks.png?branch=master)](https://travis-ci.org/bubenshchykov/mongo-driver-benchmarks)
