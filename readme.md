v1.X vs v2.X
===

Mongodb native driver has been changed a lot in 2.X [(doc)](https://github.com/mongodb/node-mongodb-native/blob/2.0/docs/content/meta/changes-from-1.0.md).

A simple test runs each command 100 times in series and reports total duration in ms. The data shows
- driver v2 is almost 4x faster on all basic CRUD queries when journal:false 
- driver v2 is almost 2x slower on inserts with journal:true, the rest of queries are a bit faster

```shell
npm install
node .

drivers v1.4.28 vs v2.0.13, running benchmarks...
┌──────────────────┬────────┬────────┬────────┬──────┬───────────────┐
│ N=100, ms        │ insert │ update │ remove │ save │ findAndModify │
├──────────────────┼────────┼────────┼────────┼──────┼───────────────┤
│ v1 journal:false │ 418    │ 404    │ 396    │ 411  │ 351           │
├──────────────────┼────────┼────────┼────────┼──────┼───────────────┤
│ v2 journal:false │ 108    │ 115    │ 111    │ 116  │ 112           │
├──────────────────┼────────┼────────┼────────┼──────┼───────────────┤
│ v1 journal:true  │ 1727   │ 3792   │ 3861   │ 3759 │ 2105          │
├──────────────────┼────────┼────────┼────────┼──────┼───────────────┤
│ v2 journal:true  │ 3540   │ 3551   │ 3584   │ 3574 │ 1773          │
└──────────────────┴────────┴────────┴────────┴──────┴───────────────┘

```

You can see and trigger the benchmark on travis [![Build Status](https://travis-ci.org/bubenshchykov/mongo-driver-benchmarks.png?branch=master)](https://travis-ci.org/bubenshchykov/mongo-driver-benchmarks)