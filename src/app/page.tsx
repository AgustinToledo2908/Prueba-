import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenido a mi proyecto Next.js 🚀
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Este es el punto de partida. Empezá a construir desde acá.
        </p>
        <Image
          src="/next.svg"
          alt="Logo de Next.js"
          width={150}
          height={35}
          priority
        />
      </main>

      <footer className="mt-12 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Tu Nombre. Todos los derechos reservados.
      </footer>
    </div>
  );
}
