const { User } = require('../models/user.js')
const { Task } = require('../models/task.js');
const { restart } = require('nodemon');


/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {

    app.use('/api', require('./home.js')(router));
    app.use('/users', require('./users.js')(router));
    app.use('/tasks', require('./tasks.js')(router))
    app.use('/users/:id', require('./userId.js')(router))
    app.use('/tasks/:id', require('./taskId.js')(router))

}

