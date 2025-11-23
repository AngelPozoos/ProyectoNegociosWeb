import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('catalog')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) { }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.catalogService.create(createProductDto);
    }

    @Get()
    findAll() {
        return this.catalogService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.catalogService.findOne(id);
    }
}
