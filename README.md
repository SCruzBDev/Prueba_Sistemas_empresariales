# 👗 Boutique POS — Sistema de Gestión de Inventario y Ventas

**Universidad Pontificia Bolivariana (UPB)**  
**Materia:** Sistemas Empresariales  
**Equipo de Proyecto:**
- Matias Arango Ruiz (ID: 547025)
- Ali Taha Ramirez (ID: 522295)
- Federico Martínez López (ID: 000500471)
- Sebastián Andrés Cruz Sierra (ID: 000208415)

---

## 📌 Resumen de la Solución

Aplicación web 100% local desarrollada para resolver la problemática de las pequeñas y medianas tiendas de ropa que aún manejan su operación en libretas o tablas de Excel:

1. **Dashboard & Indicadores (KPIs):** Facturación total, utilidad bruta estimada (`PVP - Costo`), unidades vendidas, valoración del stock en bodega y ranking dinámico de prendas con mayor salida.
2. **Control de Inventario Textil:** Catálogo clasificado por referencias, tallas, colores, composición textil, costos de compra, precios PVP y alertas visuales automáticas cuando una prenda entra en **stock crítico**.
3. **Punto de Venta (POS):** Catálogo con búsqueda express, carrito de compra en tiempo real, selector de cliente, cálculo automático de cambio en efectivo y soporte para Tarjeta / Nequi.
4. **Comprobante / Ticket de Venta:** Generación de comprobante térmico imprimible (`window.print()`).
5. **Auditoría e Historial de Ventas:** Registro de transacciones con desglose de prendas y opción de reimpresión de comprobantes.
6. **Clientes y Proveedores:** Directorio de compradores habituales y distribuidores mayoristas de confección.
7. **Entradas a Bodega:** Registro de recepción de lotes de mercancía que suman existencias automáticamente al inventario.
8. **Respaldo de Datos (JSON):** Descarga y carga de datos en formato `.json` para respaldar o transferir la información fácilmente.
9. **Accesos separados por rol:** Login independiente para *Administrador* (`#/admin`) y *Cajero* (`#/cajero`), cada uno con su propio menú y permisos.
10. **Gestión de cajeros:** El administrador crea y elimina cuentas de cajero y puede restablecer su contraseña.
11. **Recuperación de contraseña:** Mediante pregunta de seguridad, desde el propio login.

---

## 🚀 Cómo Ejecutar la Aplicación en Local

### Pasos:
1. Instala las dependencias (una sola vez):
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre en tu navegador la dirección que indica la consola (usualmente `http://localhost:5173`).

Otros comandos: `npm run build` (versión de producción) y `npm run lint` (revisión de código).

---

## 🗂️ Estructura del Proyecto

```
.
├── docs/                    # Documentos del proyecto (propuesta e idea desarrollada)
├── public/                  # Íconos estáticos
├── src/
│   ├── components/          # Pantallas: Dashboard, POS, Inventario, Ventas, Clientes, Proveedores, Cajeros...
│   │   └── auth/            # Selector de acceso y login por rol
│   ├── config/              # Menús y permisos por rol
│   ├── feedback/            # Avisos y confirmaciones de la interfaz
│   ├── services/            # Datos (storageService) y autenticación (authService)
│   ├── utils/               # Utilidades (formato de fechas)
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

---

## 🔐 Accesos y Roles

| Rol | Ruta | Correo demo | Contraseña demo |
|-----|------|-------------|-----------------|
| Administrador | `#/admin` | `matias.arango@upb.edu.co` | `Admin2026*` |
| Cajero | `#/cajero` | `sebastian.cruz@upb.edu.co` | `Cajero2026*` |

La respuesta de seguridad de las cuentas demo es `boutique`. Cambia estas credenciales antes de usar el sistema con datos reales.

- **Administrador:** Dashboard, POS, inventario (con filtros por categoría, marca, talla y estado de stock), historial de ventas (filtros por medio de pago, cajero y fechas), clientes, proveedores, cajeros y respaldo de datos.
- **Cajero:** solo POS, *Mis Ventas* (únicamente las suyas y sin utilidad) y Clientes (sin eliminar).
- La sesión dura mientras la pestaña esté abierta. Las contraseñas y respuestas se guardan con hash SHA-256 + salt.

> **Limitación:** al ser una app 100% local (sin servidor), los permisos se aplican en la interfaz y los datos viven en el `localStorage` del navegador. Sirve para separar flujos y evitar errores operativos, pero no es una barrera de seguridad frente a alguien con acceso a las herramientas del navegador. Para eso se requeriría un backend.

---

## 💾 Persistencia de Datos (100% en el Navegador)

El sistema opera de forma autónoma utilizando el almacenamiento del navegador (**`localStorage`**):
- No requiere instalar bases de datos externas ni configurar servidores.
- La información no se pierde al cerrar la pestaña o recargar la página.
- El botón **"Respaldo de Datos (JSON)"** en la barra lateral permite descargar copias de seguridad en archivo `.json` o reiniciar los datos de demostración en cualquier momento.
