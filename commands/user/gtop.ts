import { Command } from '../../structures/Command'
import { gTopAmount } from '../../configuration/discord.json'
import { botName, name } from '../../configuration/guild.json'
import embed from '../../utils/embed'
import { errorColor } from '../../configuration/embeds.json'
import { getGuild } from '../../utils/apiReq'
import { convertToIgn } from '../../utils/ignConverter'
import { codeBlock } from '@discordjs/builders'

export default new Command({
    name: "gtop",
    description: `View the top ${gTopAmount} guild experience gathers for the current week`,
    run: async ({ interaction, args, client }) => {
        try {
            var guild: any = await getGuild(botName)
        } catch(e: any) {
            return interaction.followUp({ embeds: [e] })
        }
        let target = 1 // Monday
        let ndate = new Date();
        let estDate = ndate.toLocaleDateString("en-US", {timeZone: "America/New_York"});
        let tdate = new Date(estDate);
        let lastMonStamp = tdate.setDate(tdate.getDate() - ( tdate.getDay() == target ? 7 : (tdate.getDay() + (7 - target)) % 7 ));
        let lastMon = new Date(lastMonStamp);

        var members: any = {}

        for (let i = 0; i < guild.data.members.length; i++) {
            var dates = Object.keys(guild.data.members[i].exp_history)
            var amount: any = Object.values(guild.data.members[i].exp_history)
            var totalExp = 0;
            let user = guild.data.members[i].uuid

            for (let di = 0; di < dates.length; di++) {
                let dateUtcUnix = new Date(dates[di])
                if (dateUtcUnix <= lastMon) {
                    delete amount[di]
                }
            }

            for (let vi in amount) {
                totalExp += amount[vi]
            }

            members[user] = [totalExp]
        }

        const sortedMembers: any = Object.entries(members)
        .sort(([,a]: any,[,b]: any) => b-a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})

        var sortedKeys = Object.keys(sortedMembers)
        var sortedValues: any = Object.values(sortedMembers)
        var sortedIgns = []

        try {
            for (let i = 0; i < gTopAmount; i++) {
                let uuidOn = sortedKeys[i]
                let getIgn = await convertToIgn(uuidOn)
                sortedIgns.push(getIgn)
            }
        } catch(e) {
            console.log(e)
            let err = await embed({ title: 'ERROR', color: errorColor, description: codeBlock(`An error occured while generating the Guild Top. Please try again.`) })
            return interaction.followUp({ embeds: [err] })
        }

        let gTopEm = await embed({ title: `Guild Leaderboard | ${name}`, 
            description: `Top ${gTopAmount} guild experience gatherers from the past week.`,
            thumbnail: `https://crafatar.com/renders/body/${sortedKeys[0]}`
        })

        for (let i = 0; i < sortedIgns.length; i++) {
            var pos = i + 1
            gTopEm.addField(`#${pos} ${sortedIgns[i]}`, `\`${Intl.NumberFormat().format(sortedValues[i])}\``, false)
        }
        return interaction.followUp({ embeds: [gTopEm] })
    }
})