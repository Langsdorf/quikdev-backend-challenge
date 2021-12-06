import { log } from "./logging";
import chalk from "chalk";
import { Application, Request, Response } from "express";
import * as fs from "fs";
import path from "path";
import { clearRoutes, getRoutesObject } from "./decorators";
import { verifyAuthentication } from "src/middlewares/verify-authentication.middleware";

/**
 * Função para percorrer os arquivos das rotas
 *
 * @param dir Caminho do diretório
 * @param files Lista de arquivos
 */
const throughDirectory = (dir: string, files: string[]) => {
  fs.readdirSync(dir).forEach((file) => {
    const absolute = path.join(dir, file);
    if (fs.statSync(absolute).isDirectory())
      return throughDirectory(absolute, files);
    else return files.push(absolute);
  });
};

/**
 * Função para carregar as rotas
 *   - Verifica os arquivos da pasta src/modules
 *   - Verifica se o controller existe e cria uma nova instância dele
 *   - Percorre as rotas geradas pelos decorators e configura as rotas no express de acordo com o retorno do decorator
 *
 * @param app Aplicação do express
 * @returns Promise<void>
 */
const generateRoutes = (app: Application) => {
  return new Promise<void>((resolve) => {
    const modules: string[] = [];
    log("Generating routes...");

    const modulesPath = path.join(__dirname, "../modules");

    if (!fs.existsSync(modulesPath)) {
      log("Modules path not found", "red");
      return resolve();
    }

    fs.readdirSync(modulesPath).forEach((file) => {
      const absolute = path.join(modulesPath, file);
      if (fs.statSync(absolute).isDirectory()) modules.push(file);
    });

    log(
      `${chalk.yellow(modules.length)} modules found in ${chalk.yellow(
        "src/modules"
      )}, starting routes...`
    );

    modules.forEach((module, index) => {
      const controllerPath = path.join(
        modulesPath,
        module,
        `${module}.controller.ts`
      );

      if (fs.existsSync(controllerPath)) {
        log(`Loading routes from ${chalk.yellow(module)}...`);

        const Controller = require(controllerPath).default;

        // Inicializa o controller
        const ControllerClass = new Controller();

        const routes = getRoutesObject();

        // Percorre as rotas geradas pelos decorators
        routes.forEach((route) => {
          const { method, path, handler, attributes } = route;

          // Aplica a rota no express
          app[method.toLowerCase()](
            `/${module + path}`,
            attributes.protected // Verifica se a rota é protegida
              ? verifyAuthentication
              : (_r: Request, _q: Response, n: Function) => {
                  n();
                },
            (request: Request, response: Response, next: Function) => {
              // Chama a função que será executada na rota e passa os parâmetros para o decorator realizar o parse.
              handler.apply(ControllerClass, [
                { type: "request", parameter: request },
                { type: "response", parameter: response },
                { type: "next", parameter: next },
                { type: "body", parameter: request.body },
                { type: "params", parameter: request.params },
              ]);
            }
          );

          log(
            `${chalk.blue(route.method)} ${chalk.magenta(module + route.path)}`
          );
        });

        log(
          `${chalk.yellow(routes.length)} route${
            routes.length > 1 ? "s" : ""
          } loaded from ${chalk.yellow(module)}`
        );

        clearRoutes();
      }
      if (index === modules.length - 1) resolve();
    });
  });
};

export default generateRoutes;
