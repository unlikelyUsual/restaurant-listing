import { sql } from "drizzle-orm";
import { db } from "./config/db";
import UserTable from "./models/User";

await Promise.all([
  db.run(sql`DROP TABLE IF EXISTS users ;`),
  db.run(sql`DROP TABLE IF EXISTS restaurants ;`),
  db.run(sql`DROP TABLE IF EXISTS reviews ;`),
]);

await db.run(sql`
  CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      type TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT
  );
  `);

await db.run(sql`
  CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      stars INTEGER NOT NULL,
      address TEXT NOT NULL,
      city TEXT,
      STATE TEXT,
      COUNTRY TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
  );
  `);

await db.run(sql`
  CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      stars INTEGER NOT NULL,
      review TEXT,
      reply TEXT,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
  );
  `);

await db.insert(UserTable.schema).values([
  {
    fullName: "Person 1",
    phone: "8823478324",
    email: "randomemail@gmail.com",
    password: "random_string",
    type: "user",
  },
]);

console.log(`Seeding complete.`);
