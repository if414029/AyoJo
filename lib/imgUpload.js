const storage = require('@google-cloud/storage');
const Jimp = require('jimp')
const generateId = require('../lib/idGenerator')
const gcs = storage({
  projectId: 'ayojodevelopment',
  keyFilename: "./ayojo-development.json"
});

const bucketName = 'bucketdbayo'
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${bucketName}/${filename}`
}

const ImgUpload = {}

ImgUpload.uploadMulti = async (req, res, next) => {
  if (!req.files || !req.files[0]) {
    res.status(500).json({
      status: false,
      message: 'An error has occured, please try again.',
      result: [],
    })
  }
  else {
    const arrFile = []
    // Can optionally add a path to the gcsname below by concatenating it before the filename
    const getLink = await req.files.map(async (data) => {
      const indexSlash = data.mimetype.split('').indexOf('/') + 1
      const mimeType = data.mimetype.slice(indexSlash)
      const gcsname = generateId()+'.'+mimeType
      let resizeImg = await Jimp.read(data.buffer)
      .then(img => {
        return img
          // .resize(720, Jimp.AUTO) // resize
          .quality(60) // set JPEG quality
          .getBufferAsync(data.mimetype); // save
      })
      .catch(err => {
        console.log('resize image Error: ', err)
      })
      data.buffer = resizeImg
      const file = bucket.file(gcsname)
      const stream = file.createWriteStream({
        metadata: {
          contentType: data.mimetype,
        },
      })
      
      stream.on('error', (err) => {
        req.file.cloudStorageError = err
        next(err)
      })

      stream.on('finish', () => {
        data.cloudStorageObject = gcsname
        file.makePublic().then(() => {
          data.cloudStoragePublicUrl = getPublicUrl(gcsname)
        })
      })
      arrFile.push(getPublicUrl(gcsname))

      stream.end(data.buffer)
    })
    await Promise.all(getLink)

    req.fileArr = arrFile
    next()
  }
}

ImgUpload.uploadSingle = async (req, res, next) => {
  if (!req.file) {
    return next()
  }
  const { source } = req.query
  const indexSlash = req.file.mimetype.split('').indexOf('/') + 1
  const mimeType = req.file.mimetype.slice(indexSlash)
  const gcsname = generateId()+'.'+mimeType
  req.filePhoto = getPublicUrl(gcsname)
  if (source !== 'camera') {
    let resizeImg = await Jimp.read(req.file.buffer)
    .then(img => {
      return img
        // .resize(720, Jimp.AUTO) // resize
        .quality(60) // set JPEG quality
        .getBufferAsync(req.file.mimetype); // save
    })
    .catch(err => {
      console.log('resize image Error: ', err)
    })
    req.file.buffer = resizeImg
  }
  
  const file = bucket.file(gcsname)
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  })

  stream.on('error', (err) => {
    req.file.cloudStorageError = err
    next(err)
  })

  stream.on('finish', async () => {
    req.file.cloudStorageObject = gcsname
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
      next()
    })
  })
  stream.end(req.file.buffer)

}

module.exports = ImgUpload
