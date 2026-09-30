import React from "react";
import { Printer, X, CheckCircle, ShoppingBag } from "lucide-react";
import { formatearFecha } from "../utils/fechas";

export default function TicketModal({ venta, onClose }) {
  if (!venta) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header no imprimible */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Venta Completada Exitosamente</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del Ticket (Optimizado para pantalla y para impresión térmica) */}
        <div id="ticket-print" className="p-6 bg-white text-slate-800 text-sm font-mono print:p-0">
          
          <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-xl mb-2 print:hidden">
              <ShoppingBag className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">MODA & ESTILO BOUTIQUE</h2>
            <p className="text-xs text-slate-500">NIT: 901.458.789-2</p>
            <p className="text-xs text-slate-500">Calle Comercial #45 - 20, Medellín</p>
            <p className="text-xs text-slate-500">Tel: (604) 444-9870 | Cel: 310 456 7890</p>
            <p className="text-xs text-slate-500 mt-1">Sistemas Empresariales UPB</p>
          </div>

          <div className="space-y-1 text-xs border-b border-dashed border-slate-300 pb-3 mb-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Comprobante No:</span>
              <span className="font-bold text-slate-900">{venta.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha / Hora:</span>
              <span>{formatearFecha(venta.fecha)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Atendido por:</span>
              <span>{venta.vendedor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cliente:</span>
              <span className="font-semibold text-slate-800">{venta.clienteNombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Medio de Pago:</span>
              <span className="font-semibold px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">{venta.medioPago}</span>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="border-b border-dashed border-slate-300 pb-3 mb-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 pb-1">
                  <th className="text-left py-1 font-medium">Cant.</th>
                  <th className="text-left py-1 font-medium">Prenda / Talla</th>
                  <th className="text-right py-1 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {venta.items.map((item, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="py-1.5 font-bold text-slate-700">{item.cantidad}x</td>
                    <td className="py-1.5 pr-2">
                      <div className="font-medium text-slate-900">{item.nombre}</div>
                      <div className="text-[10px] text-slate-500">
                        {item.talla ? `Talla: ${item.talla}` : ""} {item.color ? `| Color: ${item.color}` : ""}
                      </div>
                    </td>
                    <td className="py-1.5 text-right font-semibold text-slate-800">
                      ${item.subtotal.toLocaleString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-base font-bold text-slate-900 pt-1">
              <span>TOTAL PAGADO:</span>
              <span className="text-indigo-600">${venta.total.toLocaleString("es-CO")}</span>
            </div>
          </div>

          {/* Pie del recibo */}
          <div className="text-center text-[11px] text-slate-500 mt-6 pt-3 border-t border-dashed border-slate-300">
            <p className="font-medium text-slate-700">¡Gracias por su compra en nuestra boutique!</p>
            <p className="mt-1 text-[10px]">Cambios dentro de los 30 días calendario presentando este tiquete y etiqueta original.</p>
            <p className="mt-1 text-[9px] text-slate-400">Software desarrollado para Sistemas Empresariales UPB 2026</p>
          </div>

        </div>

        {/* Acciones inferiores */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Comprobante
          </button>
        </div>

      </div>
    </div>
  );
}
