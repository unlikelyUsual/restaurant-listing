import { sql } from "drizzle-orm";
import { db } from "./config/db";
import User from "./models/User";

const query = sql`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    type TEXT
);
`;

await db.run(query);
await db.insert(User.schema).values([
  {
    title: "The Matrix",
    fullName: "Person 1",
    phone: "8823478324",
    email: "randomemail@gmail.com",
    type: "admin",
  },
  {
    title: "The Matrix",
    fullName: "Person 2",
    phone: "8823478324",
    email: "randomemail@gmail.com",
    type: "user",
  },
  {
    title: "The Matrix",
    fullName: "Person 3",
    phone: "8823478324",
    email: "randomemail@gmail.com",
    type: "user",
  },
]);

console.log(`Seeding complete.`);
