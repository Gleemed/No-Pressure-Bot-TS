import axios from 'axios'
import embed from '../utils/embed'
import { errorColor } from '../configuration/embeds.json'
import { codeBlock } from '@discordjs/builders'

// ign to uuid
/**
 * @param {String} ign minecraft ign
 * @resolves minecraft uuid
 * @rejects error embed object
 */
export const convert = async (ign: String) => {
    return new Promise(async (resolve, reject) => {
        let player;
        try {
            player = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`)
        } catch(e: any) {
            let errorEm = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`${e.message}`) });
            reject(errorEm)
        }

        if (!player) {
            let errorEm = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`Invalid IGN provided.`) })
            reject(errorEm)
        } else if (player.status == 200) {
            resolve(player.data.id)
        } else if (player.status == 204) {
            let err = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`The IGN "${ign.toUpperCase()}" is invalid!`) })
            reject(err)
        } else {
            let errorEm = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`An unknown error occured. Please try again.`) });
            reject(errorEm)  
        }
    })
}

// convert to ign
/**
 * @param {String} uuid
 * @resolves minecraft ign
 * @rejects error embed object
 */
export const convertToIgn = async (uuid: String) => {
    return new Promise(async (resolve, reject) => {
        try {
            let player = await axios.get(`https://playerdb.co/api/player/minecraft/${uuid}`);
            if (player.data.success == false) {
                let errorEm = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`Invalid IGN provided.`) })
                reject(errorEm)
            } else {
                resolve(player.data.data.player.username)
            }
        } catch(e) {
            let errorEm = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`An unknown error occured. Please try again.`) });
            reject(errorEm)
        }
    })
}