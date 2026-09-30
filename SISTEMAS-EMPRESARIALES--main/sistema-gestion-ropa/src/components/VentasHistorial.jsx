import React, { useState } from "react";
import { 
  Receipt, 
  Search, 
  Filter, 
  Printer, 
  Eye, 
  Calendar, 
  CreditCard, 
  Banknote, 
  Smartphone,
  TrendingUp
} from "lucide-react";

export default function VentasHistorial({ ventas, user, onReimprimirTicket }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [medioFilter, setMedioFilter] = useState("todos");
  const [selectedVenta, setSelectedVenta] = useState(null);

  const filteredVentas = ventas.filter((v) => {
    const matchesSearch = 
      v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vendedor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMedio = 
      medioFilter === "todos" || v.medioPago === medioFilter;

    return matchesSearch && matchesMedio;
  });

  const totalRecaudado = filteredVentas.reduce((acc, v) => acc + v.total, 0);
  const totalUtilidad = filteredVentas.reduce((acc, v) => acc + (v.utilidad || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Historial y Auditoría de Ventas</h2>
          <p className="text-xs text-slate-500">
            Registro detallado de transacciones comerciales, medios de pago y reimpresión de comprobantes.
          </p>
        </div>

        {/* Resumen rápido */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Filtrado</span>
            <span className="text-sm font-bold text-slate-900">${totalRecaudado.toLocaleString("es-CO")}</span>
          </div>
          {user?.rol === "admin" && (
            <div className="px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
              <span className="text-[10px] uppercase font-bold text-indigo-500 block">Utilidad Bruta</span>
              <span className="text-sm font-bold text-indigo-700">${totalUtilidad.toLocaleString("es-CO")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por comprobante (ej: VTA-1001), cliente o vendedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={medioFilter}
            onChange={(e) => setMedioFilter(e.target.value)}
            className="w-full sm:w-44 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="todos">Todos los medios de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Comprobante</th>
                <th className="py-3.5 px-4">Fecha / Hora</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Vendedor</th>
                <th className="py-3.5 px-4">Prendas</th>
                <th className="py-3.5 px-4">Medio Pago</th>
                <th className="py-3.5 px-4">Total Venta</th>
                {user?.rol === "admin" && <th className="py-3.5 px-4">Utilidad</th>}
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVentas.length === 0 ? (
                <tr>
                  <td colSpan={user?.rol === "admin" ? "9" : "8"} className="py-8 text-center text-slate-400">
                    No se encontraron registros de ventas.
                  </td>
                </tr>
              ) : (
                filteredVentas.map((v) => {
                  const cantPrendas = v.items.reduce((sum, it) => sum + it.cantidad, 0);

                  return (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        {v.id}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{v.fecha}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {v.clienteNombre}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {v.vendedor}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {cantPrendas} {cantPrendas === 1 ? "prenda" : "prendas"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {v.medioPago === "Efectivo" && <Banknote className="w-3 h-3 text-emerald-600" />}
                          {v.medioPago === "Tarjeta" && <CreditCard className="w-3 h-3 text-indigo-600" />}
                          {v.medioPago === "Transferencia" && <Smartphone className="w-3 h-3 text-violet-600" />}
                          {v.medioPago}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ${v.total.toLocaleString("es-CO")}
                      </td>
                      {user?.rol === "admin" && (
                        <td className="py-3 px-4 font-semibold text-emerald-600">
                          +${(v.utilidad || 0).toLocaleString("es-CO")}
                        </td>
                      )}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedVenta(v)}
                            title="Ver desglose de prendas"
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onReimprimirTicket(v)}
                            title="Reimprimir Comprobante / Ticket"
                            className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle de Venta */}
      {selectedVenta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Detalle de Transacción: {selectedVenta.id}</h3>
              <button onClick={() => setSelectedVenta(null)} className="p-1 hover:bg-slate-800 rounded-lg">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-600 border-b border-slate-100 pb-3">
                <div>Cliente: <strong className="text-slate-800">{selectedVenta.clienteNombre}</strong></div>
                <div>Vendedor: <strong className="text-slate-800">{selectedVenta.vendedor}</strong></div>
                <div>Fecha: <strong className="text-slate-800">{selectedVenta.fecha}</strong></div>
                <div>Medio de pago: <strong className="text-slate-800">{selectedVenta.medioPago}</strong></div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Prendas despachadas:</h4>
                <div className="space-y-2">
                  {selectedVenta.items.map((it, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{it.nombre}</div>
                        <div className="text-[10px] text-slate-500">
                          {it.talla ? `Talla: ${it.talla}` : ""} • ${it.precioUnitario.toLocaleString("es-CO")} c/u
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-700">{it.cantidad}x</span>
                        <div className="font-bold text-indigo-600">${it.subtotal.toLocaleString("es-CO")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-sm">
                <span>Total Cobrado:</span>
                <span className="text-indigo-600">${selectedVenta.total.toLocaleString("es-CO")}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedVenta(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    const v = selectedVenta;
                    setSelectedVenta(null);
                    onReimprimirTicket(v);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Ticket
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
