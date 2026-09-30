import { ahoraLocal } from "../utils/fechas";

const STORAGE_KEYS = {
  PRODUCTOS: "se_tienda_productos",
  CATEGORIAS: "se_tienda_categorias",
  CLIENTES: "se_tienda_clientes",
  PROVEEDORES: "se_tienda_proveedores",
  VENTAS: "se_tienda_ventas",
  ENTRADAS: "se_tienda_entradas"
};

const SEED_CATEGORIAS = [
  { id: "1", nombre: "Camisas & Tops" },
  { id: "2", nombre: "Pantalones & Jeans" },
  { id: "3", nombre: "Vestidos & Faldas" },
  { id: "4", nombre: "Chaquetas & Abrigos" },
  { id: "5", nombre: "Calzado & Accesorios" }
];

const SEED_PRODUCTOS = [
  {
    id: "prod-1",
    codigo: "ROPA-001",
    nombre: "Camisa Lino Premium Manga Larga",
    marca: "Zara Basics",
    categoriaId: "1",
    categoria: "Camisas & Tops",
    talla: "M",
    color: "Blanco Ópalo",
    textil: "100% Lino",
    precioCompra: 45000,
    precioVenta: 89900,
    stock: 14,
    stockMinimo: 5,
    activo: true,
    fechaCreacion: "2026-03-01"
  },
  {
    id: "prod-2",
    codigo: "ROPA-002",
    nombre: "Jeans Skinny Tiro Alto Denim",
    marca: "Studio F",
    categoriaId: "2",
    categoria: "Pantalones & Jeans",
    talla: "8 / S",
    color: "Azul Índigo",
    textil: "Denim Stretch",
    precioCompra: 65000,
    precioVenta: 129000,
    stock: 4,
    stockMinimo: 6,
    activo: true,
    fechaCreacion: "2026-03-02"
  },
  {
    id: "prod-3",
    codigo: "ROPA-003",
    nombre: "Vestido Midi Estampado Floral",
    marca: "Mango",
    categoriaId: "3",
    categoria: "Vestidos & Faldas",
    talla: "S",
    color: "Verde Salvia",
    textil: "Viscosa Sedosa",
    precioCompra: 70000,
    precioVenta: 145000,
    stock: 8,
    stockMinimo: 4,
    activo: true,
    fechaCreacion: "2026-03-05"
  },
  {
    id: "prod-4",
    codigo: "ROPA-004",
    nombre: "Chaqueta Biker Cuero Sintético",
    marca: "Bershka",
    categoriaId: "4",
    categoria: "Chaquetas & Abrigos",
    talla: "L",
    color: "Negro Mate",
    textil: "Poliuretano / Forro Poliéster",
    precioCompra: 95000,
    precioVenta: 189000,
    stock: 2,
    stockMinimo: 5,
    activo: true,
    fechaCreacion: "2026-03-08"
  },
  {
    id: "prod-5",
    codigo: "ROPA-005",
    nombre: "Camiseta Básica Pima Oversized",
    marca: "Mattelsa",
    categoriaId: "1",
    categoria: "Camisas & Tops",
    talla: "L",
    color: "Gris Carbón",
    textil: "100% Algodón Pima",
    precioCompra: 22000,
    precioVenta: 49900,
    stock: 25,
    stockMinimo: 8,
    activo: true,
    fechaCreacion: "2026-03-10"
  },
  {
    id: "prod-6",
    codigo: "ROPA-006",
    nombre: "Pantalón Sastrero Wide Leg",
    marca: "Zara",
    categoriaId: "2",
    categoria: "Pantalones & Jeans",
    talla: "M",
    color: "Beige Arena",
    textil: "Gabardina Liviana",
    precioCompra: 58000,
    precioVenta: 115000,
    stock: 3,
    stockMinimo: 5,
    activo: true,
    fechaCreacion: "2026-03-12"
  }
];

const SEED_CLIENTES = [
  {
    id: "cli-1",
    nombre: "Valentina Restrepo",
    telefono: "311 456 7890",
    email: "valentina.r@gmail.com",
    documento: "1020304050",
    comprasTotales: 3,
    fechaRegistro: "2026-02-15"
  },
  {
    id: "cli-2",
    nombre: "Camilo Montoya Giraldo",
    telefono: "300 123 9876",
    email: "camilo.montoya@hotmail.com",
    documento: "98765432",
    comprasTotales: 1,
    fechaRegistro: "2026-03-01"
  },
  {
    id: "cli-3",
    nombre: "Mariana Henao Silva",
    telefono: "315 789 2345",
    email: "mariana.henao@outlook.com",
    documento: "1152435678",
    comprasTotales: 2,
    fechaRegistro: "2026-03-10"
  }
];

