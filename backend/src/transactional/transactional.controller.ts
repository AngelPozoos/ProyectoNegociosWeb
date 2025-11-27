import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { TransactionalService } from './transactional.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PayPalService } from './paypal.service';

@Controller('transactional')
export class TransactionalController {
    constructor(
        private readonly transactionalService: TransactionalService,
        private readonly paypalService: PayPalService,
    ) { }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.transactionalService.create(createOrderDto);
    }

    @Get()
    findAll(@Query('userId') userId?: string) {
        return this.transactionalService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionalService.findOne(id);
    }

    @Patch(':id/cancel')
    cancelOrder(@Param('id') id: string) {
        return this.transactionalService.cancelOrder(id);
    }

    /**
     * Create a PayPal order
     */
    @Post('paypal/create-order')
    async createPayPalOrder(@Body() body: { amount: number }) {
        return this.paypalService.createOrder(body.amount);
    }

    /**
     * Capture a PayPal payment after user approval
     */
    @Post('paypal/capture-order')
    async capturePayPalOrder(@Body() body: { orderId: string; orderData: CreateOrderDto }) {
        // First capture the PayPal payment
        const paypalCapture = await this.paypalService.captureOrder(body.orderId);

        // If successful, create the order in our database
        if (paypalCapture.status === 'COMPLETED') {
            const order = await this.transactionalService.create(body.orderData);
            return {
                order,
                paypalCapture,
            };
        }

        throw new Error('PayPal payment was not completed');
    }
}
