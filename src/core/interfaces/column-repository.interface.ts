import type { Column } from "../entities/column";

export interface ColumnRepository {
  save(column: Column): Promise<void>;
  getTopColumn(): Promise<Column | null>;
}
