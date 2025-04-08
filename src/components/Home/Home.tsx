import Image from "next/image";
import Link from "next/link";
import { Warehouse } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('/fondohome.jpg')] bg-cover bg-center bg-no-repeat relative">
      {/* Capa opaca encima del fondo */}
      <div className="absolute inset-0 bg-whit/40 backdrop-blur-sm" />

      {/* Contenido */}
      <div className="relative z-10 p-8 flex flex-col items-center gap-10 text-white">
        {/* Título con ícono */}
        <div className="flex items-center gap-3">
          <Warehouse className="w-8 h-8 text-[#DA8359]" />
          <h1 className="text-4xl font-bold">Espacios disponibles</h1>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full max-w-5xl">
          {/* Tarjeta Depósito */}
          <Link
            href="/Deposito"
            className="hover:scale-[1.02] transition-transform"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer">
              <Image
                src="/fikri-rasyid-ezeC8-clZSs-unsplash.jpg"
                alt="Imagen del depósito"
                width={800}
                height={500}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-black">
                  Depósito General
                </h2>
                <p className="text-base text-gray-600 mt-2">
                  Espacio principal para almacenar mercadería.
                </p>
              </div>
            </div>
          </Link>

          {/* Tarjeta Galpón */}
          <Link
            href="/Galpon"
            className="hover:scale-[1.02] transition-transform"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer">
              <Image
                src="/arum-visuals-tyTU_lc0RSk-unsplash.jpg"
                alt="Imagen del galpón"
                width={800}
                height={500}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-black">Galpón</h2>
                <p className="text-base text-gray-600 mt-2">
                  Espacio auxiliar con gran cantidad de stock.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
