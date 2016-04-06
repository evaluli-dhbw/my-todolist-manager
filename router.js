const passportService = require('./services/passport');
const passport = require('passport');
const Authentication = require('./controllers/authentication');
const TodoController = require('./controllers/todo');

const requireAuth = passport.authenticate('jwt', { session: false }); // passport wants to create a session with cookies automatically, to stop that, we set session: false
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
	app.get('/', requireAuth, function(req, res) {
		res.send({ hi: 'there' });
	});
	app.post('/signin', requireSignin, Authentication.signin);
	app.post('/signup', Authentication.signup);

	app.post('/todo', requireAuth, TodoController.create);
	app.get('/todo', requireAuth, TodoController.findAll);
	app.get('/todo/:id', requireAuth, TodoController.findOne);
	app.put('/todo/:id', requireAuth, TodoController.updateOne);
	app.delete('/todo/:id', requireAuth, TodoController.deleteOne);
}