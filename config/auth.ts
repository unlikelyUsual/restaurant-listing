import { jwt } from "@elysiajs/jwt";

export default jwt({
  name: "jwt", //this is the namespace
  secret: process.env.JWT_KEY as string,
});
