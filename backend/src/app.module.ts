import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './catalog/catalog.module';
import { TransactionalModule } from './transactional/transactional.module';
import { LogisticsModule } from './logistics/logistics.module';

@Module({
  imports: [CatalogModule, TransactionalModule, LogisticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
