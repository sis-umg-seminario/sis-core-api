import { Table1 } from '@example/entities/table1.entity';
import { Table2Dto } from './table2.dto';

export class CreateExampleDto
  implements Partial<Pick<Table1, 'name' | 'description'>>
{
  name: string;
  description: string;
  table2: Table2Dto[];
}
