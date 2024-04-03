import {
  integer,
  sqliteTable,
  text,
  type SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";
import UserTable from "./User";
import BaseModel from "./baseModel";

export type TGetRestaurant = typeof RestaurantTable.schema.$inferSelect; // return type when queried
export type TInsertRestaurant = typeof RestaurantTable.schema.$inferInsert; // insert type

export default class RestaurantTable extends BaseModel<
  TGetRestaurant,
  TInsertRestaurant
> {
  static schema: SQLiteTableWithColumns<any> = sqliteTable("restaurants", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    owner: integer("user_id")
      .references(() => UserTable.schema.id)
      .notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    stars: integer("stars").notNull(),
    address: text("address").notNull(),
    city: text("city"),
    state: text("state"),
    country: text("country"),
  });

  constructor() {
    super(RestaurantTable.schema);
  }
}
