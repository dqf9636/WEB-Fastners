const router = require('express').Router()
const controller = require('./product.controller')
const authmiddleware = require('../../../middlewares/auth')
const multer = require("multer")
const path = require('path')

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images');
        },
        filename: function (req, file, cb) {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        }
    }),
})

//제품 목록 불러오기
router.get('/', controller.list)

//제품 등록
router.use('/', authmiddleware)
router.post('/', upload.single("photo"), controller.addProduct)

//제품 삭제
router.use('/', authmiddleware)
router.delete('/',controller.deleteProduct)

module.exports = router