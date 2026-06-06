import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { CycleService } from './cycle.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('cycle')
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @UseGuards(AuthGuard)
  @Post('log')
  async logCycleData(
    @Body() body: { startDate: string; endDate?: string; symptoms?: string[]; mood?: string; notes?: string },
    @Request() req,
  ) {
    const userId = req.user.sub;
    return await this.cycleService.logCycle(userId, body);
  }

  @UseGuards(AuthGuard)
  @Get('current')
  async getCurrentCycle(@Request() req) {
    const userId = req.user.sub;
    return await this.cycleService.getCurrentCycle(userId);
  }

  @UseGuards(AuthGuard)
  @Get('calendar')
  async getCalendar(
    @Query('year') year: number,
    @Query('month') month: number,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return await this.cycleService.getCalendarMonth(userId, +year, +month);
  }

  @UseGuards(AuthGuard)
  @Post('day')
  async logDay(@Body() body: {
    date: string;
    flow?: string;
    energy?: string;
    mood?: string;
    symptoms?: string[];
    intercourse?: boolean;
    protected?: boolean;
    notes?: string;
  }, @Request() req) {
    const userId = req.user.sub;
    return await this.cycleService.logDay(userId, body);
  }

  @UseGuards(AuthGuard)
  @Post('period')
  async setPeriodDate(@Body() body: { date: string }, @Request() req) {
    const userId = req.user.sub;
    return await this.cycleService.setPeriodDate(userId, body);
  }

  @UseGuards(AuthGuard)
  @Get('stats')
  async getStats(@Request() req) {
    const userId = req.user.sub;
    return await this.cycleService.getStats(userId);
  }
}
