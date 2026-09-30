import React from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ShoppingBag, 
  ArrowUpRight, 
  PlusCircle, 
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function Dashboard({ kpiData, onNavigateToPOS, onNavigateToInventario }) {
  const {
    totalProductos,
    valorInventario,
    costoInventario,
    stockBajoCount,
    stockBajoList,
    totalVentasValor,
    totalUtilidad,
    prendasVendidas,
    totalTransacciones,
    topProductos
  } = kpiData;

  const margenPorcentual = totalVentasValor > 0 
    ? Math.round((totalUtilidad / totalVentasValor) * 100) 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold mb-2 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Panel Ejecutivo — Boutique de Moda
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Rendimiento Comercial en Tiempo Real</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Control centralizado de ingresos, rotación de colecciones textiles y alertas automáticas de reposición de existencias.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToPOS}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-102"
          >
            <ShoppingBag className="w-4 h-4" />
            Abrir Punto de Venta
          </button>
          <button
            onClick={onNavigateToInventario}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4" />
            Ver Inventario
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Ingresos Totales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ingresos Totales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              ${totalVentasValor.toLocaleString("es-CO")}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{totalTransacciones} ventas completadas</span>
            </div>
          </div>
        </div>

        {/* Card 2: Utilidad Bruta */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Utilidad Bruta</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              ${totalUtilidad.toLocaleString("es-CO")}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-600 font-medium">
              <span>Margen comercial est.: {margenPorcentual}%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Prendas Despachadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Prendas Vendidas</span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {prendasVendidas} unidades
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Catálogo actual: {totalProductos} referencias
            </div>
          </div>
        </div>

        {/* Card 4: Alerta de Stock Crítico */}
        <div className={`p-5 rounded-2xl border shadow-xs transition-shadow ${
          stockBajoCount > 0 
            ? "bg-rose-50/70 border-rose-200 text-rose-950" 
            : "bg-white border-slate-200/80"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stock Crítico</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              stockBajoCount > 0 ? "bg-rose-500 text-white" : "bg-emerald-50 text-emerald-600"
            }`}>
              {stockBajoCount > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold ${stockBajoCount > 0 ? "text-rose-600" : "text-slate-900"}`}>
              {stockBajoCount} {stockBajoCount === 1 ? "prenda" : "prendas"}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {stockBajoCount > 0 ? "Por debajo del stock mínimo" : "Inventario en niveles óptimos"}
            </div>
          </div>
        </div>

      </div>

      {/* Grid Central: Top Prendas & Valoración de Inventario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna 1 y 2: Top Artículos Vendidos & Comparativa */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Prendas con Mayor Nivel de Ventas</h3>
              <p className="text-xs text-slate-500">Artículos con mejor rotación en el mostrador de la tienda</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              Ranking Dinámico
            </span>
          </div>

          <div className="space-y-4">
            {topProductos.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No hay registros de ventas suficientes aún.</p>
            ) : (
              topProductos.map((prod, index) => {
                const maxUnidades = topProductos[0]?.unidades || 1;
                const porcentaje = Math.round((prod.unidades / maxUnidades) * 100);

                return (
                  <div key={prod.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                          #{index + 1}
                        </span>
                        <span>{prod.nombre}</span>
                      </div>
                      <div className="font-semibold text-slate-900">
                        {prod.unidades} uds. <span className="text-slate-400 font-normal">(${prod.recaudado.toLocaleString("es-CO")})</span>
                      </div>
                    </div>
                    {/* Barra de progreso */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Comparación Financiera Inventario */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-[11px] font-medium text-slate-500 uppercase">Costo Invertido en Stock</span>
              <div className="text-lg font-bold text-slate-800 mt-1">
                ${costoInventario.toLocaleString("es-CO")}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Capital inmovilizado en bodega</p>
            </div>
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
              <span className="text-[11px] font-medium text-indigo-600 uppercase">Valoración Comercial (PVP)</span>
              <div className="text-lg font-bold text-indigo-900 mt-1">
                ${valorInventario.toLocaleString("es-CO")}
              </div>
              <p className="text-[11px] text-indigo-600/70 mt-0.5">Ingreso bruto potencial al liquidar</p>
            </div>
          </div>

        </div>

        {/* Columna 3: Alertas de Stock Bajo */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Alerta de Reposición</h3>
            </div>
            <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {stockBajoCount} pendientes
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Prendas con existencias críticas que requieren pedido urgente a distribuidores para evitar desabastecimiento:
          </p>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[340px] pr-1">
            {stockBajoList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
                <p className="text-xs font-medium">Todo el stock está por encima de los límites mínimos.</p>
              </div>
            ) : (
              stockBajoList.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 hover:border-amber-300 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.nombre}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                      <span>Talla: <strong>{item.talla}</strong></span>
                      <span>•</span>
                      <span>Color: <strong>{item.color}</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded text-xs">
                      {item.stock} disp.
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">mín. {item.stockMinimo}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={onNavigateToInventario}
            className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Gestionar Stock en Inventario
          </button>
        </div>

      </div>

    </div>
  );
}
