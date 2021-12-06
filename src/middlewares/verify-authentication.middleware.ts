import express from "express";
import * as jwt from "jsonwebtoken";

/**
 * Middleware para verificar a autenticidade do token nas rotas protegidas
 *
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const verifyAuthentication = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let token = req.headers["authorization"];

  if (!token) {
    res.status(403).end();
    return;
  }

  if (token.startsWith("Bearer ")) token = token.slice(7);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).end();
      return;
    }

    (req as any).user = user;
    next();
  });
};
