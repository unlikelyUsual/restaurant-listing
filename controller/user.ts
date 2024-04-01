import type Elysia from "elysia";
import { t } from "elysia";
import Logger from "../config/logger";
import { isAuthenticated } from "../middleware/auth";
import User from "../models/User";
import { E_ROLES } from "../utils/enums";

const logger = new Logger("User controller");

export const userController = (app: Elysia) =>
  app
    .use(isAuthenticated(E_ROLES.ADMIN))
    .get("/users", async (context) => {
      const res = await new User().getAll();
      if (res.length == 0) return { users: [], message: "No users found" };
      return { users: res, message: "Users fetched" };
    })
    .get(
      "/user",
      async (handler) => {
        try {
          const { id } = handler.query;

          const userRes = await new User().getById(parseInt(id));

          if (userRes.length !== 1) {
            handler.set.status = 400;
            return { message: "Invalid user id" };
          }

          const user = userRes[0];

          //@ts-ignore
          const token = await handler.jwt.sign({
            id,
            email: user.email,
            type: user.type,
          });

          return { access_token: token, user };
        } catch (err) {
          logger.error(err);
          return { error: err, message: "Something went wrong" };
        }
      },
      {
        query: t.Object({
          id: t.String(),
        }),
      }
    );
