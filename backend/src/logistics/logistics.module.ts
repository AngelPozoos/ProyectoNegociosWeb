import { Module } from '@nestjs/common';
import { LogisticsController } from './logistics.controller';
import { LogisticsService } from './logistics.service';

import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LogisticsController],
  providers: [LogisticsService, PrismaService]
})
export class LogisticsModule { }
