import { Module } from '@nestjs/common';
import { TransactionalController } from './transactional.controller';
import { TransactionalService } from './transactional.service';

import { PrismaService } from '../prisma.service';
import { PayPalService } from './paypal.service';

@Module({
  controllers: [TransactionalController],
  providers: [TransactionalService, PrismaService, PayPalService]
})
export class TransactionalModule { }
