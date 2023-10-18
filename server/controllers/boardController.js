// Controller for board related requests
const Board = require('../models/board');

exports.deleteBoard = async (req, res) => {
    console.log("Deleting board. NOT IMPLEMENTED")
    return (res.status(501).json({message: 'Board deletion not implemented'}));
}

exports.createBoard = async (req, res) => {
    console.log("Creating new board. NOT IMPLEMENTED")
    return (res.status(501).json({message: 'Board creation not implemented'}));
}

exports.getAllBoards = async (req, res) => {
    console.log("Getting all boards...")
    const boards = await Board.find({})
    return (res.status(200).json({boards}));
}

exports.getBoardByName = async (req, res) => {
    console.log("Getting board by boardName. NOT IMPLEMENTED")
    return (res.status(501).json({message: 'Board retrieval not implemented'}));
}