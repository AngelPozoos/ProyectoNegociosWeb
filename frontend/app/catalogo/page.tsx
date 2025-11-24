
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';

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
    const [searchTerm, setSearchTerm] = useState('');

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

    // Filtrar productos basado en el término de búsqueda
    const filteredProducts = products.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-8 max-w-7xl">
            {/* Header con título y barra de búsqueda */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                <h1 className="text-3xl font-bold text-primary">Catálogo de Productos</h1>
                <div className="relative md:w-96">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                    const imageList = typeof product.imagenes === 'string'
                        ? product.imagenes.split(',')
                        : (Array.isArray(product.imagenes) ? product.imagenes : []);

                    return (
                        <Link href={`/catalogo/${product.id}`} key={product.id} className="group">
                            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                                <div className="aspect-video bg-gray-200 relative">
                                    {/* Placeholder for image if none exists */}
                                    {imageList.length > 0 ? (
                                        <img src={imageList[0]} alt={product.nombre} className="object-contain w-full h-full" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">Sin Imagen</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">{product.nombre}</h2>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{product.descripcion}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-primary">{formatPrice(product.precio)}</span>
                                        <span className="text-sm text-accent font-medium">Ver Detalles &rarr;</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Mensaje cuando no hay resultados */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
}
