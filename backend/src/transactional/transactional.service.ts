import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Pedido } from '@prisma/client';

@Injectable()
export class TransactionalService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateOrderDto): Promise<Pedido> {
        // Ensure user exists to prevent 500 errors
        const userExists = await this.prisma.usuario.findUnique({
            where: { id: data.userId }
        });

        if (!userExists) {
            console.log(`User ${data.userId} not found. Creating dummy user for demo.`);
            await this.prisma.usuario.create({
                data: {
                    id: data.userId,
                    email: `demo_${Date.now()}@example.com`,
                    nombre: 'Demo User',
                    password: 'demo_password', // In a real app, hash this
                    rol: 'CLIENTE',
                }
            });
        }

        return this.prisma.pedido.create({
            data: {
                usuarioId: data.userId,
                total: data.total,
                items: {
                    create: data.items.map((item) => ({
                        productoId: item.productId,
                        cantidad: item.quantity,
                        precio: item.price,
                    })),
                },
                envio: data.shipment ? {
                    create: {
                        direccion: data.shipment.address,
                        fechaEstimadaEntrega: data.shipment.estimatedDelivery ? new Date(data.shipment.estimatedDelivery) : undefined,
                        estado: 'PREPARANDO'
                    }
                } : undefined,
                direccionEnvio: data.direccionEnvio ? {
                    create: {
                        calle: data.direccionEnvio.calle,
                        ciudad: data.direccionEnvio.ciudad,
                        estado: data.direccionEnvio.estado,
                        codigoPostal: data.direccionEnvio.codigoPostal,
                        pais: data.direccionEnvio.pais,
                        metodoPago: data.direccionEnvio.metodoPago as any,
                        nombreTitular: data.direccionEnvio.nombreTitular,
                    }
                } : undefined,
            },
            include: { items: true, envio: true, direccionEnvio: true },
        });
    }

    async findAll(): Promise<Pedido[]> {
        return this.prisma.pedido.findMany({ include: { items: true, envio: true, direccionEnvio: true } });
    }

    async findOne(id: string): Promise<Pedido | null> {
        return this.prisma.pedido.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        producto: true, // Include product details for each item
                    }
                },
                envio: true,
                direccionEnvio: true,
            },
        });
    }

    async cancelOrder(id: string): Promise<Pedido> {
        // Update order status to CANCELADO
        const order = await this.prisma.pedido.update({
            where: { id },
            data: {
                estado: 'CANCELADO',
            },
            include: {
                items: {
                    include: {
                        producto: true,
                    }
                },
                envio: true,
                direccionEnvio: true,
            },
        });

        // If there's a shipment, update its status to DEVUELTO
        if (order.envio) {
            await this.prisma.envio.update({
                where: { pedidoId: id },
                data: {
                    estado: 'DEVUELTO',
                },
            });
        }

        return order;
    }
}
