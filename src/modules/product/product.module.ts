import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "./product.model";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";

@Module({
    imports: [SequelizeModule.forFeature([Product])],
    providers: [ProductService],
    controllers: [ProductController],
    exports: [ProductService],
})

export class ProductModule {}