import { Body, POST, Request, Response } from "@decorators";
import AuthService from "./auth.service";
import express from "express";
import LoginDto from "./dto/login.dto";
import { UnauthorizedResponse } from "./responses";

/**
 * Controller para o módulo de autenticação
 *
 * @POST /auth/login - Realiza o login do usuário e retorna o token de autenticação
 */
export default class AuthController {
  constructor(private readonly authService: AuthService = new AuthService()) {}

  @POST("/login")
  async login(@Response() res: express.Response, @Body() body: LoginDto) {
    const { username, password } = body;
    const response = await this.authService.login(username, password);

    if ((response as UnauthorizedResponse).statusCode) {
      return res
        .status((response as UnauthorizedResponse).statusCode)
        .json(response);
    }

    return res.json(response);
  }
}
