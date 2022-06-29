import { Command } from '../../structures/Command'

import embed from '../../utils/embed'
import { codeBlock } from '@discordjs/builders'
import { getStrikes } from '../../utils/database'
import { convert } from '../../utils/ignConverter'

export default new Command({
    name: "strikes",
    description: "View your or another player's strikes.",
    options: [
        {
            name: "ign",
            description: "Minecraft IGN",
            type: 3,
            required: true,
        }
    ],
    run: async ({ interaction, args, client }) => {
        let ign: string = args.data[0].value as string
        try {
            var uuid = await convert(ign)
            var strikes = await getStrikes(uuid as string)
        } catch(e: any) {
            return interaction.followUp({ embeds: [e] })
        }
        let strikesEm = await embed({ title: `STRIKES`, description: codeBlock(`The player "${ign.toUpperCase()}" has ${strikes} strike(s)!`) })
        return interaction.followUp({ embeds: [strikesEm] })
    }
})