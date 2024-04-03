import { SQL, eq, sql, type BinaryOperator } from "drizzle-orm";
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { db } from "../config/db";

export type WhereInFilter<T> = {
  [field in keyof T]: any;
};

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

  getById = async (id: number): Promise<T[]> => {
    return (await db
      .select()
      .from(this.schema)
      .where(eq(this.schema.id, id))) as T[];
  };

  getByAttribute = async (
    att: keyof T,
    value: any,
    operator: BinaryOperator | SQL = eq
  ): Promise<T[]> => {
    //@ts-ignore
    return await db.select().from(this.schema).where(operator(att, value));
  };

  get = async (p: {
    where: WhereInFilter<T>;
    order?: { by: keyof T; order: "asc" | "desc" };
    limit?: number;
    offset?: number;
  }): Promise<T[]> => {
    const { limit, offset, order, where } = p;

    let query = db.select().from(this.schema);

    const sqlStr = Object.keys(where)
      //@ts-ignore
      .map((key) => `"${key}" = '${where[key]}' `)
      .join("AND ");

    query.where(sql`${sqlStr}`);

    if (order) {
      //@ts-ignore
      query.orderBy(order.order(order.by));
    }

    if (limit) {
      query.limit(limit);
    }

    if (offset) {
      query.offset(offset);
    }

    console.log(query.getSQL());

    return (await query) as T[];
  };

  update = async (fields: { [x: string]: any }, id: number | string) => {
    return await db
      .update(this.schema)
      .set(fields)
      .where(eq(this.schema.id, id));
  };
}
