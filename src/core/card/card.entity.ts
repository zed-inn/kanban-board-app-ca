import type { CardAttributes } from "./card.interface";

export class Card {
  public id;
  public title;
  public content;
  public position;
  protected column;

  constructor(data: CardAttributes) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.position = data.position;
    this.column = data.column;
  }
}
