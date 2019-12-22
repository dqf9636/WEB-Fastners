const Board = require('../../../models/board')
const User = require('../../../models/user')

/*
    GET /api/board
    
    @header Authorization (String)

    result
     : 본인 작성 게시글 / 관리자는 모든 게시글
     - 200: success -> { posts: [arrayOf(post)] }
     - 409: fail
*/
exports.list = (req, res) => {
    if(!req.decoded.admin) {
        //일반 사용자 계정
        Board.findByUsername(req.decoded.username)
        .then(
            posts => {
                if(!posts) throw new Error('post not found')
                res.json({posts})
            }
        )
        .catch(
            (err) => { res.status(404).json({message: err.message})}
        )
    } else {
        //admin 계정
        Board.find({}, '-password').exec()
        .then(
            posts=> {
                res.json({posts})
            }
        )
        .catch(
            (err) => { res.status(404).json({message: err.message})}
        )
    }
}

/*
    POST /api/board

    @header Authorization (String)

    @body
    {
        title: String,
        contents: String
    }

    result
     - 200: post success
     - 409: post failed
*/
exports.postContent = (req, res) => {
    const { title, contents } = req.body

    const createPost = (user) => {
        Board.create(user.username, title, contents)
    }

    const respond = () => {
        res.json({
            success: true
        })
    }

    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }

    User.findOneByUsername(req.decoded.username)
    .then(createPost)
    .then(respond)
    .catch(onError)
}

/*
    DELETE /api/board

    @header Authorization (String)

    @body
    {
        board_id: String
    }

    result
     - 200: delete success
     - 409: delete failed
*/
exports.deleteContent = (req, res) => {
    console.log(req.body)
    if(!req.decoded.admin) {
        //일반 사용자 계정
        Board.findByboardId(req.body.board_id)
        .then(
            (board)=>{
                console.log(board)
                console.log("board : " + board.writer)
                console.log("username : " + req.decoded.username)
                if (req.decoded.username === board.writer) {
                    Board.deleteByboardId(board._id)
                }
            }
        )
        .then(
            res.json({
                success: true
            })
        )
        .catch(
            (err) => { 
                console.error(err)
                res.status(404).json({message: err.message})
            }
        )
    } else {
        //admin 계정
        Board.findByboardId(req.body.board_id)
        .then(
            (board)=>{
                Board.deleteByboardId(board._id)
            }
        )
        .then(
            res.json({
                success: true
            })
        )
        .catch(
            (err) => { res.status(404).json({message: err.message})}
        )
    }
}
