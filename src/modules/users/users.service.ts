import { getManager } from "typeorm";
import CreateUserDto from "./dto/create-user.dto";
import UpdateUserDto from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import {
  CreateUserResponse,
  DeleteUserResponse,
  GetUserResponse,
  GetUsersResponse,
  UpdateUserResponse,
} from "./responses";

type UUID = string;

const userNotFoundDefaultResponse = {
  statusCode: 404,
  message: "User not found",
};

/**
 * Service para o módulo de usuários
 *
 * @method createUser(): Promise<CreateUserResponse>
 * @method getAll(): Promise<GetUsersResponse>
 * @method getById(): Promise<GetUserResponse>
 * @method update(): Promise<UpdateUserResponse>
 * @method delete(): Promise<DeleteUserResponse>
 */
export default class UserService {
  /**
   * Cria um novo usuário
   *
   * @param createUserDto Body da requisição
   * @returns CreateUserResponse
   */
  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const repository = getManager().getRepository(User);
    const newUser = repository.create(createUserDto);

    await repository.save(newUser);

    return newUser;
  }

  /**
   * Retorna todos os usuários
   *
   * @returns GetUsersResponse
   */
  async getAll(): Promise<GetUsersResponse> {
    const repository = getManager().getRepository(User);
    const users = await repository.find();

    const formattedUsers = users.map((user) => {
      delete user.password;
      return user;
    });

    return formattedUsers;
  }

  /**
   * Retorna um usuário pelo seu ID
   *
   * @param id UUID ID do usuário
   * @returns GetUserResponse
   */
  async getById(id: UUID): Promise<GetUserResponse> {
    const repository = getManager().getRepository(User);
    const user = await repository.findOne({ id });

    if (user) {
      delete user.password;
      return user;
    }

    return userNotFoundDefaultResponse;
  }

  /**
   * Atualiza um usuário
   *
   * @param id UUID ID do usuário
   * @param updateUserDto Body da requisição
   * @returns UpdateUserResponse
   */
  async update(
    id: UUID,
    updateUserDto: UpdateUserDto
  ): Promise<UpdateUserResponse> {
    const repository = getManager().getRepository(User);
    const user = await repository.findOne({ id });

    if (user) {
      Object.assign(user, updateUserDto);
      await repository.save(user);

      return user;
    }

    return userNotFoundDefaultResponse;
  }

  /**
   * Deleta um usuário
   *
   * @param id UUID ID do usuário
   * @returns DeleteUserResponse
   */
  async delete(id: UUID): Promise<DeleteUserResponse> {
    const repository = getManager().getRepository(User);
    const user = await repository.findOne({ id });

    if (user) {
      await repository.delete(user);

      return user;
    }

    return userNotFoundDefaultResponse;
  }
}
