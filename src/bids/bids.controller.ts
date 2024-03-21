import { Controller, Get, Post, Body, Patch, Param, Delete, Sse, Query } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService,
    private eventEmitter: EventEmitter2) {}

  @Post()
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidsService.submit_bid(createBidDto);
  }

 @Sse('outbid/sse')
  sse(@Query('userId') userId: string): Observable<MessageEvent> {
    
    return new Observable(subscriber => {
      const listener = ( user_Id: string, message: string) => {
        // Only send the message if the userId matches
        console.log("Hit user sse:"+userId)
         console.log("incoming user sse:"+user_Id)
        if (userId === user_Id) {
          subscriber.next({ data: message });
        }
      };

      this.eventEmitter.on('message.outbid', listener);

      return () => this.eventEmitter.off('message.outbid', listener);
    });
  }

}
export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}