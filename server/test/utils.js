const Board = require("../models/board");
const User = require("../models/user");
const Post = require("../models/post");
const MODEL_DATA = require("./test_cases/model_data.json");

exports.resetDB = () => {
    Board.deleteMany({});
    User.deleteMany({});
    Post.deleteMany({});
    MODEL_DATA.boards.forEach((model) => {
        const newBoard = new Board(model);
        newBoard.save();
    });
    MODEL_DATA.users.forEach((model) => {
        const newUser = new User(model);
        newUser.save();
    });
    MODEL_DATA.posts.forEach((model) => {
        const newPost = new Post(model);
        newPost.save()
            .then((post) => {
                console.log("model post:" + post)
            });
    });
}