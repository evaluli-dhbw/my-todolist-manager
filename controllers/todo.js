const Todo = require('../models/todos');

const create = function(req, res, next) {
	const user = req.user;
	const body = req.body;

	if (!body.text) {
		return res.status(422).send({ error: 'No text provided.' });
	}

	new Todo({
		text: body.text, checked: false, _creator: user._id
	}).save(function(err){
		if (err) { return next(err); }
		return findAll(req, res, next);
	});
}

const findAll = function(req, res, next){
	const user = req.user;
	console.log('Fetching todos for user: ', user);

	Todo.find({ _creator: user._id }, function(err, todos) {
		if (err) { return next(err); }

		return res.send({ success: true, todos });
	});
}

const findOne = function(req, res, next) {
	const user = req.user;
	const id = req.params.id;

	if (!id) {
		return res.status(422).send({ error: 'No Todo-ID provided.'});
	}

	Todo.find({ _id: id, _creator: user._id }, function(err, todo) {
		if (err) { return next(err); }

		return res.send({ success: true, todo });
	});
}

const updateOne = function(req, res, next){
	const user = req.user;
	const id = req.params.id;
	// const { text, checked } = req.body;
	const text = req.body.text;
	const checked = req.body.checked;

	var update = {};
	if (text) { update.text = text; }
	if (checked != null) { update.checked = checked; }

	Todo.update({ _id: id, _creator: user._id }, {
		$set: update
	}, function(err){
		if (err) { return next(err); }

		return findAll(req, res, next);
	});
}

const deleteOne = function(req, res, next) {
	const id = req.params.id;

	Todo.remove({ _id: id }, function(err){
		if (err) { return next(err); }

		return findAll(req, res, next);
	});
}

exports.create = create;
exports.findOne = findOne;
exports.findAll = findAll;
exports.updateOne = updateOne;
exports.deleteOne = deleteOne;