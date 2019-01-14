const response = require('../../lib/newResponse')
const models = require('../../config/models')
const generatedId = require('../../lib/idGenerator')      
const jwtToken = require('../../lib/jwtGenerator') 

const { AppUser, DashboardUser, AppToken, Report } = models
// https://documenter.getpostman.com/view/2342531/RznCqz3m
module.exports = {
    getAllUser: async(appObj) => {
        try {
            const allUser = await AppUser.findAndCountAll()
            return { code: 200, data: allUser.count }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    get: async (appObj) => {
        try {
            const { DashboardUserId, query } = appObj
            const {
                limit, sortby, order, page, searchbyname, filterbycoordinator, searchbycoordinator
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
            if(pageNum > 1) {
                sequelizeQuery.limit = [(pageNum-1) * lim || 0, lim] 
            }

            if(dashboard.RoleId != 'jmkt41ot'){
                sequelizeQuery.where = Object.assign(sequelizeQuery.where, { CoordinatorId: dashboard.id } )
            }
            if(searchbyname) {
                sequelizeQuery.where = Object.assign(sequelizeQuery.where, { name: { $like: `%${searchbyname}%` } } )
            }
            if(searchbycoordinator) {
                sequelizeQuery.where = Object.assign(sequelizeQuery.where, { '$DashboardUser.name$': { $like: `%${searchbycoordinator}%` } } )
            }
            if(filterbycoordinator) {
                sequelizeQuery.where = Object.assign(sequelizeQuery.where, { CoordinatorId : filterbycoordinator } )
            }
            if(lim == 'all'){
                delete sequelizeQuery.limit
            }
            
            const apps = await AppUser.findAndCountAll(sequelizeQuery)
            const result = { count: apps.count, page: Math.ceil(apps.count / lim), rows: [] }
            let appProcess = await apps.rows.map(async (app) => {
                let allReport = await Report.findAndCountAll({
                    where: {
                        AppUserId: app.id
                    }
                })
                let appObject = await getAppDetail(app.id, app, allReport.count)
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
            const splitDob = dob.slice(0,3)
            const fixUsername = splitUsername[0] + splitDob
            if(!coordinator) {
                return { code: 404, data: 'Invalid Coordinator Id' }
            }
            const newAppUser = await AppUser.create({
                id,
                username: fixUsername.toLowerCase(),
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
                
                await AppToken.create({
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
    cekStatus: async (appObj) => {
        try {
            const { oldToken } = appObj
            const findOld = await AppToken.find({
                where: {
                    jwtToken: oldToken
                }
            })
            const findNew = await AppToken.find({
                where: {
                    AppUserId: findOld.AppUserId
                },
                order: [
                    ['createdAt', 'DESC'],
                ]
            })
            if (findOld.jwtToken != findNew.jwtToken) {
                return { code: 401, data: 'Please Relogin' }
            } 
            return { code: 200, data: "You're Login Before" }
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

async function getAppDetail(appId, app, countReport) {
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
      name: app.name,
      dateOfBirth: app.dob,
      createdAt: app.createdAt,
      totalMarker: countReport
    }
    if(app.DashboardUser){
      appObj.coordinatorId = app.DashboardUser.id
      appObj.coordinatorName = app.DashboardUser.name
    }
    
    return appObj
}
  