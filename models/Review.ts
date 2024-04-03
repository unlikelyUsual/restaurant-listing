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
    restaurant: integer("restaurant_id")
      .references(() => RestaurantTable.schema.id)
      .notNull(),
    user: integer("user_id")
      .references(() => UserTable.schema.id)
      .notNull(),
    stars: integer("stars").notNull(),
    review: text("review"),
    reply: text("reply"),
  });

  constructor() {
    super(ReviewTable.schema);
  }
}
