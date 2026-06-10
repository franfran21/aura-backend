import { Controller, Post, Body, Get, UseGuards, Request, Query } from '@nestjs/common';
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
  @Get('daily')
  async getDaily(@Request() req, @Query('date') dateQuery?: string) {
    const userId = req.user.sub;
    const date = dateQuery ? new Date(dateQuery) : new Date();
    
    let insights = await this.insightsService.findDaily(userId, date);
    
    if (insights.length === 0) {
      // Generación automática si no existe
      return await this.generateDaily(req, dateQuery);
    }
    
    return {
      id: insights[0].id,
      title: insights[0].title,
      description: insights[0].description,
      aiDiagnosis: insights[0].aiDiagnosis,
      date: insights[0].createdAt,
    };
  }

  @UseGuards(AuthGuard)
  @Post('daily/generate')
  async generateDaily(@Request() req, @Query('date') dateQuery?: string) {
    const userPayload = req.user;
    const context = await this.insightsService.getUserCycleContext(userPayload.sub);

    const contextPrompt = `Genera un insight de salud para hoy en un tono empático y profesional como Luna. La usuaria está en el día ${context?.currentDay || 'desconocido'} de su ciclo, fase: ${context?.phase || 'desconocida'}.`;
    
    const diagnosis = await this.aiClient.dispatchAnalysis(contextPrompt, context?.phase);

    const title = `Insight: Fase ${context?.phase || 'Actual'}`;
    const description = `Día ${context?.currentDay || 'X'} · Análisis Hormonal Luna`;

    const insight = await this.insightsService.createInsight('', userPayload, diagnosis, title, description);
    
    return {
      id: insight.id,
      title: insight.title,
      description: insight.description,
      aiDiagnosis: insight.aiDiagnosis,
      date: insight.createdAt,
    };
  }

  @UseGuards(AuthGuard)
  @Get('history')
  async getHistory(@Request() req) {
    const userId = req.user.sub;
    const records = await this.insightsService.findByUserId(userId);
    return {
      system: 'AURAHEALTH+ LUNA AI',
      count: records.length,
      data: records,
    };
  }
}
