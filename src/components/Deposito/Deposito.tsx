"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  oferta: boolean;
  faltante: boolean;
}

const defaultProductos: Producto[] = [
  {
    id: 1,
    nombre: "Cajas de tornillos",
    categoria: "Ferretería",
    cantidad: 120,
    oferta: false,
    faltante: false,
  },
  {
    id: 2,
    nombre: "Palets madera",
    categoria: "Transporte",
    cantidad: 35,
    oferta: true,
    faltante: false,
  },
  {
    id: 3,
    nombre: "Bidones químicos",
    categoria: "Industria",
    cantidad: 0,
    oferta: false,
    faltante: true,
  },
];

export default function DepositoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [historialCambios, setHistorialCambios] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const almacenado = localStorage.getItem("deposito-productos");
    const historial = localStorage.getItem("deposito-historial");
    if (almacenado) {
      setProductos(JSON.parse(almacenado));
    } else {
      setProductos(defaultProductos);
    }
    if (historial) {
      setHistorialCambios(JSON.parse(historial));
    }
  }, []);

  const handleInputChange = (
    id: number,
    campo: keyof Producto,
    valor: string | number | boolean
  ) => {
    setProductos((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const valorAnterior = prod[campo];
          let valorNuevo: any = valor;

          if (campo === "cantidad") {
            valorNuevo = Number(valor);
          }

          if (valorAnterior !== valorNuevo) {
            if (campo === "cantidad" && typeof valorAnterior === "number") {
              const mensaje = `Se actualizó '${prod.nombre}' – cantidad: ${valorAnterior} → ${valorNuevo}`;
              const nuevoHistorial = [mensaje, ...historialCambios.slice(0, 4)];
              setHistorialCambios(nuevoHistorial);
              localStorage.setItem(
                "deposito-historial",
                JSON.stringify(nuevoHistorial)
              );
            }
          }

          const productoActualizado = {
            ...prod,
            [campo]: valorNuevo,
          };

          if (campo === "cantidad") {
            productoActualizado.faltante = valorNuevo === 0;
          }

          return productoActualizado;
        }
        return prod;
      })
    );
  };

  const agregarProducto = () => {
    const nuevo: Producto = {
      id: Date.now(),
      nombre: "",
      categoria: "",
      cantidad: 0,
      oferta: false,
      faltante: true,
    };
    setProductos((prev) => [...prev, nuevo]);
  };

  const eliminarProducto = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProductos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const guardarCambios = () => {
    localStorage.setItem("deposito-productos", JSON.stringify(productos));
    localStorage.setItem(
      "deposito-historial",
      JSON.stringify(historialCambios)
    );
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const productosFiltrados = productos.filter((prod) => {
    const termino = busqueda.toLowerCase();
    return (
      prod.nombre.toLowerCase().includes(termino) ||
      prod.categoria.toLowerCase().includes(termino)
    );
  });

  return (
    <div className="p-8 min-h-screen bg-neutral-900 text-white">
      <h1 className="text-4xl font-bold mb-8">📦 Depósito General</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={agregarProducto}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <FiPlus />
          Agregar producto
        </button>
        <button
          onClick={guardarCambios}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <FiSave />
          Guardar cambios
        </button>
        <input
          type="text"
          placeholder="Buscar producto o categoría..."
          className="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-xl border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-neutral-800 rounded-xl shadow-md mb-6">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-700 text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">Cantidad</th>
              <th className="px-4 py-3 text-center">Oferta</th>
              <th className="px-4 py-3 text-center">Faltante</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((prod) => {
              const esFaltante = prod.faltante || prod.cantidad === 0;
              const esStockCritico =
                !esFaltante && prod.cantidad > 0 && prod.cantidad < 10;

              let bgColor = "";
              if (esFaltante) bgColor = "bg-red-600/20";
              else if (esStockCritico) bgColor = "bg-yellow-600/20";
              else if (prod.oferta) bgColor = "bg-emerald-600/20";

              return (
                <tr
                  key={prod.id}
                  className={`border-t border-neutral-700 ${bgColor} hover:bg-neutral-700/50`}
                >
                  <td className="px-4 py-3">
                    <input
                      className="w-full bg-neutral-700 text-white p-2 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={prod.nombre}
                      onChange={(e) =>
                        handleInputChange(prod.id, "nombre", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="w-full bg-neutral-700 text-white p-2 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={prod.categoria}
                      onChange={(e) =>
                        handleInputChange(prod.id, "categoria", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      className="w-full bg-neutral-700 text-white p-2 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={prod.cantidad}
                      onChange={(e) =>
                        handleInputChange(prod.id, "cantidad", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="accent-green-500 w-4 h-4"
                      checked={prod.oferta}
                      onChange={(e) =>
                        handleInputChange(prod.id, "oferta", e.target.checked)
                      }
                    />
                    {prod.oferta && (
                      <span className="text-green-400 ml-2 inline-block align-middle">
                        <FaCheckCircle size={16} />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="accent-red-500 w-4 h-4"
                      checked={prod.faltante}
                      disabled={prod.cantidad === 0}
                      onChange={(e) =>
                        handleInputChange(prod.id, "faltante", e.target.checked)
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => eliminarProducto(prod.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {historialCambios.length > 0 && (
        <div className="bg-neutral-800 p-4 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">
            🔁 Historial de cambios
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-400">
            {historialCambios.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        </div>
      )}

      {toastVisible && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-fade-in-out z-50">
          <HiOutlineCheckCircle size={20} />
          Cambios guardados exitosamente
        </div>
      )}
    </div>
  );
}
