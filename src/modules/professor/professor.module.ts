import { Module } from '@nestjs/common';
import { ProfessorController } from './controllers/professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Professor])],
  controllers: [ProfessorController],
  exports: [TypeOrmModule],
})
export class ProfessorModule {}
