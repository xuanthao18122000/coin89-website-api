import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from 'src/database/entities';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModules {}
