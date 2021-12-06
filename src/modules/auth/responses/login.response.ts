import { UnauthorizedResponse } from "./unauthorized.response";

type Token = string;

export type LoginResponse = Token | UnauthorizedResponse;
