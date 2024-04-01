import { consoleColors } from "../utils/enums";

export default class Logger {
  private namespace: string = "";

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  log = (message: unknown, ...rest: any[]): void => {
    console.log(
      `${consoleColors.fg.blue} ${this.namespace} =>`,
      message,
      ...rest
    );
  };

  error = (message: unknown, ...rest: any[]): void => {
    console.error(
      `${consoleColors.fg.white} ${this.namespace} =>`,
      message,
      ...rest
    );
  };

  warn = (message: unknown, ...rest: any[]): void => {
    console.warn(
      `${consoleColors.fg.white} ${this.namespace} =>`,
      message,
      ...rest
    );
  };
}
