import { createConnection, getConnection } from "typeorm";

/**
 * Objeto que representa a conexão com o banco de dados.
 */
const connection = {
  /**
   * Cria a conexão com o banco de dados.
   */
  async create() {
    await createConnection({
      type: "mongodb",
      url: process.env.MONGODB_URL,
      useNewUrlParser: true,
      synchronize: true,
      useUnifiedTopology: true,
      logging: true,
      entities: ["src/modules/**/entities/*.entity.ts"],
      migrations: ["src/modules/**/migrations/*.ts"],
      subscribers: ["src/modules/**/subscribers/*.ts"],
    });
  },

  /**
   * Fecha a conexão com o banco de dados.
   */
  async close() {
    await getConnection().close();
  },
};
export default connection;
