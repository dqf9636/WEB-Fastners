const router = require('express').Router()
const controller = require('./order.controller')
const authmiddleware = require('../../../middlewares/auth')

//주문 생성
router.use('/', authmiddleware)
router.post('/', controller.create)

//주문 목록 불러오기
router.use('/', authmiddleware)
router.get('/', controller.list)

//주문 상태 변경
router.use('/', authmiddleware)
router.put('/',controller.updateOrder)

module.exports = router
