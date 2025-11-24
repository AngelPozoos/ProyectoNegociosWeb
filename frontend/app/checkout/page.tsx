'use client';

import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/formatPrice';

export default function CartPage() {
    const { cart, removeFromCart, getTotalPrice } = useCart();
    const router = useRouter();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-primary mb-4">Tu Carrito</h1>
                <p className="text-gray-600 mb-8">Tu carrito está vacío</p>
                <Link href="/catalogo" className="btn btn-primary">
                    Ir al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-primary">Tu Carrito</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="p-6 space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        {item.image && (
                                            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                            <p className="text-gray-500 text-sm">Cantidad: {item.quantity}</p>
                                            <p className="font-medium text-primary">{formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium mt-4 sm:mt-0 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                        </div>
                        <div className="border-t my-4 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                        </div>
                        <button
                            onClick={() => router.push('/checkout/payment')}
                            className="w-full btn btn-primary py-3 text-center block mt-6"
                        >
                            Proceder al pago
                        </button>
                        <Link href="/catalogo" className="block text-center text-primary mt-4 hover:underline text-sm">
                            Continuar comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
