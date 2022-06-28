import config from '../configuration/embeds.json'
import { MessageEmbed, ColorResolvable } from 'discord.js'

/**
 * 
 * @param {Object} value
 * @param {String} title embed title
 * @param {String} color embed color
 * @param {String} footer embed footer text
 * @param {String} description
 * @param {Object} fields embed fields object
 * @param {URL} image embed image url
 * @returns embed object
 */
export default async function embed(value: any) {
    const embed = new MessageEmbed();
    value.title ? embed.setTitle(value.title) : embed.setTitle('SUCCESS!');
    value.color ? embed.setColor(value.color) : embed.setColor(config.baseColor as ColorResolvable);
    value.footer ? embed.setFooter({ text: value.footer, iconURL: config.footerIconURL }) : embed.setFooter({ text: config.footer, iconURL: config.footerIconURL });
    if (value.description) embed.setDescription(value.description);
    if (value.fields) embed.setFields(value.fields);
    if (value.image) embed.setImage(value.image);
    if (value.thumbnail) embed.setThumbnail(value.thumbnail);
    embed.setTimestamp();
    return embed;
}