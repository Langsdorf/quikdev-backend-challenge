export default interface CreateUserDto {
  readonly name: string;
  readonly password: string;
  readonly username: string;
  readonly birthdate: string;
  readonly address: string;
  readonly addressNumber: number;
  readonly primaryPhone: string;
  readonly description: string;
}
