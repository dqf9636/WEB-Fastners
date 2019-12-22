const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Order = new Schema({
    username: String,
    product: [
        {
            name: String,
            quantity: Number
        }
    ],
    status: String
})

// create new order document
Order.statics.create = function(username, product) {
    const order = new this({
        username: username,
        product: product,
        status: "before confirm"
    })

    // return the Promise
    return order.save()
}

// update order status by using orderid
Order.statics.UpdateByOrderId = function(order_id, status) {
    return this.findOneAndUpdate(
       { _id: order_id },
       { $set: {status: status} },
       { new: true }
    )
}

module.exports = mongoose.model('Order', Order)