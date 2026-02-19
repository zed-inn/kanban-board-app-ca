import type { Column } from "../column/column.entity";

export interface CardAttributes {
  id: string;
  title: string;
  content: string | null;
  position: number;
  column: Column;
}
