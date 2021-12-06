import { User } from "@modules/users/entities/user.entity";
import { compareHash } from "@utils/Crypto";
import { getManager } from "typeorm";
import { LoginResponse } from "./responses";
import * as jwt from "jsonwebtoken";

/**
 * Resposta padrão para erro no login
 */
const invalidCredentialsDefaultResponse: LoginResponse = {
  statusCode: 401,
  message: "Invalid credentials",
};

/**
 * Service para o módulo de autenticação
 *
 * @method login(): Promise<LoginResponse>
 */
export default class AuthService {
  /**
   * Procura as informações do usuário no banco de dados e compara (caso encontrado) a senha com a senha criptografada
   * A reposta de usuário não encontrado é a mesma resposta padrão para erro de credenciais inválidas para melhorar a segurança
   *
   * @param username string Username
   * @param password string Senha do usuário
   * @returns LoginResponse
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const repository = getManager().getRepository(User);
    const user = await repository.findOne({ username });

    if (!user) return invalidCredentialsDefaultResponse;

    const isValid = await compareHash(password, user.password);

    if (!isValid) return invalidCredentialsDefaultResponse;

    delete user.password;

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Tempo de expiração do token
    });

    return token;
  }
}
