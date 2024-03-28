import type Elysia from "elysia";

export const auth = (app: Elysia) => {
  app.derive(async (context) => {
    const auth =
      context.headers["authorization"] || context.headers["Authorization"];
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    //@ts-ignore
    const { id } = context.jwt.verify(token);
    if (!id) {
      context.set.status = 401;
      return {
        message: "Unauthorized",
      };
    }

    return { uid: id };
  });
};
