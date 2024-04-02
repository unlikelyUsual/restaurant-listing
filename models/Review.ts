import {
  integer,
  sqliteTable,
  text,
  type SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";
import RestaurantTable from "./Restaurant";
import UserTable from "./User";
import BaseModel from "./baseModel";

export type TGetReview = typeof ReviewTable.schema.$inferSelect; // return type when queried
export type TInsertReview = typeof ReviewTable.schema.$inferInsert; // insert type

export default class ReviewTable extends BaseModel<TGetReview, TInsertReview> {
  static schema: SQLiteTableWithColumns<any> = sqliteTable("reviews", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    restaurant: integer("restaurant")
      .references(() => RestaurantTable.schema.id)
      .notNull(),
    review: text("review"),
    user: integer("user")
      .references(() => UserTable.schema.id)
      .notNull(),
    reply: text("reply"),
    stars: integer("stars").notNull(),
  });

  constructor() {
    super(UserTable.schema);
  }
}
