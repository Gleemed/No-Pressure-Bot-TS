import { Sequelize, DataTypes, Model } from 'sequelize'

export const sequelize = new Sequelize('data', null as unknown as string, null as unknown as string, {
    dialect: 'sqlite',
    storage: 'data.sqlite',
    logging: false,
})