import type Elysia from "elysia";
import { t } from "elysia";
import Logger from "../config/logger";
import { isAuthenticated } from "../middleware/auth";
import UserTable, { type TInsertUser } from "../models/User";
import { E_ROLES } from "../utils/enums";

const logger = new Logger("User controller");

export const userController = (app: Elysia) =>
  app
    .group("auth", (app) =>
      app
        .post(
          "/signup",
          async (context) => {
            logger.log(`Sign up ... `);
            const { name, password, email, type, address, phone } =
              context.body;

            const passHash = await Bun.password.hash(password);

            const user: TInsertUser = {
              fullName: name,
              email,
              password: passHash,
              type,
              address,
              phone,
            };

            const res = await new UserTable().insert(user);

            logger.log("Response from add action : ", res.rowsAffected);

            return { message: "Added successfully" };
          },
          {
            body: t.Object({
              name: t.String(),
              password: t.String(),
              email: t.String({ format: "email" }),
              type: t.Enum(E_ROLES),
              address: t.String(),
              phone: t.String(),
            }),
          }
        )
        .post(
          "/login",
          async (context) => {
            logger.log(`Login  ... `);
            const { email, password } = context.body;
            //@ts-ignore
            const { set, jwt } = context;

            const userModel = new UserTable();

            const users = await userModel.getByAttribute(
              UserTable.schema.email,
              email
            );

            logger.log("Fetched users : ", users);

            if (users.length < 1) {
              set.status = 401;
              return { message: "Invalid Email" };
            }

            const user = users[0];

            const isPasswordVerified = await Bun.password.verify(
              password,
              user.password
            );

            if (!isPasswordVerified) {
              set.status = 401;
              return { message: "Invalid Password" };
            }

            //@ts-ignore
            const token = await jwt.sign({
              id: user.id,
              email: user.email,
              type: user.type,
            });

            return {
              token,
              message: "Logged in",
            };
          },
          {
            body: t.Object({
              email: t.String({ format: "email" }),
              password: t.String(),
            }),
          }
        )
    )
    .group("admin", (app) =>
      app
        .use(isAuthenticated([E_ROLES.ADMIN]))
        .get("/users", async (context) => {
          logger.log(`Get Users List ... `);
          const res = await new UserTable().getAll();
          logger.log(`Headers : `, context.headers);
          if (res.length == 0) return { users: [], message: "No users found" };
          return { users: res, message: "Users fetched" };
        })
    )
    .group("/all", (app) =>
      app
        .use(isAuthenticated([E_ROLES.ADMIN, E_ROLES.OWNER, E_ROLES.USER]))
        .get("/user", async (context) => {
          logger.log(`Get User ... `);
          if (!context.headers.uid) {
            context.set.status = 400;
            return { message: "User token is invalid" };
          }

          const userRes = await new UserTable().getById(
            parseInt(context.headers.uid)
          );

          if (userRes.length !== 1) {
            context.set.status = 400;
            return { message: "Invalid user id" };
          }

          const user = userRes[0];

          return { user };
        })
    );
