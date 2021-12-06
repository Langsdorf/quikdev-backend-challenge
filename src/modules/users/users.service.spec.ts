import UserService from "./users.service";
import connection from "@connection";
import { User } from "./entities/user.entity";

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
 * Testa os métodos relacionados ao usuário
 */
describe("UserService", () => {
  let userService: UserService;

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
   */
  beforeEach(() => {
    userService = new UserService();
  });

  /**
   * Verifica se o serviço foi iniciado
   */
  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  /**
   * Testa o método de criação de usuário
   */
  describe("createUser", () => {
    it("should be defined", () => {
      expect(userService.createUser).toBeDefined();
    });

    it("should create a user", async () => {
      const response = await userService.createUser(mockUser);
      expect(response).toBeDefined();
      expect(response).toHaveProperty("id");

      userId = response.id;
    });
  });

  /**
   * Testa o método de busca de usuário
   */
  describe("getById", () => {
    it("should be defined", () => {
      expect(userService.getById).toBeDefined();
    });

    it("should return a user", async () => {
      const user = await userService.getById(userId);
      expect(user).toBeDefined();
      expect(user).toHaveProperty("id");
    });
  });

  /**
   * Testa o método de busca de usuários
   */
  describe("getAll", () => {
    it("should be defined", () => {
      expect(userService.getAll).toBeDefined();
    });

    it("should return a list of users", async () => {
      const users = await userService.getAll();
      expect(users).toBeDefined();
      expect(users.length).toBeGreaterThanOrEqual(1);
    });
  });

  /**
   * Testa o método de atualização de usuário
   */
  describe("updateUser", () => {
    it("should be defined", () => {
      expect(userService.update).toBeDefined();
    });

    it("should update a user", async () => {
      mockUser.name = "new name";

      const user = await userService.update(userId, mockUser);
      expect(user).toBeDefined();
      expect(user).toHaveProperty("id");
      expect((user as User).name).toBe("new name");
    });
  });

  /**
   * Testa o método de exclusão de usuário
   */
  describe("deleteUser", () => {
    it("should be defined", () => {
      expect(userService.delete).toBeDefined();
    });

    it("should delete a user", async () => {
      const response = await userService.delete(userId);
      expect(response).toBeDefined();
      expect(response).toHaveProperty("id");
    });
  });
});
