const response = require('../../lib/newResponse')
const models = require('../../config/models')
const generatedId = require('../../lib/idGenerator')    
const jwtToken = require('../../lib/jwtGenerator')


const { DashboardUser, Role, DashboardToken } = models

module.exports = {
    get: async (dashboardObj) => {
        try {
            const { query } = dashboardObj
            const {
                limit, sortby, order, page, searchbyname
            } = query

            const pageNum = Number(page) 
            const lim = limit == 'all' ? 'all' : limit ? Number(limit) : 10
            let sequelizeQuery = {
                distinct: true,
                include: [
                  { model: Role }
                ],
                where: { 
                    RoleId: { $ne: 'jmkt41ot' }
                },
                order: [
                  [sortby || 'id' , order || 'DESC']
                ],
                limit: lim 
            }
            if(searchbyname) {
                sequelizeQuery.where = Object.assign(sequelizeQuery.where, { name: { $like: `%${searchbyname}%` } } )
            }
            if(lim == 'all'){
                delete sequelizeQuery.limit
            }
            
            const dashboards = await DashboardUser.findAndCountAll(sequelizeQuery)
            const result = { count: dashboards.count, page: Math.ceil(dashboards.count / lim), rows: [] }
            let dashboardProcess = await dashboards.rows.map(async (dashboard) => {
                let dashboardObject = await getDashboardDetail(dashboard.id, dashboard)
                await result.rows.push(dashboardObject)
            })
            await Promise.all(dashboardProcess)

            return { code: 200, data: Object.assign(result, { page: Math.ceil(result.count / lim) || 1 }) }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    create: async (dashboardObj) => {
        try {
            const { username, password, name, dob, RoleId } = dashboardObj
            const id = generatedId() 
            const splitUsername = name.split(' ')
            const splitDob = dob.split('-')
            const fixUsername = splitUsername[0] + splitDob[2]
            const newDashboardUser = await DashboardUser.create({
                id,
                username: fixUsername.toLowerCase(),
                password: generatedId(),
                name,
                dob,
                RoleId: 'jmdsa4lk'
            })
            return { code: 200, data: newDashboardUser }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    login: async (dashboardObj) => {
        try {
            const { username, password } = dashboardObj
            if (!username) {
                return { code: 400, data: 'username must not be empty' }
            }
            if (!password) {
                return { code: 400, data: 'password must not be empty' }
            }
            const dashboard = await DashboardUser.findOne({ where: { username } })
            if (!dashboard) {
                return { code: 401, data: 'username or password is not valid' }
            }

            if(password === dashboard.password){
                const role = await Role.findById(dashboard.RoleId)
                const id = generatedId()
                const data = {
                    username: dashboard.username,
                    name: dashboard.name,
                    dob: dashboard.dob,
                    roleId: role.id,
                    roleName: role.name
                }

                const header = await jwtToken(
                    { 
                        id: dashboard.id, 
                        username: dashboard.username, 
                        role: role.name, 
                        RoleId: role.id 
                    },
                    process.env.JWT_SECRET_DASHBOARD, 
                    {},
                )

                const result = { code: 200, data, header }
                
                await DashboardToken.create({
                    id,
                    jwtToken: header,
                    DashboardUserId: dashboard.id
                })
                return result
            }
            return { code: 401, data: 'email or password is not valid' }          
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    logout: async (dashboardObj) => {
        try {
            return { code: 200, data: 'you have successfully logged out' }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    edit: async (dashboardObj) => {
        try {

        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    delete: async (dashboardObj) => {
        try {

        } catch (e) {
            return { code: 500, data: e.message }
        }
    }
}

async function getDashboardDetail(dashboardId, dashboard) {
    if(!dashboard) {
      dashboard = await DashboardUser.findOne({
        where: {
          id: dashboardId
        },
        include: [
          { model: Role },
        ]
      })
    }
    const dashboardObj = {
      id: dashboard.id,
      username: dashboard.username,
      password: dashboard.password,
      name: dashboard.fullName,
      dateOfBirth: dashboard.dob,
      createdAt: dashboard.createdAt,
    }
    if(dashboard.Role){
      dashboardObj.roleId = dashboard.Role.id
      dashboardObj.roleName = dashboard.Role.name
    }
    
    return dashboardObj
  }
  