import { CreateExampleDto } from '@example/dtos/create-example.dto';
import { Table1 } from '@example/entities/table1.entity';
import { ExampleService } from '@example/services/example.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('/api/v1/example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('/')
  async findAll() {
    return this.exampleService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.exampleService.findOne(id);
  }

  @Post('/')
  async create(@Body() data: CreateExampleDto) {
    return this.exampleService.create(data);
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() data: Partial<Table1>) {
    return this.exampleService.update(id, data);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.exampleService.remove(id);
  }
}
