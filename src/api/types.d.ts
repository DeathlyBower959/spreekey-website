export type Fields = string[];

export interface Board {
  id: string;
  name: string;
  shortUrl: string;
  lists: List[];
}

export interface List {
  id: string;
  name: string;
  cards: Card[];
}

export interface Card {
  id: string;
  name: string;
  labels: Label[];
  shortUrl: string;
}

export interface Label {
  id: string;
  idBoard: string;
  name: string;
  color: string;
}
