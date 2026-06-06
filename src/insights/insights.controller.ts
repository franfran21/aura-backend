import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { AuthGuard } from '../auth/auth.guard';
import { AiClient } from '../ai-engine/ai.client';

@Controller('insights')
export class InsightsController {
  constructor(
    private readonly insightsService: InsightsService,
    private readonly aiClient: AiClient,
  ) {}

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

  @UseGuards(AuthGuard)
  @Get('daily')
  async getDaily(@Request() req, @Request() query) {
    const userId = req.user.sub;
    const date = query.query.date ? new Date(query.query.date) : new Date();
    return await this.insightsService.findDaily(userId, date);
  }

  @UseGuards(AuthGuard)
  @Post('daily/generate')
  async generateDaily(@Request() req, @Request() query) {
    const userPayload = req.user;
    const context = await this.insightsService.getUserCycleContext(userPayload.sub);
    
    const contextPrompt = `Usuaria en Día ${context?.currentDay || 'X'} del ciclo, Fase: ${context?.phase || 'Folicular'}.`;
    const diagnosis = await this.aiClient.dispatchAnalysis(contextPrompt, context?.phase);
    
    const title = `Insight: Fase ${context?.phase || 'Actual'}`;
    const description = `Día ${context?.currentDay || 'X'} · Análisis Hormonal IA`;
    
    return await this.insightsService.createInsight('', userPayload, diagnosis, title, description);
  }
}
