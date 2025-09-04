import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Table2 } from './table2.entity';

@Entity({ schema: 'example', name: 'table1' })
export class Table1 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Table2, (table2) => table2.table1, { cascade: true })
  table2: Table2[];
}
