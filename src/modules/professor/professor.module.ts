import { Module } from '@nestjs/common';
import { ProfessorController } from './controllers/professor.controller';

@Module({
  controllers: [ProfessorController],
})
export class ProfessorModule {}
