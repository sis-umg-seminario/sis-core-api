import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Table1 } from './table1.entity';

@Entity({ schema: 'example', name: 'table2' })
export class Table2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  metadata: string;

  @ManyToOne(() => Table1, (table1) => table1.table2)
  table1: Table1;
}
