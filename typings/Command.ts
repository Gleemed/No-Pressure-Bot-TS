import { ChatInputApplicationCommandData, CommandInteraction, GuildMember, PermissionResolvable, CommandInteractionOptionResolver } from 'discord.js'
import { ExtendedClient } from '../structures/Client'

/**
 * {
 *   name: "commandname",
 *   description: "any description",
 *   run: async({ interaction }) => {
 *     
 *   }
 * }
 */
export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember,
}

interface RunOptions {
    client: ExtendedClient,
    interaction: ExtendedInteraction,
    args: string[]
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
    permissions?: PermissionResolvable[]
    run: RunFunction
} & ChatInputApplicationCommandData