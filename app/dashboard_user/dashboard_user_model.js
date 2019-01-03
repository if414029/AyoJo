module.exports = (sequelize, DataTypes) => {
    const DashboardUser = sequelize.define('DashboardUser', {
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
    DashboardUser.associate = (models) => {
      DashboardUser.belongsTo(models.Role, { foreignKey: 'RoleId' })
    }
    return DashboardUser
}