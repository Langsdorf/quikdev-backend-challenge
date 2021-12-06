import express from "express";
import { log } from "src/core/logging";

/**
 * Middleware para registrar todas requisições
 *
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const logger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const fullString = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  log(
    `${req.method} ${fullString} ${req.get("user-agent")} ${
      req.ip
    } ${JSON.stringify(req.body)}`
  );

  next();
};
