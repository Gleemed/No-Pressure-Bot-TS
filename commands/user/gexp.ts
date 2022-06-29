import { Command } from '../../structures/Command'

import { name, gexpreq } from '../../configuration/guild.json'

import embed from '../../utils/embed'
import { errorColor } from '../../configuration/embeds.json'
import { codeBlock } from '@discordjs/builders'

import { checkLinked, getStrikes } from '../../utils/database'
import { convertToIgn, convert } from '../../utils/ignConverter'
import { getGuild, getPlayer } from '../../utils/apiReq'

export default new Command({
    name: "gexp",
    description: "this is a test command",
    options: [
        {
            name: "ign",
            description: "Minecraft IGN",
            type: 3,
        }
    ],
    run: async ({ interaction, args, client }) => {

        // Check if account is linked
        let ign: string
        if (!args.data[0]) {
            try {
                let uuid = await checkLinked(interaction.user.id)
                if (!uuid) {
                    let err = await embed({ title: 'ERROR!', color: errorColor, description: `Incorrect usage! Correct usage: ` + codeBlock(`/gexp <IGN>`) })
                    return interaction.followUp({ embeds: [err] })
                }
                let linkedIgn = await convertToIgn(uuid as string)
                ign = linkedIgn as string
            } catch(e: any) {
                return interaction.followUp({ embeds: [e] })
            }
        } else {
            ign = args.data[0].options![0].value as string
        }

        // Check if valid ign
        try {
            var uuid = await convert(ign as string)
        } catch(e: any) {
            return interaction.followUp({ embeds: [e] })
        }

        // Get guild about player
        try {
            var guild: any = await getGuild(ign as string)
            if (guild.data.name != name) {
                let err = await embed({ title: 'ERROR!', color: errorColor, description: codeBlock(`You are not in the "${name.toUpperCase()}" guild!`) })
                return interaction.followUp({ embeds: [err] })
            }
        } catch(e: any) {
            return interaction.followUp({ embeds: [e] })
        }

        // Get information about player
        try {
            var playerInfo: any = await getPlayer(ign as string)
        } catch(e: any) {
            return interaction.followUp({ embeds: [e] })
        }

        // Loop through object
        for (let i = 0; i < guild.data.members.length; i++) {
            
            const memberUUID = guild.data.members[i].uuid
            var memberInfo = guild.data.members[i]

            if (memberUUID === playerInfo.data.uuid) {
                var expHistory = guild.data.members[i].exp_history
                break;
            }
        }

        // Remove all values that are before monday
        let target = 1;
        let ndate = new Date()
        let estDate = ndate.toLocaleDateString("en-US", {timeZone: "America/New_York"})
        let tdate = new Date(estDate)
        let lastMonStamp = tdate.setDate(tdate.getDate() - ( tdate.getDay() == target ? 7 : (tdate.getDay() + (7 - target)) % 7 ))
        let lastMon = new Date(lastMonStamp)

        // Convert keys/dates to value/amount
        let dates: any = Object.keys(expHistory)
        let amount: any = Object.values(expHistory)

        // Convert dates to UNIX timestamp and compare to timestamp of monday
        for (let i = 0; i < dates.length; i++) {
            let dateUtcUnix = new Date(dates[i])

            // Remove the value from the object
            if (dateUtcUnix <= lastMon) { delete amount[i] }
        }

        // Add up the total amount of exp gained 
        let totalAmount = 0;
        for (let i in amount) {
            totalAmount += amount[i]
        }

        let quotaPercentage = (totalAmount/gexpreq * 100).toFixed(2)
        let joined = Math.trunc(memberInfo.joined/1000)

        // Get the amount of strikes the user has
        let strikes: any
        try {
            strikes = await getStrikes(uuid as string)
        } catch(e: any) {
            return interaction.followUp({ embeds: [e] })
        }

        // Embed
        let gexpEmbed: any = await embed({ title: `Gexp Report | ${ign}`, description: 'NOTE: A new day starts at 12:00am EST', thumbnail: `https://crafatar.com/avatars/${uuid}`,
            fields: [
                { name: `Gexp:`, value: `${Intl.NumberFormat().format(totalAmount)}/${Intl.NumberFormat().format(gexpreq)} (${quotaPercentage}%)`, inline: false },
                { name: `Rank:`, value: memberInfo.rank, inline: false},
                { name: `Joined:`, value: `<t:${joined}:R>`, inline: false },
                { name: `Strikes:`, value: `${strikes}`, inline: false },
                { name: `Daily Gexp Breakdown:`, value: `\`${dates[0]}\` ${Intl.NumberFormat().format(amount[0])}\n\`${dates[1]}\` ${Intl.NumberFormat().format(amount[1])}\n\`${dates[2]}\` ${Intl.NumberFormat().format(amount[2])}\n\`${dates[3]}\` ${Intl.NumberFormat().format(amount[3])}\n\`${dates[4]}\` ${Intl.NumberFormat().format(amount[4])}\n\`${dates[5]}\` ${Intl.NumberFormat().format(amount[5])}\n\`${dates[6]}\` ${Intl.NumberFormat().format(amount[6])}\n`, inline: false },
            ]
        })
        return interaction.followUp({ embeds: [gexpEmbed] })

    }
})