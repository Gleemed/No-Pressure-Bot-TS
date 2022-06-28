import { sequelize } from "../db"

import { user } from '../models/user'
import { strikes } from '../models/strikes'

import embed from '../utils/embed'
import { codeBlock } from "@discordjs/builders"
import { errorColor } from '../configuration/embeds.json'

/**
 * Check linked method
 * 
 * @param {String} id discord user id
 * @resolves user database object
 * @rejects embed error object
 */
export const checkLinked = (id: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await sequelize.sync()
            let usr = await user.findOne({ where: { id: id } })
            resolve(usr)
        } catch(e: any) {
            let err = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`${e.name}`) })
            reject(err)
        }
    })
}

/**
 * Get strikes method
 * 
 * @param {String} uuid minecraft uuid
 * @resolves number of strikes
 * @rejects embed error object
 */
export const getStrikes = (uuid: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await sequelize.sync()
            let str: any = await strikes.findOne({ where: { uuid: uuid } })
            if (!str) {
                try {
                    let newUser = strikes.build({ uuid: uuid })
                    await newUser.save()
                    resolve(0)
                } catch(e: any) {
                    let err = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`${e.message}`) })
                    reject(err)
                }
            }
            resolve(str.strikes)
        } catch(e: any) {
            let err = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`${e.message}`) })
            reject(err)   
        }
    })
}