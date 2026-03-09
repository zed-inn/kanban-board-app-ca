import { EntityValidationError } from "../errors/entity-validation.error";

export class Card {
  private readonly _id: string;
  private title: string;
  private content: string | null;
  private position: string;
  private columnId: string;

  private static readonly validate = {
    id: (id: string): string => {
      if (typeof id !== "string")
        throw new EntityValidationError(
          "INVALID_TYPE_CARD_ID",
          "Card id must be a string.",
        );
      if ((id = id.trim()).length < 1)
        throw new EntityValidationError(
          "EMPTY_CARD_ID",
          "Card id cannot be empty.",
        );
      return id;
    },
    title: (title: string): string => {
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
      return title;
    },
    content: (content: string | null): string | null => {
      if (content !== null && typeof content !== "string")
        throw new EntityValidationError(
          "INVALID_TYPE_CARD_CONTENT",
          "Card content must be a string or null.",
        );
      return content === null ? null : content.trim();
    },
    position: (pos: string): string => {
      if (typeof pos !== "string")
        throw new EntityValidationError(
          "INVALID_TYPE_CARD_POSITION",
          "Card position must be a string.",
        );
      if ((pos = pos.trim()).length < 1)
        throw new EntityValidationError(
          "EMPTY_CARD_POSITION",
          "Card position cannot be empty.",
        );
      return pos;
    },
    columnId: (id: string): string => {
      if (typeof id !== "string")
        throw new EntityValidationError(
          "INVALID_TYPE_COLUMN_ID",
          "Column id must be a string.",
        );
      if ((id = id.trim()).length < 1)
        throw new EntityValidationError(
          "EMPTY_COLUMN_ID",
          "Column id cannot be empty.",
        );
      return id;
    },
  };

  constructor(params: {
    id: string;
    title: string;
    content: string | null;
    position: string;
    columnId: string;
  }) {
    this._id = Card.validate.id(params.id);
    this.title = Card.validate.title(params.title);
    this.content = Card.validate.content(params.content);
    this.position = Card.validate.position(params.position);
    this.columnId = Card.validate.columnId(params.columnId);
  }

  public get data() {
    return { title: this.title, content: this.content };
  }
  public get location() {
    return { position: this.position, columnId: this.columnId };
  }
  public get id() {
    return this._id;
  }

  public readonly updateBody = (params: {
    title?: string;
    content?: string | null;
  }) => {
    if (params.title !== undefined)
      this.title = Card.validate.title(params.title);
    if (params.content !== undefined)
      this.content = Card.validate.content(params.content);
  };

  public readonly moveTo = (position: string) => {
    this.position = Card.validate.position(position);
  };

  public readonly relocateToNewColumn = (columnId: string) => {
    this.columnId = Card.validate.columnId(columnId);
  };
}
