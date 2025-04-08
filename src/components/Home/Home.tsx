import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-8 bg-[#f8f8f8]">
      <h1 className="text-3xl font-bold text-gray-800">Espacios disponibles</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Tarjeta Depósito */}
        <Link href="/Deposito">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white hover:scale-[1.02] transition-transform cursor-pointer">
            <Image
              src="/fikri-rasyid-ezeC8-clZSs-unsplash.jpg"
              alt="Imagen del depósito"
              width={800}
              height={500}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Depósito General
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Espacio principal para almacenar mercadería.
              </p>
            </div>
          </div>
        </Link>

        {/* Tarjeta Galpón */}
        <Link href="/Galpon">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white hover:scale-[1.02] transition-transform cursor-pointer">
            <Image
              src="/arum-visuals-tyTU_lc0RSk-unsplash.jpg"
              alt="Imagen del galpón"
              width={800}
              height={500}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">Galpón</h2>
              <p className="text-sm text-gray-600 mt-1">
                Espacio auxiliar con gran cantidad de stock.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
