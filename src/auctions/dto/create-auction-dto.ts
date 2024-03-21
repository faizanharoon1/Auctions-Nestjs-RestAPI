import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, IsOptional, IsString, ArrayNotEmpty } from 'class-validator';
import { AuctionItemDTO } from '../auctionitems/dto/auction-items-dto';

 export abstract class BaseAuctionDto {
    @IsString()
    auctionName: string;
  
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => AuctionItemDTO)
    items: AuctionItemDTO[]; // This field represents an array of items, each with a name and quantity.
  }

  export class CreateAuctionDto extends BaseAuctionDto {
  @IsString()
    userId: string;
    

    @IsNumber()
    reservePrice: number;
 }

export class AuctionDto extends BaseAuctionDto {
    @IsNumber()
    id: number; 

    @IsNumber()
    currentBid: number;

      @IsNumber()
    totalRows?: number;

}