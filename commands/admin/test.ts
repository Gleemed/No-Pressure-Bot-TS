import { Command } from '../../structures/Command'
import embed from '../../utils/embed'
import { codeBlock } from '@discordjs/builders'

export default new Command({
    name: "test",
    description: "this is a test command",
    permissions: ['ADMINISTRATOR'],
    run: async ({ interaction, args, client }) => {
        const testEm = await embed({ title: 'test embed', description: codeBlock('this is a embed description') })
        return interaction.followUp({ embeds: [testEm] })
    }
})