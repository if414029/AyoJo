const Sequelize = require('sequelize')
const config = require('./config')[process.env.NODE_ENV || 'development']

const sequelize = new Sequelize(config.database, config.username, config.password, config)
const models = {
    User: sequelize.import('../app/user/user_model'),
    Blog: sequelize.import('../app/blog/blog_model'),
    Proyek: sequelize.import('../app/proyek/proyek_model'),
    Home: sequelize.import('../app/home/home_model'),
    BlogPicture: sequelize.import('../app/blog/blog_picture_model'),
    BlogVideo: sequelize.import('../app/blog/blog_video_model'),
    CategoryBlog: sequelize.import('../app/category_blog/category_blog_model'),
    Testimony: sequelize.import('../app/testimony/testimony_model'),
    TestimonyPicture: sequelize.import('../app/testimony/testimony_picture_model'),
}

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models