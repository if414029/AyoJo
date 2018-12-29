require('dotenv').config()
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const swagger = require('swagger-ui-express')
const docs = require('../docs')
const users = require('./user')
const blogs = require('./blog')
const testimonies = require('./testimony')
const uploads = require('./upload/uploads')
const proyeks = require('./proyek')
const homes = require('./home')
const categoryBlogs = require('./category_blog')
require('dotenv').config({})

const app = express()
// server use
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(cors('*'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/docs', swagger.serve, swagger.setup(docs, {
  customeSiteTitle: 'Produk Profil Qluster',
  customfavIcon: 'Produk Profil Qluster',
  customCss: '.swagger-ui .topbar { display: none }',
}))

app.use(['/api/users', '/api/users'], users)
app.use(['/api/blogs', '/api/blogs'], blogs)
app.use(['/api/testimonies', '/api/testimonies'], testimonies)
app.use(['/api/uploads', '/api/uploads'], uploads)
app.use(['/api/proyeks', '/api/proyeks'], proyeks)
app.use(['/api/homes', '/api/homes'], homes)
app.use(['/api/categoryBlogs', '/api/categoryBlogs'], categoryBlogs)

// handling unhandled rejection
process.on('unhandledRejection', (reason) => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection at: ', reason.stack || reason)
})
// new Promise((_, reject) => reject({ test: 'woops!' }))
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})
// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// app.listen(3000, () => console.log('SML app listening on port 3000!'))

module.exports = app
