import { ErrorResponse } from ".";
import { User } from "../entities/user.entity";

export type GetUserResponse = User | ErrorResponse;
