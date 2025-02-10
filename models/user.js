// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    pendingTasks: {type:[String], default: [""]},
    dateCreated: {type: Date, default: Date.now}
});

// Export the Mongoose model
const User = mongoose.model('User', UserSchema);
module.exports = { User }

/*
Here is the User Schema:

"name" - String
"email" - String
"pendingTasks" - [String] - The _id fields of the pending tasks that this user has
"dateCreated" - Date - should be set automatically by server

Users cannot be created (or updated) without a name or email. All other fields that the user did not specify should be set to reasonable values.
Multiple users with the same email cannot exist.
*/