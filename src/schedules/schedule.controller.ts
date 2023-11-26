import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from 'src/common/decorators/public.decorator';
import { ScheduleService } from './schedule.service';

@ApiTags('3. Schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(
    private scheduleService: ScheduleService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Cron Job' })
  cronJob() {
    return this.scheduleService.handleCron();
  }
}
