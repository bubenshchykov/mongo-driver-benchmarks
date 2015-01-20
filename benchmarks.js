module.exports = {
	insert: {
		before: getCol,
		after: removeCol,
		test: function(opts, i, cb) {
			opts.col.insert({a:1, b:2, c:3}, {safe:true}, cb);
		}
	},
	update: {
		before: insertDoc,
		after: removeCol,
		test: function(opts, i, cb) {
			opts.col.update({a: 2}, {$set: {b:3}}, cb);
		}
	},
	remove: {
		before: insertDoc,
		after: removeCol,
		test: function(opts, i, cb) {
			opts.col.remove({a: 2}, cb);
		}
	},
	save: {
		before: getCol,
		after: removeCol,
		test: function(opts, i, cb) {
			opts.col.save({a: 2}, cb);
		}
	},
	findAndModify: {
		before: insertDoc,
		after: removeCol,
		test: function(opts, i, cb) {
			opts.col.findAndModify({a: 2}, [], {$set: {b:3}}, {safe: true}, cb);
		}
	}
};

function getCol(opts, cb) {
	opts.db.collection('c', function(err, col) {
		if (err) return cb(err);
		opts.col = col;
		cb(null, opts);
	});
}

function removeCol(opts, cb) {
	opts.col.remove({}, cb);
}

function insertDoc(opts, cb) {
	getCol(opts, function(err) {
		if (err) return cb(err);
		opts.col.insert({a:2}, {safe:true}, function(err, doc) {
			if (err) return cb(err);
			cb(null, opts);
		});	
	});
}