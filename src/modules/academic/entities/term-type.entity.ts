import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AcademicTerm } from './academic-term.entity';

@Entity({ schema: 'academic', name: 'term_type' })
export class TermType {
  @PrimaryGeneratedColumn({ name: 'term_type_id' })
  termTypeId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'duration_months' })
  durationMonths: number;

  @Column({ name: 'description' })
  description: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => AcademicTerm, (term) => term.termType)
  academicTerms: AcademicTerm[];
}
