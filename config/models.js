const Sequelize = require('sequelize')
const config = require('./config')[process.env.NODE_ENV || 'development']

const sequelize = new Sequelize(config.database, config.username, config.password, config)
const models = {
    AppToken: sequelize.import('../app/app_token'),
    AppUser: sequelize.import('../app/app_user'),
    DashboardToken: sequelize.import('../app/dashboard_token'),
    DashboardUser: sequelize.import('../app/dashboard_user'),
    Report: sequelize.import('../app/report'),
    Role: sequelize.import('../app/dashboard_user')
}

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models