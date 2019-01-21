const express = require('express')
const dashboardUser = require('./dashboard_user.js')
const response = require('../../lib/newResponse')
const middle = require('../../lib/authMiddleware')
const router = express.Router()

router.get('/wilayah', async(req, res) => {
    req.body.query = req.query
    const result = await dashboardUser.getWilayah(req.body)
    return response(res, result.code, result.data)
})
router.get('/kabupaten', async(req, res) => {
    req.body.query = req.query
    const result = await dashboardUser.getKabupaten(req.body)
    return response(res, result.code, result.data)
})
router.get('/dapil', async(req, res) => {
    req.body.query = req.query
    const result = await dashboardUser.getDapil(req.body)
    return response(res, result.code, result.data)
})
router.get('/', async(req, res) => {
    req.body.query = req.query
    const result = await dashboardUser.get(req.body)
    return response(res, result.code, result.data)
})
router.post('/', async(req, res) => {
    const result = await dashboardUser.create(req.body)
    return response(res, result.code, result.data)
})
router.post('/login', async(req, res) => {
    const result = await dashboardUser.login(req.body)
    res.set({ authorization: `Bearer ${result.header}` })
    return response(res, result.code, result.data)
})
router.post('/logout', async(req, res) => {
    const result = await dashboardUser.logout(req.body)
    return response(res, result.code, result.data)
})
router.post('/cekStatus', async(req, res) => {
    const result = await dashboardUser.cekStatus(req.body)
    return response(res, result.code, result.data)
})
router.put('/:id', async(req, res) => {
    req.body.dashboardUserId = req.params.id
    const result = await dashboardUser.edit(req.body)
    return response(res, result.code, result.data)
})
router.delete('/:id', async(req, res) => {
    req.body.dashboardUserId = req.params.id
    const result = await dashboardUser.delete(req.body)
    return response(res, result.code, result.data)
})

module.exports = router