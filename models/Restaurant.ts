import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const restaurant = sqliteTable("restaurants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  phone: text("phone"),
  stars: integer("stars"),
  address: text("type"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
});

export type GetRestaurant = typeof restaurant.$inferSelect; // return type when queried
export type InsertRestaurant = typeof restaurant.$inferInsert; // insert type
