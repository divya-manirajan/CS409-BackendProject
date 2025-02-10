const { Task } = require('../models/task')
const { User } = require('../models/user')

module.exports = function (router) {

    var usersIdRoute = router.route('/users/:id')

    //Respond with details of specified user or 404 error test:653f1bd6d9cb8542f4712b85
    usersIdRoute.get(async(req, res) => {
        try{
            var select = {}
            if(req.query.select !== undefined){
                select = JSON.parse(req.query.select)
            }

            const user = await User.find({_id: req.params.id})
            .select(select)

            
            if(user.length > 0){
                res.status(200).json({
                    "message": "Successfully Retrieved User",
                    "data": user.pop()
                })}
            else{
                res.status(404).json({
                    "message": "User Not Found",
                    "data": "Unable to Find User with Specified Id"
                })
            }
            
        }catch (error){
            res.status(500).json({
                "message": "Server Error",
                "data": "Id Value not Accepted"
        })
        }
    })

    //Replace entire user with supplied user or 404 error
    usersIdRoute.put(async(req, res) => {
        try{
            const tempUserPut = await User.findById(req.params.id)
            if(tempUserPut === null){
                res.status(404).json({
                    "message": "Id Not Found",
                    "data": "Unable to Find User with Specified Id"
                })
            }
            else{
                const updatedUser = await User.findOneAndReplace(
                    {_id: req.params.id},
                    {
                        name: req.body.name,
                        email: req.body.email,
                        pendingTasks: req.body.pendingTasks,
                        dateCreated: req.body.dateCreated
                    },
                    {new:true}
                )

                const updatedTask = await Task.updateMany(
                    {assignedUser: req.params.id},
                    {$set:{
                        completed: false,
                        assignedUser: "",
                        assignedUserName: ""
                    }},
                    {new:true}
                )


                res.status(200).json({
                    "message": "Successfully Replaced User",
                    "data": updatedUser
                })
            }
            
        }catch (error){
            console.log(error)
            res.status(500).json({
                "message": "Server Error",
                "data": "Unable to Update User"
        })
        }
    })

    //Delete specified user or 404 error
    usersIdRoute.delete(async(req, res) => {
        try{

            const tempUserDel = await User.findById(req.params.id)
            if(tempUserDel === null){
                res.status(404).json({
                    "message": "User with Id Not Found",
                    "data": "Unable to Delete User with Specified Id"
                })
            }
            else{
                await Task.updateMany(
                    {assignedUser: tempUserDel.id},
                    {
                        completed: false,
                        assignedUser: "",
                        assignedUserName: ""

                    },
                    {new:true}
                )

                await User.deleteOne(
                    {_id: req.params.id}
                )

                res.status(200).json({
                    "message": "Successfully Deleted User",
                    "data": "User with Id: "+req.params.id+" was Deleted"
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