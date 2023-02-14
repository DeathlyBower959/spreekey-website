import { Fields, List, Card, Board } from './types';

import { trelloConfig } from '../config';
import { request } from './wrapper';

export async function getBoards(fields: Fields = []) {
  return request<Board[]>(
    `/organizations/${trelloConfig.WORKSPACE_ID}/boards`,
    fields
  );
}

export async function getLists(boardId: string, fields: Fields = []) {
  return request<List[]>(`/boards/${boardId}/lists`, fields);
}

export async function getCards(listID: string, fields: Fields = []) {
  return request<Card[]>(`/lists/${listID}/cards`, fields);
}

export async function getTrelloData(): Promise<Board[]> {
  return new Promise(async (resolve, reject) => {
    const boards = await getBoards(['name', 'shortUrl']);

    if (!boards) return reject('Error fetching Trello data');

    let data = [...boards];

    boards.forEach(async (board, bIdx) => {
      let lists = await getLists(board.id, ['name']);

      lists.forEach(async (list, lIdx) => {
        const cards = await getCards(list.id, ['name', 'labels', 'shortUrl']);

        lists[lIdx] = {
          ...lists[lIdx],
          cards: cards.length === 0 ? [] : cards,
        };
      });

      data[bIdx] = {
        ...data[bIdx],
        lists: lists.length === 0 ? [] : lists,
      };
    });

    console.log(data);
    resolve(data);
  });
}

export function write() {
  getTrelloData().then(data => {
    console.log(data);
  });
}
