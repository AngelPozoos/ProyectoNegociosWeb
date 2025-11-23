import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PayPalService {
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    // Sandbox environment
    const environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID || 'PAYPAL_CLIENT_ID_NOT_SET',
      process.env.PAYPAL_CLIENT_SECRET || 'PAYPAL_CLIENT_SECRET_NOT_SET',
    );
    this.client = new paypal.core.PayPalHttpClient(environment);
  }

  /**
   * Create a PayPal order
   */
  async createOrder(amount: number, currency: string = 'USD') {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,             // usamos el parámetro
            value: amount.toFixed(2),           // usamos amount, no "total"
          },
        },
      ],
      payment_source: {
        paypal: {},
      },
    } as any); // el "as any" es solo para callar a TS con los tipos de PayPal

    try {
      const response = await this.client.execute(request);
      return {
        id: response.result.id,
        status: response.result.status,
      };
    } catch (error) {
      console.error('PayPal Create Order Error:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  /**
   * Capture a PayPal order after user approval
   */
  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);

    // Algunos tipos exigen un objeto, aunque sea vacío
    request.requestBody({} as any);

    try {
      const response = await this.client.execute(request);
      return {
        id: response.result.id,
        status: response.result.status,
        payer: response.result.payer,
        purchase_units: response.result.purchase_units,
      };
    } catch (error) {
      console.error('PayPal Capture Order Error:', error);
      throw new Error('Failed to capture PayPal payment');
    }
  }
}
