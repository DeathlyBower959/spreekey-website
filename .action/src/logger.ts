import kleur from 'kleur'
import { Client, Snowflake, TextChannel } from 'discord.js'

type LogType = 'INFO' | 'WARN' | 'ERROR' | 'NEWLINE' | 'DATE'

interface Config {
  logChannelID: Snowflake | null
  client: Client<boolean> | null
}
let config: Config = {
  logChannelID: null,
  client: null,
}

type LogQueue = {
  type: LogType
  input: string
}
let queuedLog: LogQueue[] = []

function log(input: string, type: LogType) {
  if (type === 'INFO') console.log(kleur.blue('INFO: ') + input)
  else if (type === 'WARN') console.warn(kleur.yellow('WARN: ') + input)
  else if (type === 'ERROR') console.error(kleur.red('ERROR: ') + input)
  else if (type === 'NEWLINE') console.log('\n')
  else if (type === 'DATE') console.log(input)
}

export function initialize(
  logChannelID: Config['logChannelID'],
  client: Client<boolean>
) {
  config.logChannelID = logChannelID
  config.client = client
}

export function info(input: string) {
  log(input, 'INFO')
  queuedLog.push({
    type: 'INFO',
    input,
  })
}
export function warn(input: string) {
  log(input, 'WARN')
  queuedLog.push({
    type: 'WARN',
    input,
  })
}
export function error(input: string) {
  log(input, 'ERROR')
  queuedLog.push({
    type: 'ERROR',
    input,
  })
}

export function newLine() {
  // No \n needed because it is used in .map function
  log('', 'NEWLINE')
  queuedLog.push({
    type: 'NEWLINE',
    input: '',
  })
}

export function time() {
  const date = `<t:${Math.floor(Date.now() / 1000)}:T>`

  log(date, 'DATE')
  queuedLog.push({
    type: 'DATE',
    input: date,
  })
}

export async function writeLog() {
  if (!config.logChannelID || !config.client) return

  const logChannel = config.client.channels.cache.get(
    config.logChannelID
  ) as TextChannel

  await logChannel.send(
    queuedLog
      .map(x =>
        x.type === 'NEWLINE'
          ? x.input
          : x.type === 'DATE'
          ? `${getEmojiForType(x.type)} ${x.input}`
          : `${getEmojiForType(x.type)} \`${x.input}\``
      )
      .join('\n')
  )

  queuedLog = []
}

function getEmojiForType(type: LogType) {
  if (type === 'INFO') return `<:info_icon:1065819769514766337>`
  else if (type === 'WARN') return `<:warn_icon:1065819766541004920>`
  else if (type === 'ERROR') return `<:error_icon:1065819768319385630>`
  else if (type === 'DATE') return `<:time_icon:1065823425244975234>`
}
