var clientV1 = require('./node_modules/_mongodb/v1/node_modules/mongodb').MongoClient;
var clientV2 = require('./node_modules/_mongodb/v2/node_modules/mongodb').MongoClient;
var benchmarks = require('./benchmarks');
var async = require('async');
var Table = require('cli-table');


var URI = 'mongodb://localhost/mongobench?journal=false';
var URI_JOURNAL = 'mongodb://localhost/mongobench?journal=true';
var RUN_COUNT = 100;

console.log('running benchmarks..');
async.series({
	'v1, journal:false': function(cb) {
		clientV1.connect(URI, function(err, db) {
			if (err) return cb(err);
			run({db: db}, cb);
		});
	},
	'v2, journal:false': function(cb) {
		clientV2.connect(URI, function(err, db) {
			if (err) return cb(err);
			run({db: db}, cb);
		});
	},
	'v1, journal:true': function(cb) {
		clientV1.connect(URI_JOURNAL, function(err, db) {
			if (err) return cb(err);
			run({db: db}, cb);
		});
	},
	'v2, journal:true': function(cb) {
		clientV2.connect(URI_JOURNAL, function(err, db) {
			if (err) return cb(err);
			run({db: db}, cb);
		});
	},
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
	async.timesSeries(RUN_COUNT, fn, function(err) {
		if (err) return cb(err);
		return cb(null, +new Date - start);
	});
}

function tablify(err, res) {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	var table = new Table({head:['N='+RUN_COUNT+', ms'].concat(Object.keys(benchmarks))});
	for(var name in res) {
		var row = {};
		row[name] = res[name].map(function(test){return test.ms;});
		table.push(row)
	}
	console.log(table.toString());
	process.exit(0);
}