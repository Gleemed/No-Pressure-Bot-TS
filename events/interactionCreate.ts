import { client } from ".."
import { Event } from "../structures/Event"
import { ExtendedInteraction } from "../typings/Command"
import embed from '../utils/embed'
import { codeBlock } from "@discordjs/builders"
import { errorColor } from '../configuration/embeds.json'
import { GuildMemberRoleManager, CommandInteractionOptionResolver } from "discord.js"

export default new Event("interactionCreate", async (interaction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
        await interaction.deferReply()
        const command = client.commands.get(interaction.commandName)
        if (!command) return interaction.followUp("You have used a non existent command");
        if (command.permissions) {
            if (!interaction.memberPermissions?.has(command.permissions)) {
                let errorEmbed = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`You are missing "${command.permissions}" permission(s) to run this command!`) })
                return interaction.followUp({ embeds: [errorEmbed] })
            }
        }
        if (command.roles) {
            for (let role of command.roles) {
                let cacheRole = interaction.guild?.roles.cache.get(role as string)
                let memberCache = (interaction.member?.roles as GuildMemberRoleManager).cache
                if (!memberCache.has(cacheRole!.id)) {
                    let errorEmbed = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`You are missing the "${cacheRole?.name.toUpperCase()}" role to run this command!`) })
                    return interaction.followUp({ embeds: [errorEmbed] })
                }
            }
        }

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        });
    }
});