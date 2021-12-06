import express from "express";
import generateRoutes from "./core/router";
import { log } from "./core/logging";
import chalk from "chalk";
import connection from "@connection";
import { logger } from "./middlewares/logger.middleware";

/**
 * Inicia a conexão com o banco de dados e inicia o servidor
 */
connection.create().then(() => {
  init();
});

const init = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(logger); // Middleware para logar as requisições

  await generateRoutes(app); // Gera as rotas

  /**
   * Caso uma rota não exista, retorna um erro 404
   */
  app.all("*", (req: express.Request, res: express.Response) => {
    res.status(404).json({
      statusCode: 404,
      message: `${req.path} not found`,
    });
  });

  /**
   * Inicia o servidor
   */
  app.listen(process.env.PORT || 3001, () => {
    log(
      `${chalk.cyan("Server started on port")} ${chalk.redBright(
        process.env.PORT
      )}`
    );
  });
};
