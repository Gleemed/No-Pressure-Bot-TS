import { DataTypes } from 'sequelize'
import { sequelize } from '../db'

export const strikes = sequelize.define('Strikes', {

    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    strikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }

})