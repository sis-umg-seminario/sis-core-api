import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseOffering } from './course-offering.entity';
import { TermType } from './term-type.entity';

@Entity({ schema: 'academic', name: 'academic_term' })
export class AcademicTerm {
  @PrimaryGeneratedColumn({ name: 'term_id' })
  termId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'term_type_id' })
  termTypeId: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => CourseOffering, (offering) => offering.term)
  courseOfferings: CourseOffering[];

  @ManyToOne(() => TermType, (type) => type.academicTerms)
  @JoinColumn({ name: 'term_type_id' })
  termType: TermType;
}
