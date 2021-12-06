import AuthService from "./auth.service";
import connection from "@connection";
import UserService from "@modules/users/users.service";
import { UnauthorizedResponse } from "./responses";

/**
 * Prepara as variáveis para os testes e inicia a conexão com o banco de dados
 */
beforeAll(async () => {
  process.env.JWT_SECRET = "secret";
  process.env.MONGODB_URL = "mongodb://root:root@127.0.0.1:27017/";

  await connection.create();
});

/**
 * Finaliza a conexão com o banco de dados
 */
afterAll(async () => {
  await connection.close();
});

/**
 * Testa o método de autenticação
 */
describe("AuthService", () => {
  let userService: UserService;
  let authService: AuthService;

  /**
   *  Usuário para os testes
   */
  const mockUser = {
    name: "name",
    username: "username",
    password: "password",
    birthdate: "birthdate",
    address: "address",
    addressNumber: 7,
    primaryPhone: "primaryPhone",
    description: "description",
  };

  let userId: string;

  /**
   * Inicia o serviço de usuário
   * Inicia o serviço de autenticação
   * Cria um usuário para os testes
   */
  beforeAll(async () => {
    userService = new UserService();
    authService = new AuthService();

    const user = await userService.createUser(mockUser);
    userId = user.id;
  });

  /**
   * Apaga o usuário criado para os testes
   */
  afterAll(async () => {
    await userService.delete(userId);
  });

  /**
   * Verifica se os serviços foram iniciados
   */
  it("should be defined", () => {
    expect(userService).toBeDefined();
    expect(authService).toBeDefined();
  });

  /**
   * Testa o método de autenticação
   */
  describe("Login", () => {
    /**
     * Testa o método de autenticação com usuário e senha válidos
     */
    it("should be able to login a user successfully", async () => {
      const token = await authService.login(
        mockUser.username,
        mockUser.password
      );

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    /**
     * Testa o método de autenticação com usuário válido e senha inválida
     */
    it("should be able to login a user unsuccessfully", async () => {
      const unauthorizedResponse = await authService.login(
        mockUser.username,
        "wrongPassword"
      );

      expect(unauthorizedResponse).toBeDefined();
      expect(
        (unauthorizedResponse as UnauthorizedResponse).statusCode
      ).toBeDefined();
      expect((unauthorizedResponse as UnauthorizedResponse).statusCode).toBe(
        401
      );
    });
  });
});
