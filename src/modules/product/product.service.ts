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

    findAll() {
        return this.productModel.findAll();
    }

    async findOne(id: number) {
        const product = await this.productModel.findByPk(id);
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        await this.productModel.update(updateProductDto, { where: { id } });
        return this.findOne(id);
    }

    async remove(id: number) {
        const product = await this.findOne(id);
        await this.productModel.destroy({ where: { id } });
        return product;
    }

}
