module.exports = (sequelize, DataTypes) => {
    const AppUser = sequelize.define('AppUser', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        name: DataTypes.STRING,
        dob: DataTypes.STRING  
    })
    AppUser.associate = (models) => {
      AppUser.belongsTo(models.DashboardUser, { foreignKey: 'CoordinatorId' })  
    }
    return AppUser
}