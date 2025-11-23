export class CreateOrderDto {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
    total: number;
    shipment?: {
        address: string;
        estimatedDelivery?: string; // ISO Date string
    };
}
