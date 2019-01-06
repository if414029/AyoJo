module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('Report', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
        },
        name: DataTypes.STRING,
        address1: DataTypes.STRING,
        address2: DataTypes.STRING,
        pekerjaan: DataTypes.STRING,
        usia: DataTypes.STRING,
        jenisKelamin: DataTypes.STRING,
        lat: DataTypes.STRING,
        lng: DataTypes.STRING,
        images: DataTypes.STRING,
        answer1: DataTypes.STRING,
        answer2: DataTypes.STRING,
        kelurahan: DataTypes.STRING,
        kecamatan: DataTypes.STRING,
        kabupaten: DataTypes.STRING,
        provinsi: DataTypes.STRING
    })
    Report.associate = (models) => {
        Report.belongsTo(models.AppUser, { foreignKey: 'AppUserId' })
    }
    return Report
}