const jwt = require('jsonwebtoken')
const response = require('./newResponse')

module.exports = {
  authUserId: (req, res, next) => {
    if (!req.get('Authorization')) {
      response(res, 401, 'you dont have access')
    } else {
      const token = req.get('Authorization')
      jwt.verify(token, process.env.JWT_SECRET_QLUSTER, (err, decoded) => {  
        if (decoded) {
          req.userId = decoded.id
          next()
        } else {
          response(res, 404, "token not found")
        }
      })
    }
  },
}
