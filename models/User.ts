import {
  integer,
  sqliteTable,
  text,
  type SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";
import BaseModel from "./baseModel";

export type GetUser = typeof User.schema.$inferSelect; // return type when queried
export type InsertUser = typeof User.schema.$inferInsert; // insert type

export default class User extends BaseModel<GetUser, InsertUser> {
  static schema: SQLiteTableWithColumns<any> = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    fullName: text("full_name"),
    phone: text("phone"),
    email: text("email"),
    type: text("type"),
  });

  constructor() {
    super(User.schema);
  }
}
