export type Fields = string[] | null

export interface List {
  id: string
  name: string
  closed?: boolean
  idBoard?: string
  pos?: number
  cards?: Card[] | null
}

export interface Card {
  id: string
  name: string
  labels: Label[]
  shortUrl: string
}

export interface Label {
  id: string
  idBoard: string
  name: string
  color: string
}
