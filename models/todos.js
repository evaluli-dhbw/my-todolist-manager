const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const todoSchema = new Schema({
	text: { type: String, min: 3 },
	checked: { type: Boolean },
	// We save the users ID as a reference in our todo
	_creator: { type: Schema.Types.ObjectId, ref: 'user' }
});

// Create the model class
const ModelClass = mongoose.model('todo', todoSchema);

// Export the model
module.exports = ModelClass;