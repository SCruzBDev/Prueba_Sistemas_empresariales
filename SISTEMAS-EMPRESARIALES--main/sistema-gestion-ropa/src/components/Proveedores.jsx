import React, { useState } from "react";
import { Truck, Plus, Search, Edit, Trash2, Phone, Mail, User, X, Save, ArrowDownCircle } from "lucide-react";
import { saveProveedor, deleteProveedor } from "../services/storageService";
import { useFeedback } from "../feedback/context";

export default function Proveedores({ proveedores, onProveedoresUpdated, onOpenEntradaMercancia }) {
  const { avisar, confirmar } = useFeedback();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    categoriaSuministrada: ""
  });

  const filteredProveedores = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoriaSuministrada && p.categoriaSuministrada.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setEditingProveedor(null);
    setFormData({ nombre: "", contacto: "", telefono: "", email: "", categoriaSuministrada: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProveedor(p);
    setFormData({
      nombre: p.nombre,
      contacto: p.contacto,
      telefono: p.telefono,
      email: p.email,
      categoriaSuministrada: p.categoriaSuministrada || ""
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveProveedor({
      ...(editingProveedor ? { id: editingProveedor.id } : {}),
      ...formData
    });
    setIsModalOpen(false);
    onProveedoresUpdated();
    avisar(editingProveedor ? "Proveedor actualizado" : "Proveedor registrado");
  };

  const handleDelete = async (id, nombre) => {
    const ok = await confirmar({
      titulo: `¿Eliminar a ${nombre}?`,
      mensaje: "El proveedor saldrá del directorio. Las entradas a bodega registradas se conservan.",
      textoConfirmar: "Eliminar"
    });
    if (!ok) return;
    deleteProveedor(id);
    onProveedoresUpdated();
    avisar("Proveedor eliminado");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Proveedores & Distribuidores Textiles</h2>
          <p className="text-xs text-slate-500">
            Control de empresas de confección y distribuidores mayoristas de telas e insumos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Registrar Proveedor
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por empresa, contacto o tipo de textil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid de Proveedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProveedores.length === 0 ? (
          <div className="col-span-full py-10 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Truck className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-medium">No hay proveedores registrados.</p>
          </div>
        ) : (
          filteredProveedores.map((prov) => (
            <div
              key={prov.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs">
                    <Truck className="w-4 h-4" />
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(prov)}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-md cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prov.id, prov.nombre)}
                      className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{prov.nombre}</h3>
                
                {prov.categoriaSuministrada && (
                  <span className="inline-block mt-1 text-[10px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {prov.categoriaSuministrada}
                  </span>
                )}

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prov.contacto}</span>
                  </div>
                  {prov.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prov.telefono}</span>
                    </div>
                  )}
                  {prov.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{prov.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onOpenEntradaMercancia(prov.id)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Registrar Entrada de este Proveedor
                </button>
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
                {editingProveedor ? "Editar Proveedor" : "Registrar Nuevo Proveedor"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Razón Social / Empresa *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Textiles Medellín S.A.S."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Persona de Contacto / Asesor *</label>
                <input
                  type="text"
                  required
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                  placeholder="Ej: Juan Camilo Pérez"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Línea de Teléfono *</label>
                <input
                  type="text"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="300 456 7890"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ventas@proveedor.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prendas o Insumos que Suministra</label>
                <input
                  type="text"
                  value={formData.categoriaSuministrada}
                  onChange={(e) => setFormData({ ...formData, categoriaSuministrada: e.target.value })}
                  placeholder="Ej: Telas de lino, botones, blusas terminadas"
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
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
