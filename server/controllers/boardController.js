// Controller for board related requests
const Board = require('../models/board');

exports.deleteBoard = async (req, res) => {
    console.log("Deleting board. NOT IMPLEMENTED")
    return (res.status(500).json({message: 'Board deletion not implemented'}));
}

exports.createBoard = async (req, res) => {
    console.log("Creating new board. NOT IMPLEMENTED")
    return (res.status(500).json({message: 'Board creation not implemented'}));
}

exports.getAllBoards = async (req, res) => {
    console.log("Getting all boards. NOT IMPLEMENTED")
    return (res.status(500).json({message: 'Board retrieval not implemented'}));
}





