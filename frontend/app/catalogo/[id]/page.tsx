'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { Minus, Plus, ShoppingCart, ArrowRight, X } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';

interface Product {
    id: string;
    nombre: string;
    descripcion: string;
    precio: string;
    imagenes: string | string[];
    stock: number;
    categoria: string;
    sku: string;
}

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (id) {
            api.get(`/catalog/${id}`)
                .then((res) => {
                    setProduct(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Failed to fetch product', err);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => {
            const newQuantity = prev + delta;
            if (newQuantity < 1) return 1;
            if (product && newQuantity > product.stock) return product.stock;
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            id: product.id,
            name: product.nombre,
            price: Number(product.precio),
            sku: product.sku,
            image: typeof product.imagenes === 'string'
                ? product.imagenes.split(',')[0]
                : (Array.isArray(product.imagenes) ? product.imagenes[0] : undefined),
        }, quantity);

        setShowModal(true);
    };

    const handleGoToCart = () => {
        setShowModal(false);
        router.push('/checkout');
    };

    const handleContinueShopping = () => {
        setShowModal(false);
        setQuantity(1);
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return <div className="text-center py-12">Producto no encontrado</div>;
    }

    const imageList = typeof product.imagenes === 'string'
        ? product.imagenes.split(',')
        : (Array.isArray(product.imagenes) ? product.imagenes : []);

    return (
        <>
            <div className="container mx-auto px-8 md:px-16 lg:px-32 py-8">
                <Link href="/catalogo" className="text-gray-500 hover:text-primary mb-4 inline-block">&larr; Volver al Catálogo</Link>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-100 rounded-lg flex items-center justify-center max-w-lg mx-auto h-[500px] w-full">
                        {imageList.length > 0 ? (
                            <img src={imageList[0]} alt={product.nombre} className="object-contain w-full h-full rounded-lg p-6" />
                        ) : (
                            <span className="text-gray-400 text-xl">Sin Imagen</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-primary mb-4">{product.nombre}</h1>
                        <p className="text-xl text-accent font-semibold mb-4">{formatPrice(product.precio)}</p>
                        <p className="text-gray-600 mb-6 leading-relaxed">{product.descripcion}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-500">
                            <div>SKU: {product.sku}</div>
                            <div>Stock: {product.stock}</div>
                            <div>Categoría: {product.categoria}</div>
                        </div>

                        {/* Selector de Cantidad */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cantidad
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <div className="px-6 py-3 font-semibold text-lg min-w-[60px] text-center">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {product.stock} disponibles
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Añadir al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleContinueShopping}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scaleIn">
                        {/* Close Button */}
                        <button
                            onClick={handleContinueShopping}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 text-green-600" />
                            </div>
                        </div>

                        {/* Text */}
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                            ¡Producto añadido!
                        </h2>
                        <p className="text-center text-gray-600 mb-8">
                            {quantity} {quantity === 1 ? 'unidad' : 'unidades'} de <span className="font-semibold">{product.nombre}</span> {quantity === 1 ? 'ha sido añadida' : 'han sido añadidas'} a tu carrito
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleGoToCart}
                                className="w-full bg-slate-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                Ir al Carrito
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleContinueShopping}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-all"
                            >
                                Seguir Comprando
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
