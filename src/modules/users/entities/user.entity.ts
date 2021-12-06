import { generateHash } from "@utils/Crypto";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

/**
 * User Entity
 *
 */
@Entity({ name: "users" })
export class User {
  /**
   * Coluna auto-gerada pelo banco de dados
   */
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  birthdate: string;

  @Column()
  address: string;

  @Column()
  addressNumber: number;

  @Column()
  primaryPhone: string;

  @Column()
  description: string;

  /**
   * Campo inserido automaticamente pelo TypeORM
   */
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: number;

  /**
   * Método executado antes de inserir o usuário no banco de dados
   * Gera um ID para o usuário
   */
  @BeforeInsert()
  async generateId() {
    this.id = uuid();
  }

  /**
   * Método executado antes de inserir o usuário no banco de dados
   * Encripta a senha do usuário
   */
  @BeforeInsert()
  async generatePassword() {
    if (this.password) this.password = await generateHash(this.password);
  }
}
