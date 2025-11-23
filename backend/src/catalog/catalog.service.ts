import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Producto } from '@prisma/client';

@Injectable()
export class CatalogService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateProductDto): Promise<Producto> {
        return this.prisma.producto.create({
            data: {
                nombre: data.name,
                descripcion: data.description,
                precio: data.price,
                sku: data.sku,
                stock: data.stock,
                categoria: data.category,
                imagenes: Array.isArray(data.images) ? data.images.join(',') : (data.images as any),
            },
        });
    }

    async findAll(): Promise<Producto[]> {
        return this.prisma.producto.findMany();
    }

    async findOne(id: string): Promise<Producto | null> {
        return this.prisma.producto.findUnique({
            where: { id },
        });
    }
}
