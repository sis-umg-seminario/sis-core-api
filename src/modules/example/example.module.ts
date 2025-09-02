import { Module } from '@nestjs/common';
import { ExampleService } from '@example/services/example.service';
import { ExampleController } from '@example/controllers/example.controller';

@Module({
  providers: [ExampleService],
  controllers: [ExampleController],
})
export class ExampleModule {}
