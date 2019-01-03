const jwt = require('jsonwebtoken')
const models = require('../config/models')
const response = require('../lib/newResponse')

const { AppToken, DashboardToken } = models

module.exports = {
  authApp: async (req, res, next) => {
    if (!req.get('Authorization')) {
      return response(res, 401, 'you dont have access')
    }
    const token = req.get('Authorization').split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET_APP, async (err, decoded) => {
      if (decoded) {
        const checkToken = await models.AppToken.findOne({ where: { AppuserId: decoded.id }, order: [['createdAt', 'DESC']] })
        if (!checkToken) {
          return response(res, 401, 'invalid token')
        }
        if (checkToken.jwtToken !== token) {
          return response(res, 401, 'expired token')
        }
        req.AppuserId = decoded.id
        next()
      } else {
        AppToken.findOne({ where: { jwtToken: token } })
          .then((verifiedToken) => {
            if (verifiedToken) {
              return response(res, 401, 'expired token')
            }
            return response(res, 401, 'invalid token')
          })
      }
    })
  },
  authDashboard: async (req, res, next) => {
    if (!req.get('Authorization')) {
      return response(res, 401, 'you dont have access')
    }
    const token = req.get('Authorization').split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET_DASHBOARD, async (err, decoded) => {
      if (decoded) {
        const checkToken = await models.DashboardToken.findOne({ where: { DashboardUserId: decoded.id }, order: [['createdAt', 'DESC']] })
        if (!checkToken) {
          return response(res, 401, 'invalid token')
        }
        if (checkToken.jwtToken !== token) {
          return response(res, 401, 'expired token')
        }
        req.DashboardUserId = decoded.id
        req.roleName = decoded.role
        req.RoleId = decoded.RoleId
        next()
      } else {
        DashboardToken.findOne({ where: { jwtToken: token } })
          .then((verifiedToken) => {
            if (verifiedToken) {
              return response(res, 401, 'expired token')
            }
            return response(res, 401, 'invalid token')
          })
      }
    })
  },
}
