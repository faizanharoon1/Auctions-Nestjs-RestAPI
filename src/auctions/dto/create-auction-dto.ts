import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, IsOptional, IsString, ArrayNotEmpty } from 'class-validator';



export class CreateAuctionItemDTO {
    @IsString()
    itemDescription?: string; // This field is optional. If provided, it must be a string.

  }
  export class AuctionItemDTO extends CreateAuctionItemDTO {
    @IsNumber()
    itemId: number;
  }
  export class CreateAuctionDto {
    @IsString()
    auctionName: string;
  
    @IsNumber()
    reservePrice: number;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => AuctionItemDTO)
    items: AuctionItemDTO[]; // This field represents an array of items, each with a name and quantity.
  }

export class AuctionDto extends CreateAuctionDto {
    @IsNumber()
    auctionItemId: number; 


    @IsNumber()
    currentBid: number;
    @IsString()
    @IsOptional()
    bidderName: string;

}