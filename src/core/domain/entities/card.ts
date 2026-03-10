import { EntityValidationError } from "@errors/entity-validation.error";
import { CardId } from "@domain/value-object/card-id.vo";
import { ColumnId } from "@domain/value-object/column-id.vo";
import { Position } from "@domain/value-object/position.vo";
import { VO } from "@domain/value-object/base.vo";

export class CardTitle extends VO<string> {
  protected readonly __type!: "CardTitle";
  protected readonly value: string;

  constructor(title: string) {
    super();
    if (typeof title !== "string")
      throw new EntityValidationError(
        "INVALID_TYPE_CARD_TITLE",
        "Card title must be a string.",
      );
    if ((title = title.trim()).length < 1)
      throw new EntityValidationError(
        "EMPTY_CARD_TITLE",
        "Card title cannot be empty.",
      );
    this.value = title;
  }
}

export class CardContent extends VO<string | null> {
  protected readonly __type!: "CardContent";
  protected readonly value: string | null;

  constructor(content: string | null) {
    super();
    if (content !== null && typeof content !== "string")
      throw new EntityValidationError(
        "INVALID_TYPE_CARD_CONTENT",
        "Card content must be a string or null.",
      );
    this.value = content === null ? null : content.trim();
  }
}

export class CardPosition extends Position<"CardPosition"> {
  constructor(pos: string) {
    if (typeof pos !== "string")
      throw new EntityValidationError(
        "INVALID_TYPE_CARD_POSITION",
        "Card position must be a string.",
      );
    if (pos.trim().length < 1)
      throw new EntityValidationError(
        "EMPTY_CARD_POSITION",
        "Card position cannot be empty.",
      );
    super(pos);
  }
}

export class Card {
  private readonly _id: CardId;
  private _title: CardTitle;
  private _content: CardContent;
  private _position: CardPosition;
  private _columnId: ColumnId;

  constructor(params: {
    id: string;
    title: string;
    content: string | null;
    position: string;
    columnId: string;
  }) {
    this._id = new CardId(params.id);
    this._title = new CardTitle(params.title);
    this._content = new CardContent(params.content);
    this._position = new CardPosition(params.position);
    this._columnId = new ColumnId(params.columnId);
  }

  public get id() {
    return this._id;
  }
  public get title() {
    return this._title;
  }
  public get content() {
    return this._content;
  }
  public get position() {
    return this._position;
  }
  public get columnId() {
    return this._columnId;
  }

  updateBody(params: { title?: CardTitle; content?: CardContent }) {
    if (params.title !== undefined) this._title = params.title;
    if (params.content !== undefined) this._content = params.content;
  }

  moveTo(newPosition: CardPosition) {
    this._position = newPosition;
  }

  relocateToNewColumn(newColumnId: ColumnId) {
    if (this._columnId.isDifferent(newColumnId)) this._columnId = newColumnId;
  }
}
