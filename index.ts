import { Elysia } from "elysia";
import auth from "./config/auth";
import { userController } from "./controller/user";

const app = new Elysia();

const PORT = process.env.PORT || 4040;

app.use(auth); // using jwt
app.use(userController);
// app.use(logger());

app
  // if routes match then it goes to error block
  .onError(({ code }) => {
    if (code === "NOT_FOUND") return "Route not found :(";
    else "Something went wrong!";
  })
  .listen(PORT, () => console.log(`Server started on ${PORT}`));
