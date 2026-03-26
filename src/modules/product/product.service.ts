import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product) private productModel: typeof Product) {}

    async create(createProductDto: CreateProductDto) {
        const product = await this.productModel.create({ ...createProductDto });
        return product;
    }

    findAll(tenantId: string) {
        return this.productModel.findAll({ where: { tenantId } });
    }

    async findOne(id: number, tenantId: string) {
        const product = await this.productModel.findOne({ where: { id, tenantId } });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async update(id: number, tenantId: string, updateProductDto: UpdateProductDto) {
        const product = await this.findOne(id, tenantId);
        await this.productModel.update(updateProductDto, { where: { id, tenantId } });
        return product;
    }

    async remove(id: number, tenantId: string) {
        const product = await this.findOne(id, tenantId);
        await this.productModel.destroy({ where: { id, tenantId } });
        return product;
    }

}