const SEED_PROVEEDORES = [
  {
    id: "prov-1",
    nombre: "Textiles del Valle S.A.S.",
    contacto: "Carlos Gómez (Asesor)",
    telefono: "310 987 6543",
    email: "ventas@textilesdelvalle.com.co",
    categoriaSuministrada: "Telas de lino y algodones"
  },
  {
    id: "prov-2",
    nombre: "Confecciones Andinas Ltda.",
    contacto: "Beatriz Londoño",
    telefono: "318 456 1122",
    email: "contacto@confeccionesandinas.com",
    categoriaSuministrada: "Denim y pantalones terminados"
  },
  {
    id: "prov-3",
    nombre: "Importaciones Moda Express",
    contacto: "Andrés Meza",
    telefono: "301 223 9988",
    email: "pedidos@modaexpress.co",
    categoriaSuministrada: "Chaquetas y prendas de abrigo"
  }
];

const SEED_VENTAS = [
  {
    id: "VTA-1001",
    clienteId: "cli-1",
    clienteNombre: "Valentina Restrepo",
    vendedor: "Matias Arango (Admin)",
    vendedorId: "usr-admin-1",
    medioPago: "Tarjeta",
    total: 218900,
    costoTotal: 110000,
    utilidad: 108900,
    fecha: "2026-03-18 14:32",
    items: [
      { productoId: "prod-1", nombre: "Camisa Lino Premium Manga Larga", talla: "M", color: "Blanco Ópalo", cantidad: 1, precioUnitario: 89900, subtotal: 89900 },
      { productoId: "prod-2", nombre: "Jeans Skinny Tiro Alto Denim", talla: "8 / S", color: "Azul Índigo", cantidad: 1, precioUnitario: 129000, subtotal: 129000 }
    ]
  },
  {
    id: "VTA-1002",
    clienteId: "cli-2",
    clienteNombre: "Camilo Montoya Giraldo",
    vendedor: "Sebastián Cruz (Cajero)",
    vendedorId: "usr-cajero-1",
    medioPago: "Efectivo",
    total: 99800,
    costoTotal: 44000,
    utilidad: 55800,
    fecha: "2026-03-19 16:15",
    items: [
      { productoId: "prod-5", nombre: "Camiseta Básica Pima Oversized", talla: "L", color: "Gris Carbón", cantidad: 2, precioUnitario: 49900, subtotal: 99800 }
    ]
  },
  {
    id: "VTA-1003",
    clienteId: "cli-3",
    clienteNombre: "Mariana Henao Silva",
    vendedor: "Ali Taha (Admin)",
    medioPago: "Transferencia",
    total: 145000,
    costoTotal: 70000,
    utilidad: 75000,
    fecha: "2026-03-20 11:45",
    items: [
      { productoId: "prod-3", nombre: "Vestido Midi Estampado Floral", talla: "S", color: "Verde Salvia", cantidad: 1, precioUnitario: 145000, subtotal: 145000 }
    ]
  },
  {
    id: "VTA-1004",
    clienteId: "cli-1",
    clienteNombre: "Valentina Restrepo",
    vendedor: "Federico Martínez (Cajero)",
    vendedorId: "usr-cajero-2",
    medioPago: "Tarjeta",
    total: 189000,
    costoTotal: 95000,
    utilidad: 94000,
    fecha: "2026-03-21 17:05",
    items: [
      { productoId: "prod-4", nombre: "Chaqueta Biker Cuero Sintético", talla: "L", color: "Negro Mate", cantidad: 1, precioUnitario: 189000, subtotal: 189000 }
    ]
  }
];

const SEED_ENTRADAS = [
  {
    id: "ENT-001",
    productoId: "prod-1",
    productoNombre: "Camisa Lino Premium Manga Larga",
    proveedorId: "prov-1",
    proveedorNombre: "Textiles del Valle S.A.S.",
    cantidad: 15,
    costoUnitario: 45000,
    totalCosto: 675000,
    nota: "Reposición lote inicial colección lino",
    fecha: "2026-03-01 09:30"
  },
  {
    id: "ENT-002",
    productoId: "prod-5",
    productoNombre: "Camiseta Básica Pima Oversized",
    proveedorId: "prov-2",
    proveedorNombre: "Confecciones Andinas Ltda.",
    cantidad: 30,
    costoUnitario: 22000,
    totalCosto: 660000,
    nota: "Entrada de camisetas pima para temporada",
    fecha: "2026-03-10 14:00"
  }
];

