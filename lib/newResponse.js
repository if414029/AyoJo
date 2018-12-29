module.exports = (res, code, data) => {
  if (code === 200) {
    return res.status(200).json({
      status: 'success',
      data,
    })
  } else if (code === 202) {
    return res.status(202).json({
      status: 'success',
      data,
    })
  } else if (code === 500) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      data,
    })
  } else if (code === 400) {
    return res.status(400).json({
      status: 'fail',
      data,
    })
  } else if (code === 403) {
    return res.status(403).json({
      status: 'fail',
      data,
    })
  } else if (code === 404) {
    return res.status(404).json({
      status: 'fail',
      data,
    })
  }
  return res.status(code).json({
    status: 'fail',
    data,
  })
}
