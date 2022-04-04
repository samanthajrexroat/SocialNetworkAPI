const User = require("../models/User"); 


module.exports = {
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
        },
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId })
            .select("thoughts", "friends")
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "User not found"})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    createUser(req,res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "User not found" })
                    : Thought.findOneandUpdate(
                        { users: req.params.userId },
                        { $pull: { users: req.params.userId }},
                        { new: true }
                    )
            )
            .then((thought) => 
                !thought
                    ? res.status(404).json({
                        message: "User deleted, no thoughts found",
                    })
                    : res.json({ message: "User successfully deleted" })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })
    }
}