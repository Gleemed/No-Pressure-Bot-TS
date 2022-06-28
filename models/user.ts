import { DataTypes } from 'sequelize'
import { sequelize } from '../db'

export const user = sequelize.define('User', {

    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },

    mcuuid: {
        type: DataTypes.STRING,
    }

})