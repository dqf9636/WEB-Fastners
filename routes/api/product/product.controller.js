const Product = require('../../../models/product')
const User = require('../../../models/user')

/*
    GET /api/product

    result
     - 200: success -> {products: [ arrayOf(products) ] }
     - 404: failed

    
    GET /images/{photo}
    photo : String (Path of img)
    ex) <img src="IP:PORT/images/{photo}"/>
*/
exports.list = (req, res) => {
    Product.find({}).exec()
    .then(
        products=> {
            res.json({products})
        }
    )
    .catch(
        (err) => { res.status(404).json({message: err.message})}
    )
}

/*
    POST /api/product

    @header Authorization (String)

    @body
    {
        name: String,
        category: String,
        standard: String,
        grade: String,
        img: String (path of img)
    }

    result
     - 200: add success
     - 409: add failed
*/
exports.addProduct = (req, res) => {
    const { name, category, standard, grade } = req.body
    const photo = req.file

    const photoname = photo.filename

    const create = (product) => {
        if(product) {
            throw new Error('product exists')
        } else {
            if(!req.decoded.admin) {
                (err) => { res.status(409).json({message: err.message})}
            }
            else {
                Product.create(name, category, standard, grade, photoname)
            }
        }
    }

    const respond = () => {
        res.json({
            success: true
        })
    }

    const onError = (error) => {
        res.status(409).json(
            {message: error.message}
        )
    }
    
    // check productname duplication
    Product.findOneByProductname(name)
    .then(create)
    .then(respond)
    .catch(onError)
}

/*
    DELETE /api/product

    @header Authorization (String)

    @body
    {
        product_id: String
    }

    result
     - 200: success
     - 409: not admin
     - 404: failed
*/
exports.deleteProduct = (req, res) => {
    if(!req.decoded.admin) {
        (err) => { res.status(409).json({message: err.message})}
    } else {
        //admin 계정
        Product.deleteByproductId(req.body.product_id)
        
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
