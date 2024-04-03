import Elysia from "elysia";
import { consoleColors } from "../utils/enums";

export const logPlugin = new Elysia().onRequest((param) => {
  const { method, url, body } = param.request;
  console.log(getMethodColor(method), url, body?.values(), "\n");
});

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return `${consoleColors.fg.green} ${method} 🟢 `;
    case "POST":
      return `${consoleColors.fg.red} ${method} 🔴 `;
    default:
      return `${consoleColors.fg.yellow} ${method} 🟡`;
  }
};
