import { User } from '@auth/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'professors', name: 'professor' })
export class Professor {
  @PrimaryGeneratedColumn({ name: 'professor_id' })
  professorId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'professional_title' })
  professionalTitle: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.professor)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
