import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { User } from '../entities/User';

interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
}

export { IUserRepository };
