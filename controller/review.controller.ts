import { inArray } from "drizzle-orm";
import type Elysia from "elysia";
import { t } from "elysia";
import Logger from "../config/logger";
import { isAuthenticated } from "../middleware/auth";
import RestaurantTable from "../models/Restaurant";
import ReviewTable, { type TInsertReview } from "../models/Review";
import { constants } from "../utils/constants";
import { E_ROLES } from "../utils/enums";

const logger = new Logger("Review controller");

export const reviewController = (app: Elysia) =>
  app
    .group("review", (app) =>
      app
        .use(isAuthenticated([E_ROLES.USER]))
        .post(
          "user",
          async (context) => {
            logger.log("Adding Review ... ");
            const { body, set, headers } = context;
            try {
              const { restaurantId, review, stars } = body;

              const reviewRow: TInsertReview = {
                restaurant: restaurantId,
                stars,
                user: headers.uid,
                ...(review && { review }),
              };

              const res = await new ReviewTable().insert(reviewRow);

              logger.log("Response from insert : ", res);

              return { message: "Review posted!" };
            } catch (err) {
              logger.error(err);
              set.status = 500;
              return { message: "Something went wrong!" };
            }
          },
          {
            body: t.Object({
              restaurantId: t.Number(),
              review: t.Optional(t.String()),
              stars: t.Number({
                maximum: constants.MAX_REVIEW_STARS,
              }),
            }),
          }
        )
        .get(
          "user",
          async (context) => {
            logger.log(`Get user reviews  ... `);
            const { headers, set, query } = context;

            const { reviewId, restaurantId } = query;

            const uid = headers.uid;

            const reviewTable = new ReviewTable();

            const reviews = reviewId
              ? await reviewTable.getById(parseInt(reviewId))
              : await reviewTable.get({
                  where: {
                    [ReviewTable.schema.restaurant.name]:
                      parseInt(restaurantId),
                    [ReviewTable.schema.user.name]: uid,
                  },
                });

            return { reviews, message: "Fetched!" };
          },
          {
            query: t.Object({
              reviewId: t.Optional(t.String()),
              restaurantId: t.String(),
            }),
          }
        )
    )
    .group("owner", (app) =>
      app
        .use(isAuthenticated([E_ROLES.OWNER]))
        .post(
          "review/reply",
          async (context) => {
            logger.log(`Reply reviews ... `);
            const { body, set, headers } = context;
            try {
              const { reply, reviewId } = body;

              const owner = headers.uid;

              const reviewTable = new ReviewTable();

              const reviews = await reviewTable.getById(reviewId);

              if (reviews.length < 1) {
                set.status = 400;
                return { message: `Review does'nt exist` };
              }

              const { restaurant } = reviews[0];

              const restaurants = await new RestaurantTable().getById(
                restaurant
              );

              if (restaurants.length < 1) {
                set.status = 400;
                return { message: `Restaurant does'nt exist` };
              }

              if (restaurants[0].owner !== owner) {
                set.status = 401;
                return { message: "Unauthorized" };
              }

              const update = await reviewTable.update(
                {
                  reply,
                },
                reviewId
              );

              logger.log(`Updated res rows affected : `, update.rowsAffected);

              return { message: "Updated!" };
            } catch (err) {
              logger.error(err);
              set.status = 500;
              return { message: "Something went wrong!" };
            }
          },
          {
            body: t.Object({
              reviewId: t.Number(),
              reply: t.String(),
            }),
          }
        )
        .get("reviews", async (context) => {
          logger.log(`Get Reviews List ... `);
          const { set, headers } = context;
          try {
            const res = await new RestaurantTable().getByAttribute(
              RestaurantTable.schema.owner,
              headers.uid
            );

            if (res.length < 1) {
              return { message: "No restaurant found" };
            }

            const restaurantsIds = res.map((item) => item.id);

            logger.log("Restaurants fetched : ", restaurantsIds);

            const reviews = await new ReviewTable().getByAttribute(
              ReviewTable.schema.restaurant,
              restaurantsIds,
              //@ts-ignore
              inArray
            );

            return { reviews };
          } catch (err) {
            logger.error(err);
            set.status = 500;
            return { message: "Something went wrong" };
          }
        })
    );
