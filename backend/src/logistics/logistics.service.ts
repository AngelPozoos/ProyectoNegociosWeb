import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Envio } from '@prisma/client';

@Injectable()
export class LogisticsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateShipmentDto): Promise<Envio> {
        const fechaEstimadaEntrega = new Date();
        fechaEstimadaEntrega.setDate(fechaEstimadaEntrega.getDate() + 3); // Mock 3 days delivery

        return this.prisma.envio.create({
            data: {
                pedidoId: data.orderId,
                direccion: data.address,
                fechaEstimadaEntrega,
                numeroSeguimiento: `TRK-${Math.floor(Math.random() * 1000000)}`,
            },
        });
    }

    async findAll(): Promise<Envio[]> {
        return this.prisma.envio.findMany();
    }

    async findOne(id: string): Promise<Envio | null> {
        return this.prisma.envio.findUnique({
            where: { id },
        });
    }
}
