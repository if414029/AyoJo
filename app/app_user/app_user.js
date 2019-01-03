const response = require('../../lib/newResponse')
const models = require('../../config/models')
const generatedId = require('../../lib/idGenerator')      
const jwtToken = require('../../lib/jwtGenerator') 

const { AppUser, DashboardUser,AppToken } = models
// https://documenter.getpostman.com/view/2342531/RznCqz3m
module.exports = {
    get: async (appObj) => {
        try {
            const { DashboardUserId, query } = appObj
            const {
                limit, sortby, order, page, searchbyname
            } = query
            const dashboard = await DashboardUser.findById(DashboardUserId)
            const pageNum = Number(page) 
            const lim = limit == 'all' ? 'all' : limit ? Number(limit) : 10
            let sequelizeQuery = {
                distinct: true,
                include: [
                  { model: DashboardUser }
                ],
                where: { },
                order: [
                  [sortby || 'id' , order || 'DESC']
                ],
                limit: lim 
            }
            if(dashboard.RoleId != 'jmkt41ot'){
                sequelizeQuery.where = Object.assign(sequelizeQuery.where, { CoordinatorId: dashboard.id } )
            }
            if(searchbyname) {
                sequelizeQuery.where = Object.assign(sequelizeQuery.where, { name: { $like: `%${searchbyname}%` } } )
            }
            if(lim == 'all'){
                delete sequelizeQuery.limit
            }
            
            const apps = await AppUser.findAndCountAll(sequelizeQuery)
            const result = { count: apps.count, page: Math.ceil(apps.count / lim), rows: [] }
            let appProcess = await apps.rows.map(async (app) => {
                let appObject = await getAppDetail(app.id, app)
                await result.rows.push(appObject)
            })
            await Promise.all(appProcess)

            return { code: 200, data: Object.assign(result, { page: Math.ceil(result.count / lim) || 1 }) }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    create: async (appObj) => {
        try {
            const { username, password, name, dob, CoordinatorId } = appObj
            const id = generatedId() 
            const coordinator = await DashboardUser.findById(CoordinatorId)
            const splitUsername = name.split(' ')
            const splitDob = dob.split('-')
            const fixUsername = splitUsername[0] + splitDob[2]
            if(!coordinator) {
                return { code: 404, data: 'Invalid Coordinator Id' }
            }
            const newAppUser = await AppUser.create({
                id,
                username: fixUsername,
                password: generatedId(),
                name,
                dob,
                CoordinatorId: coordinator.id
            })
            return { code: 200, data: newAppUser }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    login: async (appObj) => {
        try {
            const { username, password } = appObj
            if (!username) {
                return { code: 400, data: 'username must not be empty' }
            }
            if (!password) {
                return { code: 400, data: 'password must not be empty' }
            }
            const app = await AppUser.findOne({ where: { username } })
            if (!app) {
                return { code: 401, data: 'username or password is not valid' }
            }

            if(password === app.password){
                const coordinator = await DashboardUser.findById(app.CoordinatorId)
                const id = generatedId() 
                const data = {
                    username: app.username,
                    name: app.name,
                    dob: app.dob,
                    coordinatorId: coordinator.id,
                    coordinatorName: coordinator.name
                }

                const header = await jwtToken(
                    { 
                        id: app.id, 
                        username: app.username, 
                        coordinatorName: coordinator.name, 
                        coordinatorId: coordinator.id 
                    },
                    process.env.JWT_SECRET_APP, 
                    {},
                )
        
                const result = { code: 200, data, header }
                AppToken.create({
                    id,
                    jwtToken: header,
                    AppUserId: app.id
                })
                return result
            }
            return { code: 401, data: 'email or password is not valid' }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    logout: async (appObj) => {
        try {
            return { code: 200, data: 'you have successfully logged out' }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    edit: async (appObj) => {
        try {

        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    delete: async (appObj) => {
        try {

        } catch (e) {
            return { code: 500, data: e.message }
        }
    }
}

async function getAppDetail(appId, app) {
    if(!app) {
      app = await AppUser.findOne({
        where: {
          id: appId
        },
        include: [
          { model: DashboardUser },
        ]
      })
    }
    const appObj = {
      id: app.id,
      username: app.username,
      password: app.password,
      name: app.fullName,
      dateOfBirth: app.dob,
      createdAt: app.createdAt,
    }
    if(app.DashboardUser){
      appObj.coordinatorId = app.DashboardUser.id
      appObj.coordinatorName = app.DashboardUser.name
    }
    
    return appObj
  }
  