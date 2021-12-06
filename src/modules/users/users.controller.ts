import {
  Body,
  DELETE,
  GET,
  Params,
  PATCH,
  POST,
  Protected,
  Response,
} from "@decorators";
import express from "express";
import CreateUserDto from "./dto/create-user.dto";
import UpdateUserDto from "./dto/update-user.dto";
import UserService from "./users.service";

/**
 * Controller para o módulo de usuário
 *
 * @POST /users - Cria um novo usuário
 * @GET /users/- Busca todos os usuários
 * @GET /users/:id - Busca um usuário pelo id
 * @PATCH /users/:id - Atualiza um usuário
 * @DELETE /users/:id - Deleta um usuário
 *
 */
export default class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  @POST()
  async create(
    @Response() response: express.Response,
    @Body() body: CreateUserDto
  ) {
    const user = await this.userService.createUser(body);

    response.status(201).json(user);
  }

  @GET()
  @Protected() // Decorator para proteger a rota (requer token)
  async getAll(@Response() response: express.Response) {
    const users = await this.userService.getAll();

    response.json(users);
  }

  @GET(":id")
  @Protected() // Decorator para proteger a rota (requer token)
  async getById(@Response() response: express.Response, @Params() params: any) {
    const user = await this.userService.getById(params.id);

    response.json(user);
  }

  @PATCH(":id")
  @Protected() // Decorator para proteger a rota (requer token)
  async update(
    @Response() response: express.Response,
    @Params() params: any,
    @Body() body: UpdateUserDto
  ) {
    const user = await this.userService.update(params.id, body);

    response.json(user);
  }

  @DELETE(":id")
  @Protected() // Decorator para proteger a rota (requer token)
  async delete(@Response() response: express.Response, @Params() params: any) {
    const user = await this.userService.delete(params.id);

    response.json(user);
  }
}
