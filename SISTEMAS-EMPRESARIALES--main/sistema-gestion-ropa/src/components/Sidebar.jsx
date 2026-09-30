import React from "react";
import { 
  ShoppingBag, 
  Database, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle,
  LogOut
} from "lucide-react";
import { MENUS } from "../config/menus";

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  user, 
  onLogout,
  stockBajoCount, 
  onOpenBackup 
}) {
  const isAdmin = user.rol === "admin";
  const menuItems = MENUS[user.rol] || [];
  const alertas = { stockBajoCount };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight tracking-tight">BOUTIQUE POS</h1>
            <p className="text-[11px] text-indigo-400 font-medium tracking-wide uppercase">Gestión de Moda</p>
          </div>
        </div>
      </div>

      {/* Usuario en sesión */}
      <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            {isAdmin ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <UserCheck className="w-4 h-4 text-amber-400" />
            )}
            <div>
              <div className="text-white font-medium truncate max-w-[110px] text-xs">{user.nombre}</div>
              <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                isAdmin ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
              }`}>
                {isAdmin ? "Administrador" : "Cajero"}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md border border-slate-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            Salir
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>

              {alertas[item.alertKey] > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  {alertas[item.alertKey]}
                </span>
              )}

              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isActive ? "bg-indigo-800 text-indigo-100" : "bg-indigo-500/20 text-indigo-300"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Backup & System Info */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {isAdmin && (
        <button
          onClick={onOpenBackup}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700/80 transition-colors cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>Respaldo de Datos (JSON)</span>
        </button>
        )}

        <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
          <div className="flex justify-between items-center text-slate-300 font-medium">
            <span>Sistemas Empresariales</span>
            <span className="text-indigo-400">UPB 2026</span>
          </div>
          <p className="text-slate-500 truncate">Equipo: Matias, Ali, Fede, Sebas</p>
          <div className="flex items-center gap-1.5 text-emerald-400 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[9px]">Modo Local Activo (localStorage)</span>
          </div>
        </div>
      </div>

    </aside>
  );
}
