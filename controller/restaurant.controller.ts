import type Elysia from "elysia";
import { t } from "elysia";
import Logger from "../config/logger";
import { isAuthenticated } from "../middleware/auth";
import RestaurantTable from "../models/Restaurant";
import { constants } from "../utils/constants";
import { E_ROLES } from "../utils/enums";

const logger = new Logger("Restaurant controller");

export const restaurantController = (app: Elysia) =>
  app
    .use(isAuthenticated([E_ROLES.OWNER]))
    .post(
      "/restaurant",
      async (context) => {
        const { set, body, headers } = context;
        try {
          const { name, phone, stars, address, city, state, country } = body;

          const res = await new RestaurantTable().insert({
            name,
            owner: headers.uid,
            phone,
            stars,
            address,
            city,
            state,
            country,
          });

          logger.log(`Restaurant response`, res.rowsAffected);

          return {
            message: "Created!",
          };
        } catch (error) {
          logger.error("Error creating restaurant", error);
          set.status = 500;
          return { message: "Something went wrong!" };
        }
      },
      {
        body: t.Object({
          name: t.String(),
          phone: t.String(),
          stars: t.Number({
            maximum: constants.MAX_HOTEL_STARS,
          }),
          address: t.String(),
          city: t.String(),
          state: t.String(),
          country: t.String(),
        }),
      }
    )
    .get(
      "restaurants",
      async (context) => {
        const { uid } = context.headers;
        const { id } = context.query;

        const restaurantTable = new RestaurantTable();

        const restaurants = id
          ? restaurantTable.getById(parseInt(id))
          : restaurantTable.getByAttribute(RestaurantTable.schema.owner, uid);

        return { restaurants, message: "fetched!" };
      },
      {
        query: t.Object({
          id: t.Optional(t.String()),
        }),
      }
    );
