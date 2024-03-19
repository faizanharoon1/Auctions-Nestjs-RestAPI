import { Test, TestingModule } from '@nestjs/testing';
import { AuctionitemsService } from './auctionitems.service';

describe('AuctionitemsService', () => {
  let service: AuctionitemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuctionitemsService],
    }).compile();

    service = module.get<AuctionitemsService>(AuctionitemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
