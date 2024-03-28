import type Elysia from "elysia";
import { t } from "elysia";
import auth from "../config/auth";
import Logger from "../config/logger";
import User from "../models/User";

const logger = new Logger("User controller");

export const userController = async (app: Elysia) =>
  app
    .use(auth)
    .get("/users", async () => {
      //TODO : add authentication for admin user
      const res = await new User().getAll();
      if (res.length == 0) return { users: [], message: "No users found" };
      return { users: res, message: "Users fetched" };
    })
    .get(
      "/user",
      async (handler) => {
        try {
          const { id } = handler.query;

          const user = await new User().getById(id);

          //@ts-ignore
          const token = await handler.jwt.sign({ id, email: user.email });

          return { access_token: token, user };
        } catch (err) {
          logger.error(err);
          return { error: err, message: "Something went wrong" };
        }
      },
      {
        query: t.Object({
          id: t.Number(),
        }),
      }
    );
