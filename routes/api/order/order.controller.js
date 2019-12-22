const Order = require('../../../models/order')
const User = require('../../../models/user')

/*
    POST /api/order

    @header Authorization (String)

    @body
    {
        product: [arrayof({
            name: String,
            quantity: Number
        })]
    }

    return
     - 200: success
     - 409: failed

*/
exports.create = (req, res) => {
    //주문 생성
    const { product } = req.body

    const createOrder = (user) => {
        Order.create(user.username, product)
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
    .then(createOrder)
    .then(respond)
    .catch(onError)
}

/*
    GET /api/order

    @header Authorization (String)

    return
     - 200: success -> { orders: [arrayOf(
                                    _id: String
                                    orders: { arrayOf(products)},
                                    status: String (default value: "before confirm") 
                        ]}
     - 409: failed
*/
exports.list = (req, res) => {
    if(!req.decoded.admin) {
        //사용자 계정 - 본인 주문 목록
        Order.find({
            username: req.decoded.username
        }).exec()
        .then(
            orders=> {
                res.json({orders})
            }
        )
        .catch(
            (err) => { res.status(404).json({message: err.message})}
        )
    } else {
        //관리자 계정 - 전체 주문 목록
        Order.find({}).exec()
        .then(
            orders=> {
                res.json({orders})
            }
        )
        .catch(
            (err) => { res.status(404).json({message: err.message})}
        )
    }
}

/*
    PUT /api/order

    @header Authorization (String)
     : 관리자만 주문 상태 변경 가능

    @body
    {
        order_id: String,
        status: String
    }

    result
     - 200: success
     - 404: failed
*/
exports.updateOrder = (req, res) => {
    if(!req.decoded.admin) {
        (err) => { res.status(404).json({message: err.message})}
    }
    else {
        const { order_id, status } = req.body
        Order.UpdateByOrderId(order_id, status)
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
