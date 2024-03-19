import { IsNumber, IsString } from "class-validator";

export class CreateAuctionItemDTO {
    @IsString()
    itemDescription?: string; // This field is optional. If provided, it must be a string.

  }
  export class AuctionItemDTO extends CreateAuctionItemDTO {
    @IsNumber()
    itemId: number;
  }