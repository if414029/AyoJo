const Sequelize = require('sequelize')
const config = require('./config')[process.env.NODE_ENV || 'development']

const sequelize = new Sequelize(config.database, config.username, config.password, config)
const models = {
    AppUser: sequelize.import('../app/app_user/app_user_model'),
    AppToken: sequelize.import('../app/app_token/app_token_model'),
    DashboardToken: sequelize.import('../app/dashboard_token/dashboard_token_model'),
    DashboardUser: sequelize.import('../app/dashboard_user/dashboard_user_model'),
    Report: sequelize.import('../app/report/report_model'),
    Role: sequelize.import('../app/dashboard_user/role_model'),
    Wilayah: sequelize.import('../app/dashboard_user/wilayah_model'),
    Kabupaten: sequelize.import('../app/dashboard_user/kabupaten_model'),
    Dapil: sequelize.import('../app/dashboard_user/dapil_model'),
    OtherSurveyor: sequelize.import('../app/other_surveyor/other_surveyor_model'),
    OtherSurveyorToken: sequelize.import('../app/other_surveyor_token/other_surveyor_token_model'),
    OtherReport: sequelize.import('../app/other_report/other_report_model'),
    Kegiatan: sequelize.import('../app/foto/kegiatan_model'),
    Daerah: sequelize.import('../app/foto/daerah_model'),
    Foto: sequelize.import('../app/foto/foto_model'),
}

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models