function getItem(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error("Error reading localStorage:", key, err);
    return fallback;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Error writing localStorage:", key, err);
  }
}

export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTOS)) {
    setItem(STORAGE_KEYS.PRODUCTOS, SEED_PRODUCTOS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIAS)) {
    setItem(STORAGE_KEYS.CATEGORIAS, SEED_CATEGORIAS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTES)) {
    setItem(STORAGE_KEYS.CLIENTES, SEED_CLIENTES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROVEEDORES)) {
    setItem(STORAGE_KEYS.PROVEEDORES, SEED_PROVEEDORES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VENTAS)) {
    setItem(STORAGE_KEYS.VENTAS, SEED_VENTAS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENTRADAS)) {
    setItem(STORAGE_KEYS.ENTRADAS, SEED_ENTRADAS);
  }
}

export function getCategorias() {
  return getItem(STORAGE_KEYS.CATEGORIAS, SEED_CATEGORIAS);
}

export function getProductos() {
  return getItem(STORAGE_KEYS.PRODUCTOS, SEED_PRODUCTOS);
}

export function saveProducto(producto) {
  const productos = getProductos();
  if (producto.id) {
    const index = productos.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      productos[index] = { ...productos[index], ...producto };
    }
  } else {
    const nuevo = {
      ...producto,
      id: "prod-" + Date.now(),
      activo: true,
      fechaCreacion: new Date().toISOString().split("T")[0]
    };
    productos.unshift(nuevo);
  }
  setItem(STORAGE_KEYS.PRODUCTOS, productos);
  return productos;
}

export function deleteProducto(id) {
  const productos = getProductos().filter(p => p.id !== id);
  setItem(STORAGE_KEYS.PRODUCTOS, productos);
  return productos;
}

export function getClientes() {
  return getItem(STORAGE_KEYS.CLIENTES, SEED_CLIENTES);
}

export function saveCliente(cliente) {
  const clientes = getClientes();
  if (cliente.id) {
    const index = clientes.findIndex(c => c.id === cliente.id);
    if (index !== -1) {
      clientes[index] = { ...clientes[index], ...cliente };
    }
  } else {
    const nuevo = {
      ...cliente,
      id: "cli-" + Date.now(),
      comprasTotales: 0,
      fechaRegistro: new Date().toISOString().split("T")[0]
    };
    clientes.unshift(nuevo);
  }
  setItem(STORAGE_KEYS.CLIENTES, clientes);
  return clientes;
}

export function deleteCliente(id) {
  const clientes = getClientes().filter(c => c.id !== id);
  setItem(STORAGE_KEYS.CLIENTES, clientes);
  return clientes;
}

export function getProveedores() {
  return getItem(STORAGE_KEYS.PROVEEDORES, SEED_PROVEEDORES);
}

export function saveProveedor(proveedor) {
  const proveedores = getProveedores();
  if (proveedor.id) {
    const index = proveedores.findIndex(p => p.id === proveedor.id);
    if (index !== -1) {
      proveedores[index] = { ...proveedores[index], ...proveedor };
    }
  } else {
    const nuevo = {
      ...proveedor,
      id: "prov-" + Date.now()
    };
    proveedores.unshift(nuevo);
  }
  setItem(STORAGE_KEYS.PROVEEDORES, proveedores);
  return proveedores;
}

export function deleteProveedor(id) {
  const proveedores = getProveedores().filter(p => p.id !== id);
  setItem(STORAGE_KEYS.PROVEEDORES, proveedores);
  return proveedores;
}

export function getEntradas() {
  return getItem(STORAGE_KEYS.ENTRADAS, SEED_ENTRADAS);
}

export function registrarEntrada({ productoId, proveedorId, cantidad, nota }) {
  const productos = getProductos();
  const proveedores = getProveedores();
  
  const prod = productos.find(p => p.id === productoId);
  const prov = proveedores.find(p => p.id === proveedorId);
  
  if (!prod) throw new Error("Producto no encontrado");
  
  prod.stock = Number(prod.stock) + Number(cantidad);
  setItem(STORAGE_KEYS.PRODUCTOS, productos);
  
  const nuevaEntrada = {
    id: "ENT-" + (Date.now().toString().slice(-4)),
    productoId,
    productoNombre: prod.nombre,
    proveedorId: prov ? prov.id : "otro",
    proveedorNombre: prov ? prov.nombre : "Proveedor General",
    cantidad: Number(cantidad),
    costoUnitario: prod.precioCompra,
    totalCosto: prod.precioCompra * Number(cantidad),
    nota: nota || "Entrada manual de inventario",
    fecha: ahoraLocal()
  };
  
  const entradas = getEntradas();
  entradas.unshift(nuevaEntrada);
  setItem(STORAGE_KEYS.ENTRADAS, entradas);
  
  return { entrada: nuevaEntrada, productos };
}

