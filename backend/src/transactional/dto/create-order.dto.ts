export class CreateOrderDto {
    userId: string;
    items: { productId: string; quantity: number; price: number }[];
    total: number;
    shipment?: {
        address: string;
        estimatedDelivery?: string; // ISO Date string
    };
    direccionEnvio?: {
        calle: string;
        ciudad: string;
        estado: string;
        codigoPostal: string;
        pais: string;
        metodoPago: string;
        nombreTitular?: string;
    };
}
