import React, { useState } from "react";
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, FileText, ShoppingBag, X, Save } from "lucide-react";
import { saveCliente, deleteCliente } from "../services/storageService";
import { useFeedback } from "../feedback/context";

export default function Clientes({ clientes, puedeEliminar = false, onClientesUpdated }) {
  const { avisar, confirmar } = useFeedback();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    documento: ""
  });

  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.documento && c.documento.includes(searchTerm)) ||
    (c.telefono && c.telefono.includes(searchTerm))
  );

  const handleOpenCreate = () => {
    setEditingCliente(null);
    setFormData({ nombre: "", telefono: "", email: "", documento: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCliente(c);
    setFormData({
      nombre: c.nombre,
      telefono: c.telefono || "",
      email: c.email || "",
      documento: c.documento || ""
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveCliente({
      ...(editingCliente ? { id: editingCliente.id, comprasTotales: editingCliente.comprasTotales } : {}),
      ...formData
    });
    setIsModalOpen(false);
    onClientesUpdated();
    avisar(editingCliente ? "Cliente actualizado" : "Cliente registrado");
  };

  const handleDelete = async (id, nombre) => {
    const ok = await confirmar({
      titulo: `¿Eliminar a ${nombre}?`,
      mensaje: "El cliente saldrá del directorio. Sus ventas pasadas se conservan.",
      textoConfirmar: "Eliminar"
    });
    if (!ok) return;
    deleteCliente(id);
    onClientesUpdated();
    avisar("Cliente eliminado");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Directorio de Clientes</h2>
          <p className="text-xs text-slate-500">
            Ficha de compradores habituales, contacto e historial de consumo para fidelización.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClientes.length === 0 ? (
          <div className="col-span-full py-10 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-medium">No se encontraron clientes registrados.</p>
          </div>
        ) : (
          filteredClientes.map((cli) => (
            <div
              key={cli.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    {cli.nombre.charAt(0)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cli)}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-md cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {puedeEliminar && (
                      <button
                        onClick={() => handleDelete(cli.id, cli.nombre)}
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{cli.nombre}</h3>
                {cli.documento && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <FileText className="w-3 h-3" />
                    <span>C.C. {cli.documento}</span>
                  </div>
                )}

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  {cli.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cli.telefono}</span>
                    </div>
                  )}
                  {cli.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{cli.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Compras en tienda:</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" />
                  {cli.comprasTotales || 0}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Crear / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {editingCliente ? "Editar Cliente" : "Registrar Nuevo Cliente"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Laura Gómez"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Número de Cédula / Documento</label>
                <input
                  type="text"
                  value={formData.documento}
                  onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                  placeholder="1020304050"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono Móvil *</label>
                <input
                  type="text"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="310 123 4567"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="cliente@ejemplo.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
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
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
