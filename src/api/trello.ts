import { Fields, List, Card } from './types'

import Axios from 'axios'
import { trelloConfig } from '../config'

export async function getLists(fields: Fields = null): Promise<List[]> {
  try {
    const res = await Axios.get(
      `${trelloConfig.API}/boards/${trelloConfig.BOARD_ID}/lists${
        fields && `?fields=${fields.join(',')}`
      }`
    )

    return res.data
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return error.response
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js

      return error.request
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
      return error
    }
  }
}

export async function getCards(
  listID: string,
  fields: Fields = null
): Promise<Card[]> {
  try {
    const res = await Axios.get(
      `${trelloConfig.API}/lists/${listID}/cards${
        fields && `?fields=${fields.join(',')}`
      }`
    )

    return res.data
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return error.response
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js

      return error.request
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
      return error
    }
  }
}

export function getTrelloData(): Promise<List[]> {
  return new Promise(async (resolve, reject) => {
    const lists = await getLists(['id', 'name'])

    if (!lists) reject('Error fetching Trello data')

    let data = [...lists]

    lists.forEach(async (list, idx: number) => {
      const cards = await getCards(list.id, ['name', 'labels', 'shortUrl'])
      // Even if cards are null
      data[idx] = { ...data[idx], cards: cards.length === 0 ? null : cards }
    })

    resolve(data)
  })
}
