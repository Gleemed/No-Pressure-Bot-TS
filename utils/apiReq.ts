import axios from 'axios'
import { token } from '../configuration/api.json'
import embed from '../utils/embed'
import emConf from '../configuration/embeds.json'
import { codeBlock } from '@discordjs/builders'

// Get guild info
/**
 * @param {String} ign minecraft ign
 * @resolves JSON object
 * @rejects error embed object
 */
export const getGuild = async (ign: string) => {
    let guild: unknown
    return new Promise(async (resolve, reject) => {
        // Try to get guild from provided ign
        try {
            guild = await axios.get(`https://api.slothpixel.me/api/guilds/${ign}?key=${token}`)
        } catch(e: any) {
            if (e.response.status == 404) {
                let errEmbed = await embed({ title: 'ERROR!', color: emConf.errorColor, description: codeBlock(`The player "${ign.toUpperCase()}" is not in a guild!`) });
                reject(errEmbed);
            } else if (e.response.status == 400) {
                let errEmbed = await embed({ title: 'ERROR!', color: emConf.errorColor, description: codeBlock(`There was an issue with the API. Please try again.`) });
                reject(errEmbed);
            } else if (e.response.status == 408) {
                let errEmbed = await embed({ title: 'ERROR!', color: emConf.errorColor, description: codeBlock(`The request timed out. Please try again.`) });
                reject(errEmbed);
            } else if (e.response.status == 500) {
                let errEmbed = await embed({ title: 'ERROR!', color: emConf.errorColor, description: codeBlock(`500 internal server error. Please try again.`) });
                reject(errEmbed);
            } else {
                let errEmbed = await embed({ title: 'ERROR!', color: emConf.errorColor, description: codeBlock(`An unknown error occured. Please try again.`) });
                reject(errEmbed);
            }  
        }
        resolve(guild)
    })
}

// Get player info
/**
 * @param {String} ign minecraft ign
 * @resolves JSON object
 * @rejects error embed object
 */
export const getPlayer = async (ign: string) => {
    let player: any
    return new Promise(async (resolve, reject) => {
        try {
            player = await axios.get(`https://api.slothpixel.me/api/players/${ign}?key=${token}`)
        } catch(e: any) {
            if (e.response.status == 404) {
                let errEmbed = await embed({ title: 'ERROR!', color: emConf.errorColor, description: codeBlock(`404 Error. Please try again.`) });
                reject(errEmbed);
            } else {
                let errEmbed = await embed({ title: 'ERROR!', color: emConf.errorColor, description: codeBlock(`An unknown error occured. Please try again.`) });
                reject(errEmbed);
            }        
        }
        resolve(player)
    })
}