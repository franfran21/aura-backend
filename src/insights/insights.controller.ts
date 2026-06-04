import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @UseGuards(AuthGuard)
  @Post('register')
  async registerMetrics(@Body() body: { metricsRaw: string }, @Request() req) {
    const userPayload = req.user;
    return await this.insightsService.createInsight(body.metricsRaw, userPayload);
  }

  @UseGuards(AuthGuard)
  @Get('history')
  async getHistory(@Request() req) {
    const userId = req.user.sub;
    const records = await this.insightsService.findByUserId(userId);
    return {
      system: 'AURAHEALTH+ HYBRID AI',
      count: records.length,
      data: records,
    };
  }
}
