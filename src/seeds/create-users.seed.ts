import { User } from '@auth/entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource, roleIds: number[]) {
  const userRepository = dataSource.getRepository(User);

  const hashedPass = await bcrypt.hash('secret', 10);

  return await userRepository.save([
    {
      email: 'johndoe@example.com',
      password: hashedPass,
      userRoles: [
        {
          roleId: roleIds[0],
        },
      ],
    },
    {
      email: 'janedoe@example.com',
      password: hashedPass,
      userRoles: [
        {
          roleId: roleIds[1],
        },
      ],
    },
  ]);
}
