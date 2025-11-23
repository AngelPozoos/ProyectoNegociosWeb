import { Test, TestingModule } from '@nestjs/testing';
import { TransactionalController } from './transactional.controller';

describe('TransactionalController', () => {
  let controller: TransactionalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionalController],
    }).compile();

    controller = module.get<TransactionalController>(TransactionalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
