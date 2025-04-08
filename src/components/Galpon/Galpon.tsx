// app/galpon/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa";

interface ProductoGalpon {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  unidad: "palet" | "caja" | "bulto";
  oferta: boolean;
  faltante: boolean;
}

const defaultGalpon: ProductoGalpon[] = [
  {
    id: 1,
    nombre: "Palets de ladrillos",
    categoria: "Construcción",
    cantidad: 15,
    unidad: "palet",
    oferta: false,
    faltante: false,
  },
  {
    id: 2,
    nombre: "Cajas de clavos",
    categoria: "Ferretería",
    cantidad: 25,
    unidad: "caja",
    oferta: true,
    faltante: false,
  },
  {
    id: 3,
    nombre: "Bultos de cemento",
    categoria: "Materiales",
    cantidad: 0,
    unidad: "bulto",
    oferta: false,
    faltante: true,
  },
];

export default function GalponPage() {
  const [productos, setProductos] = useState<ProductoGalpon[]>([]);
  const [historialCambios, setHistorialCambios] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const almacenado = localStorage.getItem("galpon-productos");
    const historial = localStorage.getItem("galpon-historial");
    if (almacenado) setProductos(JSON.parse(almacenado));
    else setProductos(defaultGalpon);

    if (historial) setHistorialCambios(JSON.parse(historial));
  }, []);

  const handleInputChange = (
    id: number,
    campo: keyof ProductoGalpon,
    valor: any
  ) => {
    setProductos((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const valorAnterior = prod[campo];

          if (campo === "cantidad") valor = Number(valor);

          if (campo === "cantidad" && valorAnterior !== valor) {
            const mensaje = `Se actualizó '${prod.nombre}' – cantidad: ${valorAnterior} → ${valor}`;
            const nuevoHistorial = [mensaje, ...historialCambios.slice(0, 4)];
            setHistorialCambios(nuevoHistorial);
            localStorage.setItem(
              "galpon-historial",
              JSON.stringify(nuevoHistorial)
            );
          }

          const actualizado = {
            ...prod,
            [campo]: valor,
            faltante:
              campo === "cantidad" && valor === 0 ? true : prod.faltante,
          };

          return actualizado;
        }
        return prod;
      })
    );
  };

  const agregarProducto = () => {
    const nuevo: ProductoGalpon = {
      id: Date.now(),
      nombre: "",
      categoria: "",
      cantidad: 0,
      unidad: "palet",
      oferta: false,
      faltante: true,
    };
    setProductos((prev) => [...prev, nuevo]);
  };

  const eliminarProducto = (id: number) => {
    if (confirm("¿Eliminar este producto del galpón?")) {
      setProductos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const guardarCambios = () => {
    localStorage.setItem("galpon-productos", JSON.stringify(productos));
    localStorage.setItem("galpon-historial", JSON.stringify(historialCambios));
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
    <div className="p-8 min-h-screen bg-stone-900 text-white">
      <h1 className="text-4xl font-bold mb-8">🏗️ Galpón Principal</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={agregarProducto}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl shadow"
        >
          <FiPlus /> Agregar producto
        </button>
        <button
          onClick={guardarCambios}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl shadow"
        >
          <FiSave /> Guardar cambios
        </button>
        <input
          type="text"
          placeholder="Buscar producto o categoría..."
          className="flex-1 bg-stone-800 text-white px-4 py-2 rounded-xl border border-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-stone-800 rounded-xl shadow mb-6">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-700 text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">Cantidad</th>
              <th className="px-4 py-3 text-left">Unidad</th>
              <th className="px-4 py-3 text-center">Oferta</th>
              <th className="px-4 py-3 text-center">Faltante</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((prod) => {
              const esFaltante = prod.faltante || prod.cantidad === 0;
              const esStockCritico = !esFaltante && prod.cantidad < 5;

              let bgColor = "";
              if (esFaltante) bgColor = "bg-red-600/20";
              else if (esStockCritico) bgColor = "bg-yellow-600/20";
              else if (prod.oferta) bgColor = "bg-amber-600/20";

              return (
                <tr
                  key={prod.id}
                  className={`border-t border-stone-700 ${bgColor} hover:bg-stone-700/50`}
                >
                  <td className="px-4 py-3">
                    <input
                      className="w-full bg-stone-700 text-white p-2 rounded border border-stone-600"
                      value={prod.nombre}
                      onChange={(e) =>
                        handleInputChange(prod.id, "nombre", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="w-full bg-stone-700 text-white p-2 rounded border border-stone-600"
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
                      className="w-full bg-stone-700 text-white p-2 rounded border border-stone-600"
                      value={prod.cantidad}
                      onChange={(e) =>
                        handleInputChange(prod.id, "cantidad", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="w-full bg-stone-700 text-white p-2 rounded border border-stone-600"
                      value={prod.unidad}
                      onChange={(e) =>
                        handleInputChange(
                          prod.id,
                          "unidad",
                          e.target.value as "palet" | "caja" | "bulto"
                        )
                      }
                    >
                      <option value="palet">Palets</option>
                      <option value="caja">Cajas</option>
                      <option value="bulto">Bultos</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="accent-amber-400 w-4 h-4"
                      checked={prod.oferta}
                      onChange={(e) =>
                        handleInputChange(prod.id, "oferta", e.target.checked)
                      }
                    />
                    {prod.oferta && (
                      <span className="text-amber-400 ml-2">
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
                      className="text-red-500 hover:text-red-600"
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
        <div className="bg-stone-800 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">
            📋 Historial de cambios
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-400">
            {historialCambios.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        </div>
      )}

      {toastVisible && (
        <div className="fixed bottom-4 right-4 bg-amber-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 z-50">
          <HiOutlineCheckCircle size={20} />
          Cambios guardados
        </div>
      )}
    </div>
  );
}
