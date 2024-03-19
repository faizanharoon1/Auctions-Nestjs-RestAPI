import { IsString, IsNumber, IsNotEmpty, isNumber } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  @IsNotEmpty()
  auctionId: number;

  @IsNumber()
  @IsNotEmpty()
  maxAutoBidAmount: number;

  @IsString()
  @IsNotEmpty()
  bidderName: string;
}
