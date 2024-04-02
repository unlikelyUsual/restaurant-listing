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
  static schema: SQLiteTableWithColumns<any> = sqliteTable("reviews", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    owner: integer("owner").references(() => UserTable.schema.id),
    name: text("name"),
    phone: text("phone"),
    stars: integer("stars"),
    address: text("type"),
    city: text("city"),
    state: text("state"),
    country: text("country"),
  });

  constructor() {
    super(RestaurantTable.schema);
  }
}
