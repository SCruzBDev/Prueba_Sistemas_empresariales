import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowDownCircle, 
  Edit, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Save, 
  Layers,
  History,
  Tag
} from "lucide-react";
import { 
  saveProducto, 
  deleteProducto, 
  registrarEntrada, 
  getEntradas 
} from "../services/storageService";

export default function Inventario({ 
  productos, 
  categorias, 
  proveedores, 
  onInventarioUpdated 
}) {
  const [activeTab, setActiveTab] = useState("catalogo"); // "catalogo" | "entradas"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [filterStockCritico, setFilterStockCritico] = useState(false);

  // Modal Crear / Editar Producto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    marca: "",
    categoriaId: "",
    categoria: "",
    talla: "M",
    color: "",
    textil: "",
    precioCompra: "",
    precioVenta: "",
    stock: "",
    stockMinimo: "5"
  });

  // Modal Entrada de Mercancía
  const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false);
  const [entradaData, setEntradaData] = useState({
    productoId: "",
    proveedorId: "",
    cantidad: "10",
    nota: ""
  });

  const [entradasList, setEntradasList] = useState(() => getEntradas());

  // Filtrado de productos
  const filteredProducts = productos.filter((p) => {
    const matchesSearch = 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marca.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === "todas" || p.categoriaId === selectedCategory;

    const matchesCritico = 
      !filterStockCritico || p.stock <= p.stockMinimo;

    return matchesSearch && matchesCategory && matchesCritico;
  });

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      codigo: `ROPA-00${productos.length + 1}`,
      nombre: "",
      marca: "",
      categoriaId: categorias[0]?.id || "1",
      categoria: categorias[0]?.nombre || "Camisas & Tops",
      talla: "M",
      color: "",
      textil: "",
      precioCompra: "",
      precioVenta: "",
      stock: "10",
      stockMinimo: "5"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      codigo: prod.codigo,
      nombre: prod.nombre,
      marca: prod.marca,
      categoriaId: prod.categoriaId,
      categoria: prod.categoria,
      talla: prod.talla,
      color: prod.color,
      textil: prod.textil || "",
      precioCompra: prod.precioCompra.toString(),
      precioVenta: prod.precioVenta.toString(),
      stock: prod.stock.toString(),
      stockMinimo: prod.stockMinimo.toString()
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const cat = categorias.find(c => c.id === formData.categoriaId);
    
    const productoToSave = {
      ...(editingProduct ? { id: editingProduct.id } : {}),
      codigo: formData.codigo,
      nombre: formData.nombre,
      marca: formData.marca,
      categoriaId: formData.categoriaId,
      categoria: cat ? cat.nombre : formData.categoria,
      talla: formData.talla,
      color: formData.color,
      textil: formData.textil,
      precioCompra: Number(formData.precioCompra) || 0,
      precioVenta: Number(formData.precioVenta) || 0,
      stock: Number(formData.stock) || 0,
      stockMinimo: Number(formData.stockMinimo) || 5,
      activo: true
    };

    saveProducto(productoToSave);
    setIsModalOpen(false);
    onInventarioUpdated();
  };

  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) {
      deleteProducto(id);
      onInventarioUpdated();
    }
  };

  // Guardar Entrada de Mercancía
  const handleOpenEntrada = (preselectProdId = null) => {
    setEntradaData({
      productoId: preselectProdId || (productos[0]?.id || ""),
      proveedorId: proveedores[0]?.id || "",
      cantidad: "10",
      nota: "Reposición regular de stock"
    });
    setIsEntradaModalOpen(true);
  };

  const handleSaveEntrada = (e) => {
    e.preventDefault();
    try {
      registrarEntrada({
        productoId: entradaData.productoId,
        proveedorId: entradaData.proveedorId,
        cantidad: entradaData.cantidad,
        nota: entradaData.nota
      });
      setIsEntradaModalOpen(false);
      setEntradasList(getEntradas());
      onInventarioUpdated();
      alert("¡Entrada de mercancía registrada exitosamente! El stock fue sumado.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Acciones y Pestañas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestión de Inventario y Prendas</h2>
          <p className="text-xs text-slate-500">
            Administra catálogo textil, tallas, colores, precios y entradas a bodega.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEntrada()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
            Entrada de Mercancía
          </button>
          
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nueva Prenda
          </button>
        </div>
      </div>

      {/* Tabs: Catálogo vs Historial de Entradas */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("catalogo")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "catalogo"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          Catálogo de Prendas ({productos.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("entradas");
            setEntradasList(getEntradas());
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "entradas"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <History className="w-4 h-4" />
          Historial de Entradas a Bodega ({entradasList.length})
        </button>
      </div>

      {activeTab === "catalogo" ? (
        <>
          {/* Filtros y Buscador */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
            
            {/* Buscador */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por código, prenda o marca (ej: ROPA-001, Denim, Zara)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Selector de Categoría */}
            <div className="w-full md:w-auto flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-48 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle Stock Crítico */}
            <button
              onClick={() => setFilterStockCritico(!filterStockCritico)}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                filterStockCritico
                  ? "bg-rose-500 text-white border-rose-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              Solo Stock Crítico
            </button>
          </div>

          {/* Tabla de Productos */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Código / Prenda</th>
                    <th className="py-3.5 px-4">Categoría & Marca</th>
                    <th className="py-3.5 px-4">Talla / Color</th>
                    <th className="py-3.5 px-4">Costo Compra</th>
                    <th className="py-3.5 px-4">Precio Venta (PVP)</th>
                    <th className="py-3.5 px-4">Stock Actual</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        No se encontraron prendas con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isLowStock = p.stock <= p.stockMinimo;
                      const margen = p.precioVenta - p.precioCompra;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {p.codigo}
                            </span>
                            <div className="font-bold text-slate-900 mt-1">{p.nombre}</div>
                            {p.textil && (
                              <div className="text-[10px] text-slate-400">Textil: {p.textil}</div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                              {p.categoria}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{p.marca}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">Talla: {p.talla}</div>
                            <div className="text-slate-500 text-[11px]">{p.color}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            ${p.precioCompra.toLocaleString("es-CO")}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">
                              ${p.precioVenta.toLocaleString("es-CO")}
                            </div>
                            <div className="text-[10px] text-emerald-600 font-medium">
                              +${margen.toLocaleString("es-CO")} ganancia
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-2.5 py-1 rounded-full font-bold text-xs flex items-center gap-1 ${
                                  isLowStock
                                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {isLowStock && <AlertCircle className="w-3 h-3" />}
                                {p.stock} uds.
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">mínimo: {p.stockMinimo}</div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEntrada(p.id)}
                                title="Sumar stock (Entrada de mercancía)"
                                className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer"
                              >
                                <ArrowDownCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                title="Editar detalles de la prenda"
                                className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id, p.nombre)}
                                title="Eliminar prenda"
                                className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
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
        </>
      ) : (
        /* Tabla de Historial de Entradas */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Registro de Mercancía Recibida</h3>
              <p className="text-xs text-slate-500">Historial de recepciones que han alimentado el inventario local.</p>
            </div>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">ID Entrada</th>
                <th className="py-3 px-4">Prenda / Referencia</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4">Cantidad Recibida</th>
                <th className="py-3 px-4">Costo Total Lote</th>
                <th className="py-3 px-4">Fecha / Observación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entradasList.map((ent) => (
                <tr key={ent.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">{ent.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{ent.productoNombre}</td>
                  <td className="py-3 px-4 text-slate-600">{ent.proveedorNombre}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      +{ent.cantidad} uds.
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    ${(ent.totalCosto || 0).toLocaleString("es-CO")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-500">{ent.fecha}</div>
                    <div className="text-[11px] text-slate-400 italic">{ent.nota}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Crear / Editar Prenda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {editingProduct ? "Editar Prenda" : "Registrar Nueva Prenda al Catálogo"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Código / Referencia *</label>
                  <input
                    type="text"
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    placeholder="ROPA-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marca *</label>
                  <input
                    type="text"
                    required
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="Ej: Zara, Mango, Mattelsa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de la Prenda *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="Ej: Camisa Lino Manga Larga Slim"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría *</label>
                  <select
                    value={formData.categoriaId}
                    onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Talla *</label>
                  <select
                    value={formData.talla}
                    onChange={(e) => setFormData({ ...formData, talla: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="Única">Talla Única</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Color *</label>
                  <input
                    type="text"
                    required
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="Ej: Blanco, Azul Índigo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Composición Textil</label>
                  <input
                    type="text"
                    value={formData.textil}
                    onChange={(e) => setFormData({ ...formData, textil: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="Ej: 100% Algodón, Denim"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Compra (Costo) *</label>
                  <input
                    type="number"
                    required
                    value={formData.precioCompra}
                    onChange={(e) => setFormData({ ...formData, precioCompra: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="45000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Venta (PVP) *</label>
                  <input
                    type="number"
                    required
                    value={formData.precioVenta}
                    onChange={(e) => setFormData({ ...formData, precioVenta: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="89900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Actual (Uds) *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Mínimo (Alerta) *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockMinimo}
                    onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  Guardar Prenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Entrada de Mercancía */}
      {isEntradaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-sm">Registrar Entrada de Mercancía</h3>
              </div>
              <button onClick={() => setIsEntradaModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSaveEntrada} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Seleccionar Prenda *</label>
                <select
                  required
                  value={entradaData.productoId}
                  onChange={(e) => setEntradaData({ ...entradaData, productoId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} - {p.nombre} (Stock actual: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proveedor Distribuidor *</label>
                <select
                  required
                  value={entradaData.proveedorId}
                  onChange={(e) => setEntradaData({ ...entradaData, proveedorId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {proveedores.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nombre} ({prov.contacto})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad a Ingresar (Unidades) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={entradaData.cantidad}
                  onChange={(e) => setEntradaData({ ...entradaData, cantidad: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nota / Número de Factura o Lote</label>
                <input
                  type="text"
                  value={entradaData.nota}
                  onChange={(e) => setEntradaData({ ...entradaData, nota: e.target.value })}
                  placeholder="Ej: Factura Proveedor #5678"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEntradaModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  Confirmar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
