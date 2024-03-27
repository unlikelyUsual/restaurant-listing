import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { restaurant } from "./Restaurant";
import User from "./User";

export const review = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  restaurant: integer("restaurant").references(() => restaurant.id),
  review: text("review"),
  user: integer("user").references(() => User.schema.id),
  type: text("type"),
});

export type GetReview = typeof review.$inferSelect; // return type when queried
export type InsertReview = typeof review.$inferInsert; // insert type
