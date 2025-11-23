import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';

@Controller('logistics')
export class LogisticsController {
    constructor(private readonly logisticsService: LogisticsService) { }

    @Post()
    create(@Body() createShipmentDto: CreateShipmentDto) {
        return this.logisticsService.create(createShipmentDto);
    }

    @Get()
    findAll() {
        return this.logisticsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.logisticsService.findOne(id);
    }
}
