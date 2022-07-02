import { codeBlock } from '@discordjs/builders'
import { Command } from '../../structures/Command'
import { getGuild, getPlayer } from '../../utils/apiReq'
import { checkLinked, linkUser, unlinkUser } from '../../utils/database'
import embed from '../../utils/embed'
import { errorColor } from '../../configuration/embeds.json'
import { convert } from '../../utils/ignConverter'
import { name } from '../../configuration/guild.json'
import { guildMemberRole } from '../../configuration/discord.json'
import { RoleResolvable } from 'discord.js'

export default new Command({
    name: "gmember",
    description: "Link/unlink your Discord to your Hypixel account",
    options: [
        {
            name: "link",
            description: "Link your Discord to your Hypixel account",
            type: 1,
            options: [
                {
                    name: "ign",
                    description: "Minecraft IGN",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "unlink",
            description: "Unlink your Discord from your Hypixel account",
            type: 1,
        }
    ],
    run: async ({ interaction, args, client }) => {
        let subcommand: string = args.getSubcommand()
        if (subcommand == "link") {
            let ign: string = args.data[0].options![0].value as string
            try {
                await checkLinked(interaction.user.id)
                var guild: any = await getGuild(ign)
                if (guild.data.name != name) {
                    let err = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`The IGN "${ign.toUpperCase()}" is not in the "${name.toUpperCase()}" guild!`) })
                    return interaction.followUp({ embeds: [err] })
                }
                var player: any = await getPlayer(ign)
                if (player.data.links.DISCORD != (interaction.user.username + "#" + interaction.user.discriminator)) {
                    let err = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`The linked Discord account is not the same as your Discord account!`) + codeBlock(`Linked Account: ${player.data.links.DISCORD}`) + codeBlock(`Your Account: ${interaction.user.username + "#" + interaction.user.discriminator}`) })
                    return interaction.followUp({ embeds: [err] })
                }
                let uuid: string = await convert(ign) as string
                await linkUser(interaction.user.id, uuid)
                let role = interaction.guild?.roles.cache.get(guildMemberRole)
                await interaction.member.roles.add(role as RoleResolvable)
            } catch(e: any) {
                return interaction.followUp({ embeds: [e] })
            }
            let success = await embed({ title: "ACCOUNT LINKED", description: codeBlock(`You have successfully linked your Discord account ${interaction.user.username + "#" + interaction.user.discriminator} to the Minecraft account "${ign.toUpperCase()}"!`) + codeBlock(`TO UNLINK: Run /gmember unlink`) + codeBlock(`NOTICE: You have been given the "GUILD MEMBER" role!`) })
            return interaction.followUp({ embeds: [success] })
        }
        if (subcommand == "unlink") {
            try {
                await unlinkUser(interaction.user.id)
                let role = interaction.guild?.roles.cache.get(guildMemberRole)
                await interaction.member.roles.remove(role as RoleResolvable)
            } catch(e: any) {
                return interaction.followUp({ embeds: [e] })
            }
            let success = await embed({ title: "ACCOUNT UNLINKED", description: codeBlock(`You have successfully unlinked your Discord account ${interaction.user.username + "#" + interaction.user.discriminator}!`) + codeBlock(`TO RELINK: Run /gmember link <IGN>`) + codeBlock(`NOTICE: Your "GUILD MEMBER" role has been removed!`) })
            return interaction.followUp({ embeds: [success] })
        }
    }
})