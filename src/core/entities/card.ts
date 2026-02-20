export class Card {
  public id: string;
  public title: string;
  public content: string;
  public position: number;
  protected columnId: string;

  constructor(params: {
    id: string;
    title: string;
    content: string;
    position: number;
    columnId: string;
  }) {
    this.id = params.id;
    this.title = params.title;
    this.content = params.content;
    this.position = params.position;
    this.columnId = params.columnId;
  }
}
