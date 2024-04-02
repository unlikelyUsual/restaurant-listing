import type Elysia from "elysia";
import { t } from "elysia";
import Logger from "../config/logger";
import { isAuthenticated } from "../middleware/auth";
import RestaurantTable from "../models/Restaurant";
import ReviewTable from "../models/Review";
import { constants } from "../utils/constants";
import { E_ROLES } from "../utils/enums";

const logger = new Logger("Review controller");

export const reviewController = (app: Elysia) =>
  app
    .group("user", (app) =>
      app
        .use(isAuthenticated([E_ROLES.OWNER]))
        .post(
          "review",
          async (context) => {
            const { body, set, headers } = context;
            try {
              const { restaurantId, review, stars } = body;

              const res = new ReviewTable().insert({
                restaurant: restaurantId,
                stars,
                user: headers.uid,
                ...(review && { review }),
              });

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
        .get("reviews", async (context) => {
          const { headers, set, query } = context;

          const { reviewId, restaurantId } = query;

          const uid = headers.uid;

          const reviewTable = new ReviewTable();

          const reviews = reviewId
            ? await reviewTable.getById(parseInt(reviewId))
            : await reviewTable.get({
                where: {
                  [ReviewTable.schema.restaurant]: restaurantId,
                  [ReviewTable.schema.user]: uid,
                },
              });

          return { reviews, message: "Fetched!" };
        })
    )
    .group(
      "owner",
      (app) =>
        app.post(
          "reply",
          async (context) => {
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
      //   .get('/reviews')
    );
