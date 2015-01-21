var v1 = require('./node_modules/mongodb_v1/node_modules/mongodb/package.json').version;
var v2 = require('./node_modules/mongodb_v2/node_modules/mongodb/package.json').version;
var clientV1 = require('./node_modules/mongodb_v1/node_modules/mongodb').MongoClient;
var clientV2 = require('./node_modules/mongodb_v2/node_modules/mongodb').MongoClient;

var benchmarks = require('./benchmarks');
var async = require('async');
var Table = require('cli-table');

var uri = process.argv[2] || 'mongodb://localhost/_mongobench';
var replSetName = process.argv[3];
var opts = {};
if (replSetName) opts.replSet = {replicaSet: replSetName};
var runCount = 1000;

console.log('uri: '+uri);
console.log('opts: '+JSON.stringify(opts));
console.log('drivers: v'+v1+' vs v'+v2);
console.log('running benchmarks...');

async.series({
	v1: function(cb) {
		clientV1.connect(uri, opts, function(err, db) {
			if (err) return cb(err);
			run({db: db}, cb);
		});
	},
	v2: function(cb) {
		clientV2.connect(uri, opts, function(err, db) {
			if (err) return cb(err);
			run({db: db}, cb);
		});
	}
}, tablify);

function run(opts, cb) {
	async.map(Object.keys(benchmarks), function(name, cb) {
		var benchmark = benchmarks[name];
		benchmark.before(opts, function(err, opts) {
			if (err) return cb(err);
			var fn = benchmark.test.bind(null, opts);
			runOne(fn, function(err, duration) {
				if (err) return cb(err);
				benchmark.after(opts, function(err) {
					if (err) return cb(err);
					cb(null, {method:name, ms:duration});
				});
			});
		});
	}, function(err, res) {
		if (err) return cb(err);
		return cb(null, res);
	});
}

function runOne(fn, cb) {
	var start = +new Date;
	async.timesSeries(runCount, fn, function(err) {
		if (err) return cb(err);
		return cb(null, +new Date - start);
	});
}

function tablify(err, res) {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	var table = new Table({head:['n='+runCount+', ms'].concat(Object.keys(benchmarks))});
	for(var name in res) {
		var row = {};
		row[name] = res[name].map(function(test){return test.ms;});
		table.push(row)
	}
	console.log(table.toString());
	process.exit(0);
}