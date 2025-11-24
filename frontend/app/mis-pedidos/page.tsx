'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatPrice } from '@/lib/formatPrice';

interface Order {
    id: string;
    total: string;
    estado: string;
    createdAt: string;
    items: any[];
    envio?: {
        numeroSeguimiento: string;
        estado: string;
        fechaEstimadaEntrega: string;
    };
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        api.get('/transactional')
            .then((res) => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch orders', err);
                setLoading(false);
            });
    }, []);

    const handleViewDetails = (orderId: string) => {
        router.push(`/mis-pedidos/${orderId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-10 text-primary">Mis Pedidos</h1>

            {orders.length === 0 ? (
                <div className="text-center text-gray-500 py-12">No tienes pedidos aún.</div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-primary px-6 py-4 border-b flex justify-between items-center">
                                <div>
                                    <span className="text-sm text-white/80 block">Pedido Realizado</span>
                                    <span className="font-medium text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-white/80 block">Total</span>
                                    <span className="font-medium text-white">{formatPrice(order.total)}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-white/80 block">Pedido #</span>
                                    <span className="font-medium text-white">{order.id.slice(0, 8)}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold mb-2">Estado: <span className="text-accent">{order.estado}</span></h3>
                                        {/* Items list would go here */}
                                        <p className="text-sm text-gray-600">{order.items?.length || 0} artículos</p>
                                    </div>

                                    <div className="text-right">
                                        {order.envio ? (
                                            <div className="bg-blue-50 p-3 rounded text-sm">
                                                <p className="font-bold text-blue-800">Envío: {order.envio.estado}</p>
                                                <p>Tracking: {order.envio.numeroSeguimiento}</p>
                                                <p>Entrega Est.: {new Date(order.envio.fechaEstimadaEntrega).toLocaleDateString()}</p>
                                            </div>
                                        ) : null}
                                        <button
                                            className="btn btn-primary text-sm mt-2"
                                            onClick={() => handleViewDetails(order.id)}
                                        >
                                            Ver Detalles
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
