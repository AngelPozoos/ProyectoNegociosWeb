import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-primary mb-6 tracking-tight">
          E-Business Platform
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Solución integral para la gestión operativa y comercial.
          Automatiza procesos, gestiona inventarios y conecta con tus clientes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/catalogo" className="btn btn-primary py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
            Explorar Catálogo
          </Link>

        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <span className="block font-bold text-primary mb-1">Catálogo</span>
            Dinámico
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm">
            <span className="block font-bold text-primary mb-1">Pagos</span>
            Seguros
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <span className="block font-bold text-primary mb-1">Logística</span>
            Integrada
          </div>
        </div>
      </div>
    </div>
  );
}
