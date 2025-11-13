import { Role } from '@auth/entities/role.entity';
import { DataSource } from 'typeorm';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);

  return await roleRepository.save([
    { roleName: 'student' },
    { roleName: 'professor' },
  ]);
}
