
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Product {
    id: string;
    nombre: string;
    descripcion: string;
    precio: string;
    imagenes: string | string[];
}

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/catalog')
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch products', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-primary">Catálogo de Productos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                    const imageList = typeof product.imagenes === 'string'
                        ? product.imagenes.split(',')
                        : (Array.isArray(product.imagenes) ? product.imagenes : []);

                    return (
                        <Link href={`/catalogo/${product.id}`} key={product.id} className="group">
                            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                                <div className="aspect-video bg-gray-200 relative">
                                    {/* Placeholder for image if none exists */}
                                    {imageList.length > 0 ? (
                                        <img src={imageList[0]} alt={product.nombre} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">Sin Imagen</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">{product.nombre}</h2>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{product.descripcion}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-primary">${Number(product.precio).toFixed(2)}</span>
                                        <span className="text-sm text-accent font-medium">Ver Detalles &rarr;</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
