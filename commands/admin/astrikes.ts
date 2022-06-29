import { Command } from '../../structures/Command'
import embed from '../../utils/embed'
import { errorColor } from '../../configuration/embeds.json'
import { codeBlock } from '@discordjs/builders'
import { guildStaffRole } from '../../configuration/discord.json'
import { changeStrikes, getStrikes } from '../../utils/database'
import { convert } from '../../utils/ignConverter'


export default new Command({
    name: "astrikes",
    description: "Admin command for managing strikes",
    roles: [guildStaffRole],
    options: [
        {
            name: "give",
            description: "Give a player strikes",
            type: 1,
            options: [
                {
                    name: "ign",
                    description: "Minecraft IGN",
                    type: 3,
                    required: true
                },
                {
                    name: "amount",
                    description: "Amount of strikes to give",
                    type: 4,
                    min_value: 1,
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Remove strikes from a player",
            type: 1,
            options: [
                {
                    name: "ign",
                    description: "Minecraft IGN",
                    type: 3,
                    required: true
                },
                {
                    name: "amount",
                    description: "Amount of strikes to remove",
                    type: 4,
                    min_value: 1,
                    required: true
                }
            ]
        },
        {
            name: "set",
            description: "Set a player's strikes to a specific value",
            type: 1,
            options: [
                {
                    name: "ign",
                    description: "Minecraft IGN",
                    type: 3,
                    required: true
                },
                {
                    name: "amount",
                    description: "Amount of strikes to set",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "reset",
            description: "Remove strikes for a player",
            type: 1,
            options: [
                {
                    name: "ign",
                    description: "Minecraft IGN",
                    type: 3,
                    required: true
                }
            ]
        }
    ],
    run: async ({ interaction, args, client }) => {
        let ign: string = args.data[0].options![0].value as string
        let subcommand: string = args.getSubcommand()
        try {
            var uuid: string = await convert(ign) as string
            var strikes: number = await getStrikes(uuid) as number
        } catch(e: any) {
            return interaction.followUp({ embeds: [e] })
        }
        if (subcommand == "give") {
            let changeValue: number = args.data[0].options![1].value as number
            try {
                await changeStrikes(uuid, (strikes + changeValue))
            } catch(e: any) {
                return interaction.followUp({ embeds: [e] })
            }
            let success = await embed({ description: codeBlock(`The player "${ign.toUpperCase()}" now has ${strikes + changeValue} strike(s)!`) })
            return interaction.followUp({ embeds: [success] })
        }
        if (subcommand == "remove") {
            let changeValue: number = args.data[0].options![1].value as number
            if (changeValue > strikes) {
                let err = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`A player can't have less than 0 strikes!`) + codeBlock(`The player "${ign.toUpperCase()}" has ${strikes} strike(s)!`) })
                return interaction.followUp({ embeds: [err] })
            }
            try {
                await changeStrikes(uuid, (strikes - changeValue))
            } catch(e: any) {
                return interaction.followUp({ embeds: [e] })
            }
            let success = await embed({ description: codeBlock(`The player "${ign.toUpperCase()}" now has ${strikes - changeValue} strike(s)!`) })
            return interaction.followUp({ embeds: [success] })
        }
        if (subcommand == "set") {
            let changeValue: number = args.data[0].options![1].value as number
            try {
                await changeStrikes(uuid, changeValue)
            } catch(e: any) {
                return interaction.followUp({ embeds: [e] })
            }
            let success = await embed({ description: codeBlock(`The player "${ign.toUpperCase()}" now has ${changeValue} strike(s)!`) })
            return interaction.followUp({ embeds: [success] })
        }
        if (subcommand == "reset") {
            try {
                await changeStrikes(uuid, 0)
            } catch(e: any) {
                return interaction.followUp({ embeds: [e] })
            }
            let success = await embed({ description: codeBlock(`The player "${ign.toUpperCase()}" now has 0 strikes!`) })
            return interaction.followUp({ embeds: [success] })
        }
    }
})