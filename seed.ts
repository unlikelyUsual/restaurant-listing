import { sql } from "drizzle-orm";
import { db } from "./config/db";
import UserTable from "./models/User";

await db.run(sql`DROP TABLE users`);

const query = sql`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    password TEXT,
    type TEXT
);
`;

await db.run(query);
await db.insert(UserTable.schema).values([
  {
    title: "The Matrix",
    fullName: "Person 1",
    phone: "8823478324",
    email: "randomemail@gmail.com",
    password: "random_string",
    type: "admin",
  },
  {
    title: "The Matrix",
    fullName: "Person 2",
    phone: "8823478324",
    email: "randomemail@gmail.com",
    password: "random_string",
    type: "user",
  },
]);

console.log(`Seeding complete.`);
