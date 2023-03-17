import { z } from 'zod';

import { trelloConfig } from '../config';
import { get } from './wrapper';

// Zod
export const labelSchema = z.object({
  id: z.string(),
  idBoard: z.string(),
  name: z.string(),
  color: z.string(),
});
export const cardSchema = z.object({
  id: z.string(),
  name: z.string(),
  labels: z.array(labelSchema).optional(),
  shortUrl: z.string(),
  desc: z.string(),
});
export const listSchema = z.object({
  id: z.string(),
  name: z.string(),
  cards: z.array(cardSchema).optional(),
});
export const boardSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortUrl: z.string().url(),
  lists: z.array(listSchema).optional(),
});

export type Fields = string[];
export type Board = z.infer<typeof boardSchema>;
export type List = z.infer<typeof listSchema>;

export type Card = z.infer<typeof cardSchema>;
export type Label = z.infer<typeof labelSchema>;

// API
export async function getBoards(fields: Fields = []) {
  return get<Board[]>(
    `/organizations/${trelloConfig.WORKSPACE_ID}/boards`,
    fields,
    z.array(boardSchema)
  );
}

export async function getLists(boardId: string, fields: Fields = []) {
  return get<List[]>(`/boards/${boardId}/lists`, fields, z.array(listSchema));
}

export async function getCards(listID: string, fields: Fields = []) {
  return get<Card[]>(`/lists/${listID}/cards`, fields, z.array(cardSchema));
}

export async function getTrelloData(): Promise<Board[]> {
  const boards = await getBoards(['name', 'shortUrl']);

  if (!boards) throw new Error('Failed to retrieve boards');

  let data: Board[] = [];

  for (let bIdx = 0; bIdx < boards.length; bIdx++) {
    const board = boards[bIdx];

    const lists = await getLists(board.id, ['name']);

    let listData: List[] = [];

    for (let lIdx = 0; lIdx < lists.length; lIdx++) {
      const list = lists[lIdx];

      const cards = await getCards(list.id, [
        'name',
        'labels',
        'shortUrl',
        'desc',
      ]);

      listData.push({
        ...list,
        cards: cards || [],
      });
    }

    data.push({
      ...board,
      lists: listData,
    });
  }

  return data;
}
