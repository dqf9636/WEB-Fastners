const User = require('../../../models/user')

/* 
    GET /api/user/list

    @header Authorization (String)

    result
     - 200: success -> { users: arrayOf(auth) }
     - 403: failed
*/

exports.list = (req, res) => {
    // refuse if not an admin
    if(!req.decoded.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }

    User.find({}, '-password').exec()
    .then(
        users=> {
            res.json({users})
        }
    )

}


/*
    POST /api/user/assign-admin/:username

    :username: String

    @header Authorization (String)
    

    result
     - 403: not admin
     - 200: success
     - 404: failed
*/
exports.assignAdmin = (req, res) => {
    // refuse if not an admin
    if(!req.decoded.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }

    User.findOneByUsername(req.params.username)
    .then(
        user => {
            if(!user) throw new Error('user not found')
            user.assignAdmin()
        }
    ).then(
        res.json({
            success: true
        })
    ).catch(
        (err) => { res.status(404).json({message: err.message})}
    )
}