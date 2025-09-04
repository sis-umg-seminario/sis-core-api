import { Module } from '@nestjs/common';
import { ExampleService } from '@example/services/example.service';
import { ExampleController } from '@example/controllers/example.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table2 } from './entities/table2.entity';
import { Table1 } from './entities/table1.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Table1, Table2])],
  providers: [ExampleService],
  controllers: [ExampleController],
  exports: [TypeOrmModule],
})
export class ExampleModule {}
