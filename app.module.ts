import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/loggers/logger.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { HealthModule } from 'src/modules/health/health.module';
import { ScheduleModules } from 'src/schedules/schedule.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './src/configs/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    LoggerModule,
    AuthModule,
    ScheduleModules
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
