'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CreditCard, Calendar } from 'lucide-react';
import api from '@/lib/api';
import { useNotification } from '@/app/context/NotificationContext';
import { formatPrice } from '@/lib/formatPrice';

interface Product {
    id: string;
    nombre: string;
    precio: string;
    imagenes: string;
}

interface OrderItem {
    id: string;
    cantidad: number;
    precio: string;
    producto: Product;
}

interface ShippingAddress {
    calle: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
    pais: string;
    metodoPago: string;
    nombreTitular?: string;
}

interface Shipment {
    numeroSeguimiento: string;
    estado: string;
    fechaEstimadaEntrega: string;
}

interface OrderDetails {
    id: string;
    total: string;
    estado: string;
    createdAt: string;
    items: OrderItem[];
    direccionEnvio?: ShippingAddress;
    envio?: Shipment;
}

export default function OrderDetailsPage() {
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;
    const { showNotification, showConfirm } = useNotification();

    useEffect(() => {
        if (orderId) {
            api.get(`/transactional/${orderId}`)
                .then((res) => {
                    setOrder(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Failed to fetch order details', err);
                    setLoading(false);
                });
        }
    }, [orderId]);

    const handleCancelOrder = async () => {
        const confirmed = await showConfirm({
            title: '¿Estás seguro de que deseas cancelar este pedido?',
            confirmText: 'Aceptar',
            cancelText: 'Cancelar',
        });

        if (!confirmed) {
            return;
        }

        setCancelling(true);
        try {
            const res = await api.patch(`/transactional/${orderId}/cancel`);
            setOrder(res.data);
            showNotification({
                type: 'success',
                title: 'Pedido cancelado exitosamente',
            });
        } catch (err) {
            console.error('Failed to cancel order', err);
            showNotification({
                type: 'error',
                title: 'Error al cancelar el pedido',
            });
        } finally {
            setCancelling(false);
        }
    };

    const getPaymentMethodLabel = (method: string) => {
        const labels: { [key: string]: string } = {
            'TARJETA_CREDITO': 'Tarjeta de Crédito',
            'TARJETA_DEBITO': 'Tarjeta de Débito',
            'PAYPAL': 'PayPal',
        };
        return labels[method] || method;
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'PENDIENTE': 'text-yellow-600 bg-yellow-50',
            'PAGADO': 'text-green-600 bg-green-50',
            'ENVIADO': 'text-blue-600 bg-blue-50',
            'ENTREGADO': 'text-green-700 bg-green-100',
            'CANCELADO': 'text-red-600 bg-red-50',
        };
        return colors[status] || 'text-gray-600 bg-gray-50';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Pedido no encontrado</h1>
                <button onClick={() => router.push('/mis-pedidos')} className="btn btn-primary">
                    Volver a Mis Pedidos
                </button>
            </div>
        );
    }

    const canCancelOrder = order.estado !== 'CANCELADO' && order.estado !== 'ENTREGADO';

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => router.push('/mis-pedidos')}
                    className="text-accent hover:text-accent-dark mb-4 flex items-center gap-2"
                >
                    ← Volver a Mis Pedidos
                </button>
                <h1 className="text-3xl font-bold text-primary">Detalles del Pedido</h1>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <span className="text-sm text-gray-500 block">Número de Pedido</span>
                        <span className="font-semibold">#{order.id.slice(0, 8)}</span>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500 block">Fecha</span>
                        <span className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500 block">Total</span>
                        <span className="font-semibold text-xl">{formatPrice(order.total)}</span>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500 block">Estado</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.estado)}`}>
                            {order.estado}
                        </span>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-primary">Artículos del Pedido</h2>
                <div className="space-y-4">
                    {order.items.map((item) => {
                        const images = item.producto.imagenes.split(',');
                        const imageUrl = images[0] || '/placeholder.png';

                        return (
                            <div key={item.id} className="flex gap-4 border-b pb-4 last:border-b-0">
                                <img
                                    src={imageUrl}
                                    alt={item.producto.nombre}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{item.producto.nombre}</h3>
                                    <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                                    <p className="text-sm text-gray-600">Precio unitario: {formatPrice(item.precio)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-lg">{formatPrice(Number(item.precio) * item.cantidad)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Payment and Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Payment Method */}
                {order.direccionEnvio && (
                    <div className="bg-white rounded-lg shadow-md border p-6">
                        <h2 className="text-xl font-bold mb-4 text-primary">Método de Pago</h2>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">{getPaymentMethodLabel(order.direccionEnvio.metodoPago)}</p>
                                {order.direccionEnvio.nombreTitular && (
                                    <p className="text-sm text-gray-600">Titular: {order.direccionEnvio.nombreTitular}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Shipping Date */}
                {order.envio?.fechaEstimadaEntrega && (
                    <div className="bg-white rounded-lg shadow-md border p-6">
                        <h2 className="text-xl font-bold mb-4 text-primary">Fecha de Envío Programada</h2>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">
                                    {new Date(order.envio.fechaEstimadaEntrega).toLocaleDateString('es-MX', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                {order.envio.numeroSeguimiento && (
                                    <p className="text-sm text-gray-600">
                                        Rastreo: {order.envio.numeroSeguimiento}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Shipping Address */}
            {order.direccionEnvio && (
                <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 text-primary">Dirección de Envío</h2>
                    <div className="space-y-1">
                        <p className="text-gray-700">{order.direccionEnvio.calle}</p>
                        <p className="text-gray-700">
                            {order.direccionEnvio.ciudad}, {order.direccionEnvio.estado} {order.direccionEnvio.codigoPostal}
                        </p>
                        <p className="text-gray-700">{order.direccionEnvio.pais}</p>
                    </div>
                </div>
            )}

            {/* Cancel Button */}
            {canCancelOrder && (
                <div className="bg-white rounded-lg shadow-md border p-6">
                    <h2 className="text-xl font-bold mb-4 text-primary">Acciones</h2>
                    <button
                        onClick={handleCancelOrder}
                        disabled={cancelling}
                        className="btn bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelling ? 'Cancelando...' : 'Cancelar Envío'}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                        Al cancelar el envío, el pedido será marcado como cancelado y no se procesará.
                    </p>
                </div>
            )}
        </div>
    );
}
