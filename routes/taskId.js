const { Task } = require('../models/task')
const { User } = require('../models/user')

module.exports = function (router) {

    var tasksIdRoute = router.route('/tasks/:id')

     //Respond with details of specified task or 404 error test:653f1bd7d9cb8542f4712bad
     tasksIdRoute.get(async(req, res) => {
        try{

            var select = {}
            if(req.query.select !== undefined){
                select = JSON.parse(req.query.select)
            }

            const task = await Task.find({_id: req.params.id})
            .select(select)

            if(task.length > 0){
                res.status(200).json({
                    "message": "Successfully Retrieved Task",
                    "data": task.pop()
                })}
            else{
                res.status(404).json({
                    "message": "Task Not Found",
                    "data": "Unable to Find Task with Specified Id"
                })
            }

        }catch (error) {
            res.status(500).json({
                "message": "Server Error",
                "data": "Id Value not Accepted"
        })
        }
    })

    //Replace entire task with supplied task or 404 error
    tasksIdRoute.put(async(req, res) => {
        try{
            const tempTaskPut = await Task.findById(req.params.id)
            if(tempTaskPut === null){
                res.status(404).json({
                    "message": "Id Not Found",
                    "data": "Unable to Find Task with Specified Id"
                })
            }
            else{
                const updatedTask = await Task.findOneAndReplace(
                    {_id: req.params.id},
                    {
                        name: req.body.name,
                        description: req.body.description,
                        deadline: req.body.deadline,
                        completed: req.body.completed,
                        assignedUser: req.body.assignedUser,
                        assignedUserName: req.body.assignedUserName,
                        dateCreated: req.body.dateCreated
                    },
                    {new: true}
                    
                )

                const updatedUser = await User.findOneAndUpdate(
                    {_id: req.body.assignedUser},
                    {
                        name: req.body.assignedUserName,
                        $push: {pendingTasks: [req.body._id]}
                    },
                    {new:true}
                )
                
                res.status(200).json({
                    "message": "Successfully Replaced Task",
                    "data": updatedTask
                })
            }
        }catch (error){
            console.log(error)
            res.status(500).json({
                "message": "Server Error",
                "data": "Unable to Update Task"
        })
        }
    })

    //Delete specified task or 404 error
    tasksIdRoute.delete(async(req, res) => {
        try{
            const tempTaskDel = await Task.findById(req.params.id)
            if(tempTaskDel === null){
                res.status(404).json({
                    "message": "Task with Id Not Found",
                    "data": "Unable to Delete Task with Specified Id"
                })
            }
            else{
                    const updatedUser = await User.findOneAndUpdate(
                        {_id: req.params.id},
                        {
                            $pull: {pendingTasks: [req.params._id]},
                        },
                        {new:true}
                    )
                
                await Task.deleteOne(
                   {_id: req.params.id}
                )

              

                res.status(200).json({
                    "message": "Successfully Deleted Task",
                    "data": "Task with Id: "+req.params.id+" was Deleted"
                })
            }
        }catch (error){
            console.log(error)
            res.status(500).json({
                "message": "Server Error",
                "data": "Id Value not Accepted"
        })
        }
    })



    return router
}