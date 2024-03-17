import { Test, TestingModule } from '@nestjs/testing';
import { Auctions } from './auctions';

describe('Auctions', () => {
  let provider: Auctions;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Auctions],
    }).compile();

    provider = module.get<Auctions>(Auctions);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
