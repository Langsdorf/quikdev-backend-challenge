import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Criptografa uma senha
 *
 * @param password string Senha
 * @returns Hash da senha
 */
const generateHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verifica se uma senha é válida
 *
 * @param password string Senha
 * @param hash string hash da senha
 * @returns boolean
 */
const compareHash = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export { generateHash, compareHash };
