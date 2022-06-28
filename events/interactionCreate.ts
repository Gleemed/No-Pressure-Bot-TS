import { CommandInteractionOptionResolver } from "discord.js"
import { client } from ".."
import { Event } from "../structures/Event"
import { ExtendedInteraction } from "../typings/Command"
import embed from '../utils/embed'
import { codeBlock } from "@discordjs/builders"
import { errorColor } from '../configuration/embeds.json'

export default new Event("interactionCreate", async (interaction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
        await interaction.deferReply()
        const command = client.commands.get(interaction.commandName)
        if (!command) return interaction.followUp("You have used a non existent command");
        if (command.permissions) {
            if (!interaction.memberPermissions?.has(command.permissions)) {
                let errorEmbed = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`You are missing ${command.permissions} permission(s) to run this command!`) })
                return interaction.followUp({ embeds: [errorEmbed] })
            }
        }

        const args = []
        for (let option of interaction.options.data) {
            args.push(option.value)
        }

        command.run({
            args: args as string[],
            client,
            interaction: interaction as ExtendedInteraction
        });
    }
});