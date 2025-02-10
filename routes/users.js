const { User } = require('../models/user')
const { Task } = require('../models/task');


module.exports = function (router) {

    var usersRoute = router.route('/users');

   //respond with list of all users
   usersRoute.get(async (req, res) => {
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

        await User.updateMany(
            {"name":null},
            {"name":"test"}
        )

        if(req.query.count == "true"){
            const users = await User.find(where).sort(sort).select(select).skip(skip).limit(limit).countDocuments()
            res.status(200).json({
                "message": "Successfully Retrieved Count of Users",
                "data": users
            })
        }
        else{
            const users = await User.find(where).sort(sort).select(select).skip(skip).limit(limit)
            if(users.length > 0){
                res.status(200).json({
                    "message": "Successfully Retrieved Users",
                    "data": users
                })}
            else{
                res.status(404).json({
                    "message": "Users Not Found",
                    "data": "Unable to Find Users"
                })
            }
        }
    
        
    }catch (error){
        console.log(error)
        res.status(500).json({
            "message": "Server Error ",
            "data": "Unable to Complete Request"
    })
    }
})

//create new user and respond with details of new user
usersRoute.post(async (req, res) => {
    try{
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            pendingTasks: req.body.pendingTasks,
            dateCreated: req.body.dateCreated
        })
        await newUser.save()

       const test = await Task.find()

       const userId = newUser.id


        const tasks = newUser.pendingTasks

        const updatedTask = await Task.updateMany(
            { _id: { "$in": req.body.pendingTasks }},
            {
                assignedUser: newUser._id,
                assignedUserName: req.body.name
            },
            {new:true}
            )
      
      

        res.status(201).json({
            "message": "Created User",
            "data": newUser
        })
    }catch (error){
        console.log(error)
        res.status(500).json({
            "message": "Server Error",
            "data": "Unable to Create User"
    })
    }
})

    return router;
}
