const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema({
    name: String,
    category: String,
    standard: String,
    grade: String,
    status: String,
    img: String
})

// find one user by using productname
Product.statics.findOneByProductname = function(name) {
    return this.findOne({
        name
    }).exec()
}

// create new Post document
Product.statics.create = function(name, category, standard, grade, img) {
    const product = new this({
        name: name,
        category: category,
        standard: standard,
        grade: grade,
        status: "available",
        img: img
    })

    // return the Promise
    return product.save()
}

Product.statics.deleteByproductId = function(product_id) {

    return this.findOneAndDelete({
        _id: product_id
    }).exec()
}
module.exports = mongoose.model('Product', Product)