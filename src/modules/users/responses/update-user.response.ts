import { ErrorResponse } from ".";
import { User } from "../entities/user.entity";

export type UpdateUserResponse = User | ErrorResponse;
