import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')

export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    create(@Req() req, @Body() createProductDto: CreateProductDto) {
        return this.productService.create({ ...createProductDto, tenantId: req.user.tenantId });
    }

    @Get()
    findAll(@Req() req) {
        return this.productService.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Req() req, @Param('id') id: string) {
        return this.productService.findOne(+id, req.user.tenantId);
    }

    @Put(':id')
    update(@Req() req, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(+id, req.user.tenantId, updateProductDto);
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        return this.productService.remove(+id, req.user.tenantId);
    }

}
