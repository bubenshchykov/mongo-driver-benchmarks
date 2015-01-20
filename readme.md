v1.X vs v2.X benchmarks
===

Mongodb native driver has been changed a lot in 2.X [(doc)](https://github.com/mongodb/node-mongodb-native/blob/2.0/docs/content/meta/changes-from-1.0.md).

A simple test runs each command 100 times in series and reports total duration in ms. The data shows
- driver v2 is almost 4x faster on all basic CRUD queries when journal:false 
- driver v2 is almost 2x slower on inserts with journal:true, the rest of queries are a bit faster

```shell
npm install
node .

┌──────────────────┬────────┬────────┬────────┬──────┬───────────────┐
│ N=100, ms        │ insert │ update │ remove │ save │ findAndModify │
├──────────────────┼────────┼────────┼────────┼──────┼───────────────┤
│ v1, default      │ 471    │ 478    │ 479    │ 475  │ 434           │
├──────────────────┼────────┼────────┼────────┼──────┼───────────────┤
│ v2, default      │ 163    │ 163    │ 155    │ 162  │ 160           │
├──────────────────┼────────┼────────┼────────┼──────┼───────────────┤
│ v1, journal:true │ 1856   │ 3912   │ 3877   │ 3843 │ 1887          │
├──────────────────┼────────┼────────┼────────┼──────┼───────────────┤
│ v2, journal:true │ 3647   │ 3620   │ 3583   │ 3611 │ 1707          │
└──────────────────┴────────┴────────┴────────┴──────┴───────────────┘

```

You can see and trigger the benchmark on travis [![Build Status](https://travis-ci.org/bubenshchykov/mongo-driver-benchmarks.png?branch=master)](https://travis-ci.org/bubenshchykov/mongo-driver-benchmarks)