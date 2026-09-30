import React, { useState } from "react";
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  AlertCircle,
  User,
  ShoppingBag
} from "lucide-react";
import { registrarVenta } from "../services/storageService";

export default function POS({ 
  productos, 
  clientes, 
  user, 
  onVentaCompletada 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("todas");
  const [cart, setCart] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [medioPago, setMedioPago] = useState("Efectivo"); // "Efectivo" | "Tarjeta" | "Transferencia"
  const [efectivoRecibido, setEfectivoRecibido] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  // Obtener categorías únicas presentes en los productos
  const categorias = ["todas", ...new Set(productos.map(p => p.categoria))];

  // Filtrar catálogo
  const filteredProducts = productos.filter((p) => {
    const matchesSearch = 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.talla.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.color.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCat === "todas" || p.categoria === selectedCat;
    return matchesSearch && matchesCat;
  });

  // Carrito: agregar producto
  const addToCart = (product) => {
    setErrorMsg(null);
    if (product.stock <= 0) {
      setErrorMsg(`No hay existencias disponibles de: ${product.nombre}`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productoId === product.id);
      if (existing) {
        if (existing.cantidad >= product.stock) {
          setErrorMsg(`Máximo stock disponible alcanzado para: ${product.nombre}`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.productoId === product.id
            ? { 
                ...item, 
                cantidad: item.cantidad + 1, 
                subtotal: (item.cantidad + 1) * item.precioUnitario 
              }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productoId: product.id,
            nombre: product.nombre,
            codigo: product.codigo,
            talla: product.talla,
            color: product.color,
            precioUnitario: product.precioVenta,
            cantidad: 1,
            subtotal: product.precioVenta,
            maxStock: product.stock
          }
        ];
      }
    });
  };

  // Modificar cantidad en carrito
  const updateQuantity = (productoId, delta) => {
    setErrorMsg(null);
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.productoId === productoId) {
            const newCant = item.cantidad + delta;
            if (newCant > item.maxStock) {
              setErrorMsg(`Solo quedan ${item.maxStock} unidades disponibles en inventario.`);
              return item;
            }
            if (newCant <= 0) return null;
            return {
              ...item,
              cantidad: newCant,
              subtotal: newCant * item.precioUnitario
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productoId) => {
    setCart(cart.filter(item => item.productoId !== productoId));
  };

  const clearCart = () => {
    setCart([]);
    setEfectivoRecibido("");
    setErrorMsg(null);
  };

  // Totales
  const totalVenta = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const efectivoNum = Number(efectivoRecibido) || 0;
  const devuelta = medioPago === "Efectivo" && efectivoNum >= totalVenta ? efectivoNum - totalVenta : 0;

  // Registrar venta
  const handleCheckout = () => {
    if (cart.length === 0) {
      setErrorMsg("El carrito de compras está vacío.");
      return;
    }

    if (medioPago === "Efectivo" && efectivoRecibido && efectivoNum < totalVenta) {
      setErrorMsg("El efectivo recibido es menor que el total de la compra.");
      return;
    }

    try {
      const { venta } = registrarVenta({
        items: cart,
        clienteId: selectedClienteId || null,
        medioPago,
        vendedor: user?.nombre ? `${user.nombre} (${user.rol === "admin" ? "Admin" : "Cajero"})` : "Cajero",
        vendedorId: user?.id
      });

      // Limpiar carrito y notificar al padre para abrir el ticket
      clearCart();
      onVentaCompletada(venta);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Columna Izquierda: Catálogo de Prendas (8 cols) */}
      <div className="lg:col-span-8 space-y-4">
        
        {/* Buscador & Categorías */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar prenda por nombre, código, talla o color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Categorías Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
                  selectedCat === cat
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "todas" ? "Todas las Prendas" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Alerta de Error si hay */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-700 text-xs">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
              ✕
            </button>
          </div>
        )}

        {/* Grid de Productos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium">No hay productos que coincidan con la búsqueda.</p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const agotado = p.stock <= 0;
              const isLow = p.stock <= p.stockMinimo;

              return (
                <div
                  key={p.id}
                  onClick={() => !agotado && addToCart(p)}
                  className={`bg-white p-3.5 rounded-2xl border transition-all flex flex-col justify-between select-none ${
                    agotado
                      ? "opacity-50 border-slate-200 cursor-not-allowed bg-slate-50"
                      : "border-slate-200/80 hover:border-indigo-400 hover:shadow-md cursor-pointer group"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {p.codigo}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          agotado
                            ? "bg-slate-200 text-slate-600"
                            : isLow
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {agotado ? "Agotado" : `${p.stock} disp.`}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {p.nombre}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>Talla: <strong>{p.talla}</strong></span>
                      <span>•</span>
                      <span className="truncate">{p.color}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        ${p.precioVenta.toLocaleString("es-CO")}
                      </div>
                      <div className="text-[9px] text-slate-400">{p.marca}</div>
                    </div>

                    <button
                      disabled={agotado}
                      className={`p-2 rounded-xl transition-colors ${
                        agotado
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Columna Derecha: Carrito de Cobro (4 cols) */}
      <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-md p-5 flex flex-col sticky top-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm">Venta en Curso</h3>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[11px] text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
            >
              Vaciar
            </button>
          )}
        </div>

        {/* Selector de Cliente */}
        <div className="mb-3">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Cliente (Opcional)
          </label>
          <select
            value={selectedClienteId}
            onChange={(e) => setSelectedClienteId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Cliente General / Mostrador</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} ({c.telefono || c.documento})
              </option>
            ))}
          </select>
        </div>

        {/* Lista de ítems en carrito */}
        <div className="flex-1 space-y-2 overflow-y-auto max-h-[260px] pr-1 mb-4">
          {cart.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="text-xs font-medium">El carrito está vacío.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Selecciona prendas del catálogo para cobrar.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productoId}
                className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-slate-800 truncate">{item.nombre}</h5>
                  <div className="text-[10px] text-slate-500">
                    Talla {item.talla} • ${item.precioUnitario.toLocaleString("es-CO")} c/u
                  </div>
                  <div className="text-xs font-bold text-indigo-600 mt-0.5">
                    ${item.subtotal.toLocaleString("es-CO")}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productoId, -1)}
                    className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 w-5 text-center">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productoId, 1)}
                    className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productoId)}
                    className="p-1 hover:text-rose-600 text-slate-400 ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Medio de Pago */}
        <div className="border-t border-slate-100 pt-3 space-y-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Medio de Pago
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setMedioPago("Efectivo")}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 font-semibold transition-colors cursor-pointer ${
                  medioPago === "Efectivo"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Efectivo</span>
              </button>

              <button
                type="button"
                onClick={() => setMedioPago("Tarjeta")}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 font-semibold transition-colors cursor-pointer ${
                  medioPago === "Tarjeta"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setMedioPago("Transferencia")}
                className={`py-2 rounded-xl flex flex-col items-center gap-1 font-semibold transition-colors cursor-pointer ${
                  medioPago === "Transferencia"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Nequi / Transf.</span>
              </button>
            </div>
          </div>

          {/* Si es efectivo: input de dinero recibido y devuelta */}
          {medioPago === "Efectivo" && cart.length > 0 && (
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Paga con ($):</span>
                <input
                  type="number"
                  placeholder={totalVenta.toString()}
                  value={efectivoRecibido}
                  onChange={(e) => setEfectivoRecibido(e.target.value)}
                  className="w-28 py-1 px-2 text-right bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
              {efectivoNum >= totalVenta && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-indigo-200/60 font-semibold">
                  <span className="text-emerald-700">Cambio / Devuelta:</span>
                  <span className="text-emerald-800 text-sm font-bold">
                    ${devuelta.toLocaleString("es-CO")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Resumen Total & Botón Cobrar */}
          <div className="pt-2">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">TOTAL A COBRAR</span>
              <span className="text-xl font-extrabold text-slate-900">
                ${totalVenta.toLocaleString("es-CO")}
              </span>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                cart.length === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:scale-101 cursor-pointer"
              }`}
            >
              <Check className="w-4 h-4" />
              CONFIRMAR COBRO E IMPRIMIR TICKET
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
