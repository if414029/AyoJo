const express = require('express')
const appUser = require('./app_user')
const response = require('../../lib/newResponse')
const middle = require('../../lib/authMiddleware')
const router = express.Router()
const { authDashboard } = middle

router.get('/', authDashboard, async(req, res) => {
    req.body.query = req.query
    req.body.DashboardUserId = req.DashboardUserId
    const result = await appUser.get(req.body)
    return response(res, result.code, result.data)
})
router.get('/getAllUser', async(req, res) => {
    const result = await appUser.getAllUser(req.body)
    return response(res, result.code, result.data)
})
router.post('/', async(req, res) => {
    const result = await appUser.create(req.body)
    return response(res, result.code, result.data)
})
router.post('/login', async(req, res) => {
    const result = await appUser.login(req.body)
    res.set({ authorization: `Bearer ${result.header}` })
    return response(res, result.code, result.data)
})
router.post('/logout', async(req, res) => {
    const result = await appUser.logout(req.body)
    return response(res, result.code, result.data)
})
router.post('/cekStatus', async(req, res) => {
    const result = await appUser.cekStatus(req.body)
    return response(res, result.code, result.data)
})
router.put('/:id', async(req, res) => {
    req.body.AppUserId = req.params.id
    const result = await appUser.edit(req.body)
    return response(res, result.code, result.data)
})
router.delete('/:id', async(req, res) => {
    req.body.AppUserId = req.params.id
    const result = await appUser.delete(req.body)
    return response(res, result.code, result.data)
})

module.exports = router