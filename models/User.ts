import {
  integer,
  sqliteTable,
  text,
  type SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";
import BaseModel from "./baseModel";

export type TGetUser = typeof UserTable.schema.$inferSelect; // return type when queried
export type TInsertUser = typeof UserTable.schema.$inferInsert; // insert type

export default class UserTable extends BaseModel<TGetUser, TInsertUser> {
  static schema: SQLiteTableWithColumns<any> = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    type: text("type").notNull(),
    phone: text("phone"),
  });

  constructor() {
    super(UserTable.schema);
  }
}
