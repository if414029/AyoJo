const express = require('express')

const router = express.Router()
const Multer = require('multer')
const imgUpload = require('../../lib/imgUpload')

const multer = Multer({
  storage: Multer.MemoryStorage,
})

router.post('/multi', multer.array('file', 10), imgUpload.uploadMulti, (req, res, next) => {
    res.status(200).json({
      status: true,
      message: 'OK',
      result: req.fileArr,
    })
})

router.post('/single', multer.single('file'), imgUpload.uploadSingle, (req, res, next) => {
  if(req.file && req.file.cloudStoragePublicUrl){
    res.status(200).json({
      status: true,
      message: 'OK',
      result: req.filePhoto,
    })
  } else {
    res.status(500).json({
      status: false,
      message: 'An error has occured, please try again.',
      result: [],
    })
  }
})


module.exports = router
