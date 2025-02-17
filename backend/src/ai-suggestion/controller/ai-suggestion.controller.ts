import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { AISuggestionService } from '../service/ai-suggestion.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('suggestion')
@UseGuards(JwtAuthGuard)
export class AISuggestionController {
  constructor(private readonly aiSuggestionService: AISuggestionService) {}

  @Post('suggest-priorities')
  async suggestPriorities(@Body() { tasks }) {
    return this.aiSuggestionService.suggestPriorities(tasks);
  }

  @Get('productivity-tip')
  async getProductivityTip(
    @Query('completedTasks') completedTasks: number,
    @Query('totalTasks') totalTasks: number,
  ) {
    return this.aiSuggestionService.getProductivityTip(
      completedTasks,
      totalTasks,
    );
  }

  @Post('generate-reminders')
  async generateReminders(@Body() { tasks }, @GetUser() user: User) {
    return this.aiSuggestionService.generateReminders(tasks, user);
  }
}
