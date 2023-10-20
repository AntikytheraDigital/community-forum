// Controller for board related requests
const Board = require('../models/board');

exports.getAllBoards = async (req, res) => {
    console.log("Getting all boards...")
    const boards = await Board.find({})
    return (res.status(200).json({boards}));
}