import { Command } from '../../structures/Command'
import embed from '../../utils/embed'
import reqs from '../../configuration/reqs/prorank.json'
import { getPlayer } from '../../utils/apiReq'

export default new Command({
    name: "prorank",
    description: "Check if you are eligible for Pro Rank",
    options: [
        {
            name: "ign",
            description: "Minecraft IGN",
            type: 3,
            required: true
        }
    ],
    run: async ({ interaction, args, client }) => {
        let ign: string = args.data[0].value as string

        let metList: string[] = []
        try {
            var player: any = await getPlayer(ign)
        } catch(e: any) {
            return interaction.followUp({ embeds: [e] })
        }
        for (let i in reqs) {
            let values = i.split("_")
            if (values[0] == "bw") {
                if (player.data.stats.BedWars[values[1]] >= reqs.bw_level) metList.push("Bedwars")
            }
            if (values[0] == "sw") {
                if (player.data.stats.SkyWars[values[1]] >= reqs.sw_level) metList.push("Skywars")
            }
            if (values[0] == "uhc") {
                if (player.data.stats.UHC[values[1]] >= reqs.uhc_level) metList.push("UHC")
            }
            if (values[0] == "duels") {
                if (player.data.stats.Duels.general[values[1]] >= reqs.duels_wins) metList.push("Duels")
            }
            if (values[0] == "pit") {
                if (player.data.stats.Pit[values[1]] >= reqs.pit_prestige) metList.push("Pit")
            }
        }
        let reqsEmbed = await embed({ title: `Pro Rank Requirements Check`, thumbnail: `https://crafatar.com/avatars/${player.data.uuid}` })
        if (metList.length > 0) {
            let metString = metList.join(', ')
            reqsEmbed.addField(`Requirements Met`, `${metString}`)
            reqsEmbed.addField('Eligibility', 'You are eligible for Pro Rank! Please contact a guild staff member to get your rank.')
        } else {
            reqsEmbed.addField('Requirements Met', `NONE`);
            reqsEmbed.addField('Eligibility', 'You are not eligible for Pro Rank.')   
        }
        return interaction.followUp({ embeds: [reqsEmbed] })
    }
})