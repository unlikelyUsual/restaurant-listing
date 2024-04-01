import { eq } from "drizzle-orm";
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { db } from "../config/db";

export default class BaseModel<T, K> {
  private readonly schema: SQLiteTableWithColumns<any>;

  constructor(schema: SQLiteTableWithColumns<any>) {
    this.schema = schema;
  }

  insert = async (data: K) => {
    return await db
      .insert(this.schema)
      .values(data as any)
      .run();
  };

  getAll = async (): Promise<T[]> => {
    return (await db.select().from(this.schema).all()) as T[];
  };

  getById = async (id: number) => {
    return (await db
      .select()
      .from(this.schema)
      .where(eq(this.schema.id, id))) as T;
  };
}
