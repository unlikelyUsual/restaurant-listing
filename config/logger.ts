export default class Logger {
  private namespace: string = "";

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  log = (message: unknown, ...rest: any[]): void => {
    console.log(this.namespace, message, ...rest);
  };

  error = (message: unknown, ...rest: any[]): void => {
    console.error(this.namespace, message, ...rest);
  };

  warn = (message: unknown, ...rest: any[]): void => {
    console.warn(this.namespace, message, ...rest);
  };
}
