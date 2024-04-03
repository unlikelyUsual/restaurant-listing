import { Elysia } from "elysia";
import auth from "./config/auth";
import { restaurantController } from "./controller/restaurant.controller";
import { reviewController } from "./controller/review.controller";
import { userController } from "./controller/user.controller";
import { logPlugin } from "./middleware/log";

const app = new Elysia();

//JWT Plugin
app.use(auth);
//Route Log Plugin
app.use(logPlugin);
//Controllers
app.use(userController);
app.use(restaurantController);
app.use(reviewController);

//Error handler
const PORT = process.env.PORT || 4040;
app
  // if routes match then it goes to error block
  .onError(({ code }) => {
    if (code === "NOT_FOUND") return "Route not found :(";
    else "Something went wrong!";
  })
  // Server listener
  .listen(PORT, () => console.log(`Server started on ${PORT}`));
