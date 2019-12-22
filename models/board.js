const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Board = new Schema({
    writer: String,
    title: String,
    contents: String,
    date: {type: Date, default: Date.now}
})

// create new Post document
Board.statics.create = function(writer, title, contents) {
    const post = new this({
        writer: writer,
        title: title,
        contents: contents
    })

    // return the Promise
    return post.save()
}

// find one post by using username
Board.statics.findByUsername = function(username) {
    return this.find({
        writer: username
    }).exec()
}

// find one post by using postId
Board.statics.findByboardId = function(board_id) {
    console.log("board_Id : " + board_id)
    return this.findOne({
        _id: board_id
    }).exec()
}

//find one post and delete
Board.statics.deleteByboardId = function(board_id) {
    return this.findOneAndDelete({
        _id: board_id
    }).exec()
}

module.exports = mongoose.model('Board', Board)