import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, PermissionResolvable, RoleResolvable } from 'discord.js'
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
    args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
    permissions?: PermissionResolvable[]
    roles?: RoleResolvable[]
    run: RunFunction
} & ChatInputApplicationCommandData