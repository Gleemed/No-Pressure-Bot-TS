import { Intents, ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from "discord.js";
import { CommandType } from "../typings/Command";
import glob from "glob-promise";
import { RegisterCommandsOptions } from "../typings/client";
import { Event } from "./Event";

import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
    }

    start() {
        this.registerModules();
        this.login(process.env.TOKEN);
    }
    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            console.log(`Registering guild commands for ${guildId}`)
            const rest = new REST({ version: '9' }).setToken(process.env.TOKEN!)
            rest.put(Routes.applicationGuildCommands(process.env.CLIENTID!, process.env.GUILDID!), { body: commands }).then(() => console.log('Finished registering application commands!'))
        } else {
            this.application?.commands.set(commands);
            console.log("Registering global commands");
        }
    }

    async registerModules() {
        // Commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandPaths = await glob(`**/commands/**/*.ts`)
        commandPaths.forEach(async (cmdPath) => {
            const command: CommandType = await this.importFile(`../${cmdPath}`)
            if (!command.name) return

            // Add to collection
            this.commands.set(command.name, command)
            slashCommands.push(command)
        })

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.GUILDID
            });
        });

        // Event
        const eventFiles = await glob(`**/events/*.ts`)
        eventFiles.forEach(async (eventPath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(`../${eventPath}`)
            this.on(event.event, event.run);
        })
    }
}