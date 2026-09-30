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
import Cajeros from "./components/Cajeros";
import Acceso from "./components/auth/Acceso";
import Login from "./components/auth/Login";
import { pestanasPermitidas, pestanaInicial } from "./config/menus";
import { 
  initStorage, 
  getProductos, 
  getCategorias, 
  getClientes, 
  getProveedores, 
  getVentas, 
  getDashboardData 
} from "./services/storageService";
import { initUsuarios, getSesion, cerrarSesion, getCajeros } from "./services/authService";
import { Menu, ShoppingBag } from "lucide-react";

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(null);
  const [ruta, setRuta] = useState(() => window.location.hash);
  const [currentTab, setCurrentTab] = useState("pos");

  // App Data
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [cajeros, setCajeros] = useState([]);
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
    const sesion = getSesion();

    setProductos(prods);
    setCategorias(cats);
    setClientes(clis);
    setProveedores(provs);
    setVentas(vts);
    setKpiData(kpis);
    setCajeros(getCajeros());
    if (!sesion) setUser(null);
  };

  useEffect(() => {
    let activo = true;
    initStorage();
    initUsuarios().then(() => {
      if (!activo) return;
      const sesion = getSesion();
      if (sesion) {
        refreshAllData();
        setCurrentTab(pestanaInicial(sesion.rol));
        setUser(sesion);
      }
      setInitialized(true);
    });
    const onHashChange = () => setRuta(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      activo = false;
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const handleLogin = (usuario) => {
    refreshAllData();
    setCurrentTab(pestanaInicial(usuario.rol));
    setUser(usuario);
    window.location.hash = "#/";
  };

  const handleLogout = () => {
    const rol = user?.rol || "cajero";
    cerrarSesion();
    setUser(null);
    setTicketVenta(null);
    setIsBackupOpen(false);
    window.location.hash = `#/${rol}`;
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

  if (!user) {
    if (ruta === "#/admin") return <Login key="admin" rol="admin" onLogin={handleLogin} />;
    if (ruta === "#/cajero") return <Login key="cajero" rol="cajero" onLogin={handleLogin} />;
    return <Acceso />;
  }

  const isAdmin = user.rol === "admin";
  const tab = pestanasPermitidas(user.rol).includes(currentTab) ? currentTab : pestanaInicial(user.rol);
  const ventasVisibles = isAdmin ? ventas : ventas.filter((v) => v.vendedorId === user.id);

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
          currentTab={tab}
          setCurrentTab={(nueva) => {
            setCurrentTab(nueva);
            setMobileMenuOpen(false);
          }}
          user={user}
          onLogout={handleLogout}
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
              {tab === "dashboard" && "Dashboard General"}
              {tab === "pos" && "Punto de Venta (POS)"}
              {tab === "inventario" && "Inventario de Ropa"}
              {tab === "ventas" && (isAdmin ? "Historial de Ventas" : "Mis Ventas")}
              {tab === "clientes" && "Directorio de Clientes"}
              {tab === "proveedores" && "Proveedores y Distribución"}
              {tab === "cajeros" && "Gestión de Cajeros"}
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
          {tab === "dashboard" && (
            <Dashboard
              kpiData={kpiData}
              onNavigateToPOS={() => setCurrentTab("pos")}
              onNavigateToInventario={() => setCurrentTab("inventario")}
            />
          )}

          {tab === "pos" && (
            <POS
              productos={productos}
              clientes={clientes}
              user={user}
              onVentaCompletada={handleVentaCompletada}
            />
          )}

          {tab === "inventario" && (
            <Inventario
              productos={productos}
              categorias={categorias}
              proveedores={proveedores}
              onInventarioUpdated={refreshAllData}
            />
          )}

          {tab === "ventas" && (
            <VentasHistorial
              ventas={ventasVisibles}
              user={user}
              onReimprimirTicket={(v) => setTicketVenta(v)}
            />
          )}

          {tab === "clientes" && (
            <Clientes
              clientes={clientes}
              puedeEliminar={isAdmin}
              onClientesUpdated={refreshAllData}
            />
          )}

          {tab === "proveedores" && (
            <Proveedores
              proveedores={proveedores}
              onProveedoresUpdated={refreshAllData}
              onOpenEntradaMercancia={() => setCurrentTab("inventario")}
            />
          )}

          {tab === "cajeros" && (
            <Cajeros
              cajeros={cajeros}
              onCajerosUpdated={refreshAllData}
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
      {isAdmin && (
        <BackupModal
          isOpen={isBackupOpen}
          onClose={() => setIsBackupOpen(false)}
          onDataChanged={refreshAllData}
        />
      )}

    </div>
  );
}
