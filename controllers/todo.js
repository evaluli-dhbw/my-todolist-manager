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
	// find the todo-object with ID from route parameters
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
	// find the todo-object with ID from route parameters
	const id = req.params.id;
	// const { text, checked } = req.body;
	const text = req.body.text;
	const checked = req.body.checked;

	// save an update without any content
	var update = {};
	// if there is given text in the request, save it in a new field 'text' in 'update'
	if (text) { update.text = text; }
	// if there is new value for 'checked' in the request, save it in a new field 'ckecked' in 'update'
	if (checked != null) { update.checked = checked; }

	Todo.update({ _id: id, _creator: user._id }, {
		// replacing value of the mongodb-field with 'update'
		$set: update
	}, function(err){
		if (err) { return next(err); }

		return findAll(req, res, next);
	});
}

const deleteOne = function(req, res, next) {
	// find the todo-object with ID from route parameters
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