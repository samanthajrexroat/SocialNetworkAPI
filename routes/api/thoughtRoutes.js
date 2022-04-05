const router = require("express").Router();
const { getThoughts, createThought } = require("../../controllers/thoughtController.js");

// /api/thoughts
// GET to get all thoughts, POST a new thought
router.route("/").get(getThoughts).post(createThought);

// GET to get a single thought by its _id
// PUT to update a thought by its _id
// DELETE to remove a thought by its _id
router.route("/:userId").get(getSingleThought);

// /api/thoughts/:thoughtId/reactions
// POST to create a reaction stored in a single thought's reactions array field

// DELETE to pull and remove a reaction by the reaction's reactionId value

module.exports = router;