'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useNotification } from '@/app/context/NotificationContext';
import api from '@/lib/api';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';

import { useAuth } from '@/app/context/AuthContext';

export default function ShippingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cart, getTotalPrice, clearCart } = useCart();
    const { showNotification } = useNotification();
    const { user } = useAuth();

    const [calle, setCalle] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [estado, setEstado] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [pais, setPais] = useState('México');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [cardholderName, setCardholderName] = useState('');

    useEffect(() => {
        const pid = searchParams.get('paymentId');
        const name = searchParams.get('cardholderName');
        if (!pid) {
            // If no payment ID, redirect back to checkout
            router.push('/checkout');
            return;
        }
        setPaymentId(pid);
        if (name) setCardholderName(decodeURIComponent(name));
    }, [searchParams, router]);

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-primary mb-4">Envío</h1>
                <p className="text-gray-600 mb-8">No hay productos para enviar.</p>
                <Link href="/catalogo" className="btn btn-primary">
                    Ir al Catálogo
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!calle || !ciudad || !estado || !codigoPostal || !pais || !deliveryDate) {
            showNotification({
                type: 'warning',
                title: 'Por favor completa todos los campos de envío',
            });
            return;
        }

        const method = searchParams.get('method');

        try {
            setLoading(true);

            if (!user) {
                showNotification({
                    type: 'error',
                    title: 'Debes iniciar sesión para completar el pedido',
                });
                return;
            }

            const orderData = {
                userId: user.id,
                items: cart.map(item => ({
                    productId: item.id,
                    price: item.price,
                    quantity: item.quantity,
                })),
                total: getTotalPrice(),
                shipment: {
                    address: `${calle}, ${ciudad}, ${estado}, ${codigoPostal}, ${pais}`,
                    estimatedDelivery: new Date(deliveryDate).toISOString(),
                },
                direccionEnvio: {
                    calle,
                    ciudad,
                    estado,
                    codigoPostal,
                    pais,
                    metodoPago: method === 'paypal' ? 'PAYPAL' : 'TARJETA_CREDITO',
                    nombreTitular: cardholderName || undefined,
                }
            };

            let response;

            if (method === 'paypal') {
                // Capture PayPal order
                response = await api.post('/transactional/paypal/capture-order', {
                    orderId: paymentId,
                    orderData: orderData
                });
            } else {
                // Card payment (demo) - just create order
                response = await api.post('/transactional', orderData);
            }

            console.log('Order created successfully:', response.data);
            showNotification({
                type: 'success',
                title: '¡Pedido completado con éxito!',
            });
            clearCart();
            setTimeout(() => {
                router.push('/mis-pedidos');
            }, 1000);
        } catch (error: any) {
            console.error('Order creation failed:', error);
            const errorMessage = error.response?.data?.message || 'Error al crear el pedido';
            showNotification({
                type: 'error',
                title: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    // Calculate minimum date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <h1 className="text-3xl font-bold mb-8 text-primary">Datos de Envío</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-xl font-semibold mb-4">Resumen</h2>
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Artículos</span>
                    <span>{cart.length}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total Pagado</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Pago autorizado ({paymentId})
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Calle y Número
                    </label>
                    <input
                        type="text"
                        value={calle}
                        onChange={(e) => setCalle(e.target.value)}
                        placeholder="Calle y número de domicilio"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ciudad
                        </label>
                        <input
                            type="text"
                            value={ciudad}
                            onChange={(e) => setCiudad(e.target.value)}
                            placeholder="Ciudad"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <input
                            type="text"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            placeholder="Estado"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código Postal
                        </label>
                        <input
                            type="text"
                            value={codigoPostal}
                            onChange={(e) => setCodigoPostal(e.target.value)}
                            placeholder="C.P."
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                            disabled={loading}
                            pattern="[0-9]{5}"
                            title="Código postal de 5 dígitos"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            País
                        </label>
                        <input
                            type="text"
                            value={pais}
                            onChange={(e) => setPais(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Entrega Propuesta
                    </label>
                    <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        min={minDate}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Sujeto a disponibilidad logística.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3 text-lg"
                >
                    {loading ? 'Procesando Pedido...' : 'Confirmar y Enviar'}
                </button>
            </form>
        </div>
    );
}