export function getVentas() {
  return getItem(STORAGE_KEYS.VENTAS, SEED_VENTAS);
}

export function registrarVenta({ items, clienteId, medioPago, vendedor, vendedorId }) {
  const productos = getProductos();
  let total = 0;
  let costoTotal = 0;

  for (const item of items) {
    const prod = productos.find(p => p.id === item.productoId);
    if (!prod) throw new Error("Producto " + item.nombre + " no encontrado");
    if (prod.stock < item.cantidad) {
      throw new Error("Stock insuficiente para: " + prod.nombre + " (Disponibles: " + prod.stock + ")");
    }
    prod.stock -= item.cantidad;
    total += item.subtotal;
    costoTotal += (prod.precioCompra * item.cantidad);
  }

  setItem(STORAGE_KEYS.PRODUCTOS, productos);

  let clienteNombre = "Cliente General / Mostrador";
  if (clienteId) {
    const clientes = getClientes();
    const cli = clientes.find(c => c.id === clienteId);
    if (cli) {
      clienteNombre = cli.nombre;
      cli.comprasTotales = (cli.comprasTotales || 0) + 1;
      setItem(STORAGE_KEYS.CLIENTES, clientes);
    }
  }

  const nuevaVenta = {
    id: "VTA-" + Math.floor(1000 + Math.random() * 9000),
    clienteId: clienteId || null,
    clienteNombre,
    vendedor: vendedor || "Cajero Principal",
    vendedorId: vendedorId || null,
    medioPago: medioPago || "Efectivo",
    total,
    costoTotal,
    utilidad: total - costoTotal,
    fecha: ahoraLocal(),
    items: [...items]
  };

  const ventas = getVentas();
  ventas.unshift(nuevaVenta);
  setItem(STORAGE_KEYS.VENTAS, ventas);

  return { venta: nuevaVenta, productos };
}

export function getDashboardData() {
  const productos = getProductos();
  const ventas = getVentas();
  
  const totalProductos = productos.length;
  const valorInventario = productos.reduce((acc, p) => acc + (p.precioVenta * p.stock), 0);
  const costoInventario = productos.reduce((acc, p) => acc + (p.precioCompra * p.stock), 0);
  
  const stockBajo = productos.filter(p => p.stock <= p.stockMinimo);

  const totalVentasValor = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalUtilidad = ventas.reduce((acc, v) => acc + (v.utilidad || 0), 0);
  
  const prendasVendidas = ventas.reduce((acc, v) => {
    return acc + v.items.reduce((sum, it) => sum + it.cantidad, 0);
  }, 0);

  const productoMap = {};
  ventas.forEach(v => {
    v.items.forEach(it => {
      if (!productoMap[it.productoId]) {
        productoMap[it.productoId] = {
          id: it.productoId,
          nombre: it.nombre,
          unidades: 0,
          recaudado: 0
        };
      }
      productoMap[it.productoId].unidades += it.cantidad;
      productoMap[it.productoId].recaudado += it.subtotal;
    });
  });

  const topProductos = Object.values(productoMap)
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, 5);

  return {
    totalProductos,
    valorInventario,
    costoInventario,
    stockBajoCount: stockBajo.length,
    stockBajoList: stockBajo,
    totalVentasValor,
    totalUtilidad,
    prendasVendidas,
    totalTransacciones: ventas.length,
    topProductos
  };
}

export function exportDataJSON() {
  const data = {
    productos: getProductos(),
    categorias: getCategorias(),
    clientes: getClientes(),
    proveedores: getProveedores(),
    ventas: getVentas(),
    entradas: getEntradas(),
    exportDate: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
}

export function importDataJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.productos) setItem(STORAGE_KEYS.PRODUCTOS, data.productos);
    if (data.categorias) setItem(STORAGE_KEYS.CATEGORIAS, data.categorias);
    if (data.clientes) setItem(STORAGE_KEYS.CLIENTES, data.clientes);
    if (data.proveedores) setItem(STORAGE_KEYS.PROVEEDORES, data.proveedores);
    if (data.ventas) setItem(STORAGE_KEYS.VENTAS, data.ventas);
    if (data.entradas) setItem(STORAGE_KEYS.ENTRADAS, data.entradas);
    return true;
  } catch (err) {
    console.error("Error al importar datos:", err);
    return false;
  }
}

export function resetToSeedData() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  initStorage();
}
