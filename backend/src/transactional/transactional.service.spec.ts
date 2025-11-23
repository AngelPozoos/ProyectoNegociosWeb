import { Test, TestingModule } from '@nestjs/testing';
import { TransactionalService } from './transactional.service';

describe('TransactionalService', () => {
  let service: TransactionalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionalService],
    }).compile();

    service = module.get<TransactionalService>(TransactionalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
