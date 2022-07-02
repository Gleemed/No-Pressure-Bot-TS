import { Command } from '../../structures/Command'
import embed from '../../utils/embed'

import Reqs from '../../configuration/reqs/reqs.json'
import generalReqs from '../../configuration/reqs/general.json'

const reqs: any = Reqs

import { getPlayer } from '../../utils/apiReq'

export default new Command({
    name: "meetreqs",
    description: "Check if you meet the requirements to join the No Pressure guild",
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
        var bwReq = 0
        var swReq = 0
        var duelsReq = 0
        var metList: string[] = []
        try {
            var player: any = await getPlayer(ign)
        } catch(e: any) {
            interaction.followUp({ embeds: [e] })
        }
        if (player.data.level >= generalReqs.networkLevel) metList.push("Network Level")
        for (let i in reqs.bedwars) {
            if (player.data.stats.BedWars[i] >= reqs.bedwars[i]) bwReq++
            if (bwReq >= 3) metList.push("Bedwars (A)")
        }
        for (let i in reqs.skywars) {
            if (player.data.stats.SkyWars[i] >= reqs.skywars[i]) swReq++
            if (swReq >= 3) metList.push("Skywars (B)")
        }
        for (let i in reqs.duels) {
            if (player.data.stats.Duels.general[i] >= reqs.duels[i]) duelsReq++
            if (duelsReq >= 2) metList.push("Duels (C)")
        }
        let reqsEmbed = await embed({ title: `Guild Requirements Check | ${player.data.username}`, thumbnail: `https://crafatar.com/avatars/${player.data.uuid}` })
        if ((player.data.level >= generalReqs.networkLevel) && (metList.length > 1)) {
            let metString = metList.join(', ')
            reqsEmbed.addField(`Requirements Met`, `${metString}`)
            reqsEmbed.addField('Eligibility', 'You are are eligible to join No Pressure! Apply using the \`/apply\` command.')
        } else {
            let metString = metList.join(', ')
            reqsEmbed.addField('Requirements Met', `${metString}`);
            reqsEmbed.addField('Eligibility', 'You are not eligible to join No Pressure.')  
        }
        return interaction.followUp({ embeds: [reqsEmbed] })
    }
})