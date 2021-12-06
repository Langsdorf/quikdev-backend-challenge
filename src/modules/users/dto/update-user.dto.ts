import { User } from "../entities/user.entity";

export default interface UpdateUserDto
  extends Omit<Partial<User>, "_id" | "id"> {}
