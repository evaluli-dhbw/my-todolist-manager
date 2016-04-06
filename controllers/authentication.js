const jwt = require('jwt-simple');
const User = require('../models/users');
const config = require('../config');

function generateTokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

const signin = function(req, res, next) {
	// User has already had their email and password auth'd
	// We just need to give them a token
	res.send({ token: generateTokenForUser(req.user) });
}

const signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide email and password.' });
	}

	// See if a user with the given email exists
	User.findOne({ email: email }, function(err, existingUser) {
		if (err) { return next(err); }

		// If a user with email does exist, return an error
		if (existingUser) {
			return res.status(422).send({ error: 'Email is already in use.' });
		}

		// If a user with email does NOT exist, create and save user record
		const user = new User({
			email: email,
			password: password
		});

		user.save(function(err) {
			if (err) { return next (err); }

			// Respond to request indicating the user was created
			res.json({ token: generateTokenForUser(user) });
		});
	});
}

exports.signin = signin;
exports.signup = signup;