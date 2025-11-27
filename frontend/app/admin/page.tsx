'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/formatPrice';

interface DashboardStats {
    totalProducts: number;
    pendingOrders: number;
    totalSales: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        pendingOrders: 0,
        totalSales: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch products
                const productsRes = await api.get('/catalog');
                const products = Array.isArray(productsRes.data) ? productsRes.data : [];

                // Fetch orders
                const ordersRes = await api.get('/transactional');
                const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];

                // Calculate stats
                const pendingOrders = orders.filter((order: any) =>
                    order.estado === 'PENDIENTE' || order.estado === 'EN_PROCESO'
                ).length;

                const totalSales = orders.reduce((sum: number, order: any) =>
                    sum + parseFloat(order.total || 0), 0
                );

                setStats({
                    totalProducts: products.length,
                    pendingOrders,
                    totalSales
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-500">Total Ventas</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(stats.totalSales)}</p>
                    <span className="text-sm text-green-500 mt-2 inline-block">+0% vs mes anterior</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-500">Pedidos Pendientes</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
                    <span className="text-sm text-yellow-500 mt-2 inline-block">
                        {stats.pendingOrders > 0 ? 'Requieren atención' : 'Todo al día'}
                    </span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-500">Productos Activos</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                    <span className="text-sm text-gray-400 mt-2 inline-block">En catálogo</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
                <div className="text-gray-500 text-center py-8">
                    No hay actividad reciente para mostrar.
                </div>
            </div>
        </div>
    );
}
