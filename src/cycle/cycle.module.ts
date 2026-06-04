import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CycleService } from './cycle.service';
import { Cycle } from './cycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cycle])],
  providers: [CycleService],
  exports: [CycleService],
})
export class CycleModule {}
