// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var TaskSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, default: "None"},
    deadline: {type: Date, required: true},
    completed: {type: Boolean, default: false},
	assignedUser: {type: String, default: ""},
    assignedUserName: {type: String, default: "unassigned"},
    dateCreated: {type: Date, default: Date.now}
});

// Export the Mongoose model
const Task = mongoose.model('Task', TaskSchema);
module.exports = { Task }

/*
Here is the Task Schema:

"name" - String
"description" - String
"deadline" - Date
"completed" - Boolean
"assignedUser" - String - The _id field of the user this task is assigned to - default ""
"assignedUserName" - String - The name field of the user this task is assigned to - default "unassigned"
"dateCreated" - Date - should be set automatically by server to present date

Tasks cannot be created (or updated) without a name or a deadline. All other fields that the user did not specify should be set to reasonable values.
*/