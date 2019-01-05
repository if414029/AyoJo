const express = require('express')
const report = require('./report')
const response = require('../../lib/newResponse')
const middle = require('../../lib/authMiddleware')
const router = express.Router()
const { authApp, authDashboard } = middle


router.get('/dashboard',async(req, res) => {
    req.body.query = req.query
    const result = await report.getDashboard(req.body)
    return response(res, result.code, result.data)
})
router.get('/mobile', authApp, async(req, res) => {
    req.body.query = req.query
    req.body.AppuserId = req.AppuserId
    const result = await report.getMobile(req.body)
    return response(res, result.code, result.data)
})
router.get('/detailMobile/:id', authApp, async(req, res) => {
    req.body.query = req.query
    req.body.AppuserId = req.AppuserId
    req.body.reportId = req.params.id
    const result = await report.getDetailMobile(req.body)
    return response(res, result.code, result.data)
})
router.post('/', authApp, async(req, res) => {
    req.body.AppuserId = req.AppuserId
    const result = await report.create(req.body)
    return response(res, result.code, result.data)
})
router.put('/:id', async(req, res) => {
    req.body.reportId = req.params.id
    const result = await report.edit(req.body)
    return response(res, result.code, result.data)
})
router.delete('/:id', async(req, res) => {
    req.body.reportId = req.params.id
    const result = await report.delete(req.body)
    return response(res, result.code, result.data)
})

module.exports = router