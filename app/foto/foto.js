const response = require('../../lib/newResponse')
const models = require('../../config/models')
const generatedId = require('../../lib/idGenerator')    
const jwtToken = require('../../lib/jwtGenerator')

const { DashboardUser, Foto, Kegiatan, Daerah } = models

module.exports = {
    listKegiatan: async (fotoObj) => {
        try {
            const { query } = fotoObj
            const kegiatan = await Kegiatan.findAll()

            return { code: 200, data: kegiatan }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    listDaerah: async (fotoObj) => {
        try {
            const { query } = fotoObj
            const daerah = await Daerah.findAll()

            return { code: 200, data: daerah }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    },
    create: async (fotoObj) => {
        try {
            const { KegiatanId, DaerahId, photo, keterangan } = fotoObj
            const id = generatedId() 
            
            if(RoleId != 'jmvsa53l'){
                return { code: 401, data: "You don't have access" }
            }
            
            const kegiatan = await Kegiatan.findById(KegiatanId)
            const daerah = await Daerah.findById(DaerahId)

            if(!kegiatan) {
                return { code: 400, data: "Kegiatan Id not found" }
            }
            if(!daerah) {
                return { code: 400, data: "Daerah Id not found" }
            }

            const newFoto = await Foto.create({
                id,
                nama,
                keterangan,
                KegiatanId,
                DaerahId,
            })
            return { code: 200, data: newFoto }
        } catch (e) {
            return { code: 500, data: e.message }
        }
    }
}
