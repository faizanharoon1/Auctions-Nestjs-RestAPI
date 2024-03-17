import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, IsOptional, IsString, ArrayNotEmpty } from 'class-validator';

export class Item {

    @IsString()
    ItemId: string;
  
  
    @IsString()
    itemDescription?: string; // This field is optional. If provided, it must be a string.
  }

  export class CreateAuctionDto {
    @IsNumber()
    reservePrice: number; // This field is required and must be a number.

  
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => Item)
    items: Item[]; // This field represents an array of items, each with a name and quantity.
  }

export class AuctionDto extends CreateAuctionDto {
    @IsNumber()
    auctionItemId: number; 

    @IsString()
    @IsOptional()
    bidderName: string;

    @IsNumber()
    currentBid: number; // This field is required and must be a number.

}