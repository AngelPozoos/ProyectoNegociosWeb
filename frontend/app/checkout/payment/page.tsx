'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import CardPaymentForm from '@/components/CardPaymentForm';

type PaymentMethod = 'card' | 'paypal';

export default function PaymentPage() {
    const router = useRouter();
    const { cart, getTotalPrice } = useCart();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

    const handleCardApprove = async (orderId: string) => {
        // Redirect to shipping page with payment details
        router.push(`/checkout/shipping?paymentId=${orderId}&method=card`);
    };

    const handleCardError = (error: any) => {
        console.error('Card error:', error);
        alert('Error en el pago con tarjeta. Por favor, intenta de nuevo.');
    };

    const createPayPalOrder = async () => {
        try {
            const response = await api.post('/transactional/paypal/create-order', {
                amount: getTotalPrice(),
            });
            return response.data.id;
        } catch (error) {
            console.error('Error creating PayPal order:', error);
            throw error;
        }
    };

    const onPayPalApprove = async (data: any) => {
        // Redirect to shipping page with PayPal order ID
        // We will capture the payment there after shipping details are entered
        router.push(`/checkout/shipping?paymentId=${data.orderID}&method=paypal`);
    };

    if (cart.length === 0) {
        router.push('/checkout');
        return null;
    }

    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <h1 className="text-3xl font-bold mb-8 text-primary">Método de Pago</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-xl font-semibold mb-4">Resumen</h2>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total a Pagar</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Selecciona un Método de Pago</h2>
                <div className="space-y-3 mb-6">
                    <div
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 border rounded flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${paymentMethod === 'card' ? 'border-primary bg-blue-50' : ''
                            }`}
                    >
                        <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'card' ? 'border-primary bg-primary' : 'border-gray-300'
                            }`}></div>
                        <span>Tarjeta de Crédito / Débito</span>
                    </div>
                    <div
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-3 border rounded flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${paymentMethod === 'paypal' ? 'border-primary bg-blue-50' : ''
                            }`}
                    >
                        <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'paypal' ? 'border-primary bg-primary' : 'border-gray-300'
                            }`}></div>
                        <span>PayPal</span>
                    </div>
                </div>

                {paymentMethod === 'card' ? (
                    <div className="w-full">
                        {paypalClientId && paypalClientId !== 'your_paypal_client_id_here' ? (
                            <PayPalScriptProvider options={{
                                clientId: paypalClientId,
                                components: 'buttons,card-fields',
                                currency: 'USD'
                            }}>
                                <CardPaymentForm
                                    onApprove={handleCardApprove}
                                    onError={handleCardError}
                                    amount={getTotalPrice()}
                                    disabled={loading}
                                />
                            </PayPalScriptProvider>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
                                <p className="font-semibold text-yellow-800 mb-2">⚠️ PayPal no configurado</p>
                                <p className="text-yellow-700">
                                    Para usar pagos con tarjeta, configura <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> en tu archivo .env.local
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full">
                        {paypalClientId && paypalClientId !== 'your_paypal_client_id_here' ? (
                            <PayPalScriptProvider options={{
                                clientId: paypalClientId,
                                currency: 'USD'
                            }}>
                                <PayPalButtons
                                    createOrder={createPayPalOrder}
                                    onApprove={onPayPalApprove}
                                    onError={(err) => {
                                        console.error('PayPal error:', err);
                                        alert('Error con PayPal. Por favor, intenta de nuevo.');
                                    }}
                                    disabled={loading}
                                    style={{ layout: 'vertical' }}
                                />
                            </PayPalScriptProvider>
                        ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
                                <p className="font-semibold text-yellow-800 mb-2">⚠️ PayPal no configurado</p>
                                <p className="text-yellow-700">
                                    Para usar PayPal, configura <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> en tu archivo .env.local
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
