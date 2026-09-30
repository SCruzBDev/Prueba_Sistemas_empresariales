import { LayoutDashboard, ShoppingBag, Layers, Receipt, Users, Truck, UserCog } from "lucide-react";

export const MENUS = {
  admin: [
    { id: "dashboard", label: "Dashboard & KPIs", icon: LayoutDashboard },
    { id: "pos", label: "Punto de Venta (POS)", icon: ShoppingBag, badge: "Vender" },
    { id: "inventario", label: "Inventario de Ropa", icon: Layers, alertKey: "stockBajoCount" },
    { id: "ventas", label: "Historial de Ventas", icon: Receipt },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "proveedores", label: "Proveedores & Entradas", icon: Truck },
    { id: "cajeros", label: "Cajeros", icon: UserCog }
  ],
  cajero: [
    { id: "pos", label: "Punto de Venta (POS)", icon: ShoppingBag, badge: "Vender" },
    { id: "ventas", label: "Mis Ventas", icon: Receipt },
    { id: "clientes", label: "Clientes", icon: Users }
  ]
};

export function pestanasPermitidas(rol) {
  return (MENUS[rol] || []).map((item) => item.id);
}

export function pestanaInicial(rol) {
  return rol === "admin" ? "dashboard" : "pos";
}
