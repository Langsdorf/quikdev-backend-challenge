import chalk from "chalk";
import * as fs from "fs";

export const emptyLine = () => console.log("");

/**
 * Função para registrar um log no console e salvar no arquivo de log.
 *
 * @param message Mensagem a ser exibida
 * @param color Cor da mensagem (default: green)
 */
export const log = (message: string, color: string = "green") => {
  emptyLine();
  console.log(chalk[color](message));

  Logger.getInstance().log(message);
};

/**
 * Classe para controlar o arquivo de log.
 */
export class Logger {
  private static instance: Logger;
  private fileName: string;

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private constructor() {
    const timestamp = new Date().getTime();
    this.fileName = `logs/${timestamp}.log`;
  }

  public log(message: string) {
    const date = new Date().toLocaleString();
    fs.appendFile(this.fileName, `[${date}] ${message}\n`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
