import { Module } from '@nestjs/common';
import { AISuggestionController } from './controller/ai-suggestion.controller';
import { AISuggestionService } from './service/ai-suggestion.service';

@Module({
  controllers: [AISuggestionController],
  providers: [AISuggestionService],
})
export class AISuggestionModule {}
