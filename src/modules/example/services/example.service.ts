import { CreateExampleDto } from '@example/dtos/create-example.dto';
import { Table1 } from '@example/entities/table1.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Table1) private table1Repository: Repository<Table1>,
  ) {}

  async findAll(): Promise<Table1[]> {
    return this.table1Repository.find({ relations: ['table2'] });
  }

  async findOne(id: number): Promise<Table1 | null> {
    return this.table1Repository.findOne({
      where: { id },
      relations: ['table2'],
    });
  }

  async create(data: CreateExampleDto): Promise<Table1> {
    const table1 = this.table1Repository.create(data);
    return this.table1Repository.save(table1);
  }

  async update(id: number, data: Partial<Table1>): Promise<Table1 | null> {
    await this.table1Repository.update(id, data);
    return this.table1Repository.findOne({
      where: { id },
      relations: ['table2'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.table1Repository.delete(id);
  }
}
