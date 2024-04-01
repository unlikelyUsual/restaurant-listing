import Elysia from "elysia";
import Logger from "../config/logger";
import type { E_ROLES } from "../utils/enums";

const logger = new Logger("Auth Middleware");

export const isAuthenticated = (role: E_ROLES) => (app: Elysia) =>
  app.onBeforeHandle({ as: "local" }, async (context) => {
    //@ts-ignore
    const { headers, set, jwt } = context;
    const auth = headers["authorization"] || headers["Authorization"];
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

    logger.log(`Token > `, token);

    if (!token) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }

    //@ts-ignore
    const { id, type } = await jwt.verify(token);

    if (!id) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }

    if (type !== role) {
      set.status = 401;
      return {
        message: "Unauthorized",
      };
    }
  });
