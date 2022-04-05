const User = require("../models/User"); 
const Thought = require("../models/Thought");


module.exports = {
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
        },
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId })
            .select("thoughts")
            .select("friends")
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "User not found"})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true}
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "User not found! "})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "User not found" })
                    : Thought.deleteMany(
                        { _id: { $in: user.thoughts }}
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
    },
    addFriend(req, res) {
        console.log("You are adding a friend");
        console.log(req.body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId }},
            { new: true }
        )
            .then((user) => 
                !user
                    ? res.status(404).json({ message: "No user found."})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends:  req.params.friendId }},
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "No user found."})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    }
}