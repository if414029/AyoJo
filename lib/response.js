module.exports = {
    Ok: (res, data) => {
      res.status(200).json({
        status: 'success',
        data,
      })
    },
    Unauthorized: (res, data) => {
      res.status(401).json({
        status: 'fail',
        data,
      })
    },
    NotFound: (res, data) => {
      res.status(404).json({
        status: 'fail',
        data,
      })
    },
    Error: (res, data) => {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        data,
      })
    },
    BadRequest: (res, data) => {
      res.status(400).json({
        status: 'fail',
        data,
      })
    },
    Created: (res, data) => {
      res.status(201).json({
        status: 'success',
        data,
      })
    },
    Conflict: (res, data) => {
      res.status(409).json({
        status: 'fail',
        data,
      })
    },
    Forbidden: (res, data) => {
      res.status(403).json({
        status: 'fail',
        data,
      })
    },
  }
  