const { Task } = require('../models/task');
const { User } = require('../models/user')


module.exports = function (router) {

    var tasksRoute = router.route('/tasks');

    //Respond with a List of tasks
    tasksRoute.get(async(req, res) => {
        try {

            var where = {}
            var sort = {}
            var select = {}
            var skip = ""
            var limit = ""
            var count = {}

            if(req.query.where !== undefined){
                where = JSON.parse(req.query.where)
            }
            if(req.query.sort !== undefined){
                sort = JSON.parse(req.query.sort)
            }
            if(req.query.select !== undefined){
                select = JSON.parse(req.query.select)
            }
            if(req.query.skip !== undefined){
                skip = JSON.parse(req.query.skip)
            }
            if(req.query.limit !== undefined){
                limit = JSON.parse(req.query.limit)
            }
          

            if(req.query.count == "true"){
                const tasks = await Task.find(where).sort(sort).select(select).skip(skip).limit(limit)
                .countDocuments()
                res.status(200).json({
                    "message": "Successfully Retrieved Count of Tasks",
                    "data": tasks
                })
            }
            else{
                const tasks = await Task.find(where).sort(sort).select(select).skip(skip).limit(limit)
               
                if(tasks.length > 0){
                    res.status(200).json({
                        "message": "Successfully Retrieved Tasks",
                        "data": tasks
                    })}
                else{
                    res.status(404).json({
                        "message": "Tasks Not Found",
                        "data": "Unable to Find Tasks"
                    })
                }
            }
    
        }catch (error){
            res.status(500).json({
                "message": "Server Error ",
                "data": "Unable to Complete Request"
        })
        }
    })

    //Create a new task. Respond with details of new task
    tasksRoute.post(async (req, res) => {
        try{
            const newTask = new Task({
                name: req.body.name,
                description: req.body.description,
                deadline: req.body.deadline,
                completed: req.body.completed,
                assignedUser: req.body.assignedUser,
                assignedUserName: req.body.assignedUserName,
                dateCreated: req.body.dateCreated
            })
            await newTask.save()

            const updatedUser = await User.findOneAndUpdate(
                {_id: req.body.assignedUser},
                {
                    name: req.body.assignedUserName,
                    $push: {pendingTasks: [newTask._id]}
                },
                {new:true}
            )
            

            res.status(201).json({
                "message": "Created Task",
                "data": newTask
            })
        }catch (error){
            console.log(error)
            res.status(500).json({
                "message": "Server Error",
                "data": "Unable to Create Task"
        })
        }
    })


    return router;
}
