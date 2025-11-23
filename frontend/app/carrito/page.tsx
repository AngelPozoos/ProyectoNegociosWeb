'use client';

import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
    const router = useRouter();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-primary mb-4">Carrito de Compras</h1>
                <p className="text-gray-600 mb-8">Tu carrito está vacío</p>
                <Link href="/catalogo" className="btn btn-primary">
                    Ir al Catálogo
                </Link>
            </div>
        );
    }

    const handleCheckout = () => {
        router.push('/checkout');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-primary mb-8">Carrito de Compras</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border flex gap-4">
                            {/* Product Image */}
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-xs">Sin Imagen</span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-primary mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">SKU: {item.sku}</p>
                                <p className="text-accent font-semibold">${item.price.toFixed(2)}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Eliminar
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="text-lg font-bold text-primary">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Productos ({getTotalItems()})</span>
                                <span>${getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Envío</span>
                                <span>Calculado en checkout</span>
                            </div>
                        </div>

                        <div className="border-t pt-4 mb-6">
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="text-accent">${getTotalPrice().toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="btn btn-primary w-full py-3 text-lg mb-3"
                        >
                            Proceder al Checkout
                        </button>

                        <Link
                            href="/catalogo"
                            className="btn btn-secondary w-full py-3 text-center block"
                        >
                            Continuar Comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
