import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CycleService } from './cycle.service';
import { CycleController } from './cycle.controller';
import { Cycle } from './cycle.entity';
import { CycleLog } from './cycle-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cycle, CycleLog])],
  controllers: [CycleController],
  providers: [CycleService],
  exports: [CycleService],
})
export class CycleModule {}
