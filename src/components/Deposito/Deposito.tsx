"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiSave, FiTrash2 } from "react-icons/fi";

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

  useEffect(() => {
    const almacenado = localStorage.getItem("deposito-productos");
    if (almacenado) {
      setProductos(JSON.parse(almacenado));
    } else {
      setProductos(defaultProductos);
    }
  }, []);

  const handleInputChange = (
    id: number,
    campo: keyof Producto,
    valor: string | number | boolean
  ) => {
    const actualizado = productos.map((prod) =>
      prod.id === id
        ? {
            ...prod,
            [campo]: campo === "cantidad" ? Number(valor) : valor,
          }
        : prod
    );
    setProductos(actualizado);
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
    const confirmado = confirm("¿Estás seguro de eliminar este producto?");
    if (confirmado) {
      setProductos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const guardarCambios = () => {
    localStorage.setItem("deposito-productos", JSON.stringify(productos));
    alert("✅ Cambios guardados");
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        📦 Depósito General
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={agregarProducto}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md transition"
        >
          <FiPlus size={18} />
          Agregar producto
        </button>
        <button
          onClick={guardarCambios}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition"
        >
          <FiSave size={18} />
          Guardar cambios
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-700">
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
            {productos.map((prod) => {
              const esFaltanteVisual = prod.faltante || prod.cantidad === 0;

              let rowColor = "";
              if (esFaltanteVisual) rowColor = "bg-red-100";
              else if (prod.oferta) rowColor = "bg-yellow-100";

              return (
                <tr
                  key={prod.id}
                  className={`border-t hover:bg-gray-50 transition ${rowColor}`}
                >
                  <td className="px-4 py-2">
                    <input
                      className="w-full p-2 border border-gray-300 rounded"
                      value={prod.nombre}
                      onChange={(e) =>
                        handleInputChange(prod.id, "nombre", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      className="w-full p-2 border border-gray-300 rounded"
                      value={prod.categoria}
                      onChange={(e) =>
                        handleInputChange(prod.id, "categoria", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={prod.cantidad.toString()}
                      min={0}
                      onChange={(e) =>
                        handleInputChange(prod.id, "cantidad", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={prod.oferta}
                      onChange={(e) =>
                        handleInputChange(prod.id, "oferta", e.target.checked)
                      }
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={prod.faltante}
                      onChange={(e) =>
                        handleInputChange(prod.id, "faltante", e.target.checked)
                      }
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => eliminarProducto(prod.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Eliminar producto"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
