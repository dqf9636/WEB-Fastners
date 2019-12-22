const router = require('express').Router()
const controller = require('./board.controller')
const authmiddleware = require('../../../middlewares/auth')

//게시글 목록 불러오기
router.use('/', authmiddleware)
router.get('/', controller.list)

//게시글 작성
router.use('/', authmiddleware)
router.post('/',controller.postContent)

//게시글 삭제
router.use('/', authmiddleware)
router.delete('/',controller.deleteContent)

module.exports = router