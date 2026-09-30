import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Inventario from "./components/Inventario";
import POS from "./components/POS";
import VentasHistorial from "./components/VentasHistorial";
import Clientes from "./components/Clientes";
import Proveedores from "./components/Proveedores";
import TicketModal from "./components/TicketModal";
import BackupModal from "./components/BackupModal";
import { 
  initStorage, 
  getProductos, 
  getCategorias, 
  getClientes, 
  getProveedores, 
  getVentas, 
  getCurrentUser, 
  setCurrentUser,
  getDashboardData 
} from "./services/storageService";
import { Menu, ShoppingBag } from "lucide-react";

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState({ nombre: "Matias Arango", email: "matias.arango@upb.edu.co", rol: "admin" });
  const [currentTab, setCurrentTab] = useState("dashboard"); // "dashboard" | "pos" | "inventario" | "ventas" | "clientes" | "proveedores"

  // App Data
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalProductos: 0,
    valorInventario: 0,
    costoInventario: 0,
    stockBajoCount: 0,
    stockBajoList: [],
    totalVentasValor: 0,
    totalUtilidad: 0,
    prendasVendidas: 0,
    totalTransacciones: 0,
    topProductos: []
  });

  // Modales Globales
  const [ticketVenta, setTicketVenta] = useState(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const refreshAllData = () => {
    const prods = getProductos();
    const cats = getCategorias();
    const clis = getClientes();
    const provs = getProveedores();
    const vts = getVentas();
    const kpis = getDashboardData();
    const curUser = getCurrentUser();

    setProductos(prods);
    setCategorias(cats);
    setClientes(clis);
    setProveedores(provs);
    setVentas(vts);
    setKpiData(kpis);
    setUser(curUser);
  };

  useEffect(() => {
    initStorage();
    refreshAllData();
    setInitialized(true);
  }, []);

  const handleUpdateUser = (newUser) => {
    setCurrentUser(newUser);
    setUser(newUser);
  };

  const handleVentaCompletada = (venta) => {
    refreshAllData();
    setTicketVenta(venta);
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-pulse flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-indigo-400 animate-bounce" />
          <span className="font-semibold text-sm">Cargando sistema boutique...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans">
      
      {/* Top Mobile Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-sm">
          <ShoppingBag className="w-5 h-5 text-indigo-400" />
          <span>BOUTIQUE POS</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Desktop / Mobile Drawer */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} md:block z-40`}>
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            setMobileMenuOpen(false);
          }}
          user={user}
          setUser={handleUpdateUser}
          stockBajoCount={kpiData.stockBajoCount}
          onOpenBackup={() => setIsBackupOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shrink-0 shadow-2xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 capitalize">
              {currentTab === "dashboard" && "Dashboard General"}
              {currentTab === "pos" && "Punto de Venta (POS)"}
              {currentTab === "inventario" && "Inventario de Ropa"}
              {currentTab === "ventas" && "Historial de Ventas"}
              {currentTab === "clientes" && "Directorio de Clientes"}
              {currentTab === "proveedores" && "Proveedores y Distribución"}
            </h2>
            <p className="text-[11px] text-slate-500">
              {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-700">{user.nombre}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 capitalize">{user.rol}</span>
            </div>
          </div>
        </header>

        {/* View Switcher */}
        <div className="p-6">
          {currentTab === "dashboard" && (
            <Dashboard
              kpiData={kpiData}
              onNavigateToPOS={() => setCurrentTab("pos")}
              onNavigateToInventario={() => setCurrentTab("inventario")}
            />
          )}

          {currentTab === "pos" && (
            <POS
              productos={productos}
              clientes={clientes}
              user={user}
              onVentaCompletada={handleVentaCompletada}
            />
          )}

          {currentTab === "inventario" && (
            <Inventario
              productos={productos}
              categorias={categorias}
              proveedores={proveedores}
              onInventarioUpdated={refreshAllData}
            />
          )}

          {currentTab === "ventas" && (
            <VentasHistorial
              ventas={ventas}
              user={user}
              onReimprimirTicket={(v) => setTicketVenta(v)}
            />
          )}

          {currentTab === "clientes" && (
            <Clientes
              clientes={clientes}
              onClientesUpdated={refreshAllData}
            />
          )}

          {currentTab === "proveedores" && (
            <Proveedores
              proveedores={proveedores}
              onProveedoresUpdated={refreshAllData}
              onOpenEntradaMercancia={() => setCurrentTab("inventario")}
            />
          )}
        </div>

      </main>

      {/* Ticket Modal (Imprimible) */}
      <TicketModal
        venta={ticketVenta}
        onClose={() => setTicketVenta(null)}
      />

      {/* Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onDataChanged={refreshAllData}
      />

    </div>
  );
}
