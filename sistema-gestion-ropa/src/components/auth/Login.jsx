import React, { useState } from "react";
import { ShoppingBag, ShieldCheck, UserCheck, Mail, Lock, KeyRound, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { iniciarSesion, getPreguntaRecuperacion, recuperarPassword } from "../../services/authService";

const PORTALES = {
  admin: {
    titulo: "Acceso Administrador",
    descripcion: "Gestión de inventario, reportes, proveedores y cajeros.",
    icono: ShieldCheck,
    acento: "text-emerald-400",
    boton: "bg-emerald-600 hover:bg-emerald-700",
    otro: { hash: "#/cajero", texto: "¿Eres cajero? Ingresa aquí" }
  },
  cajero: {
    titulo: "Acceso Cajero",
    descripcion: "Punto de venta, clientes y tus ventas del día.",
    icono: UserCheck,
    acento: "text-amber-400",
    boton: "bg-amber-600 hover:bg-amber-700",
    otro: { hash: "#/admin", texto: "¿Eres administrador? Ingresa aquí" }
  }
};

const inputClass =
  "w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors";

export default function Login({ rol, onLogin }) {
  const portal = PORTALES[rol];
  const Icono = portal.icono;

  const [vista, setVista] = useState("login"); // "login" | "recuperar-email" | "recuperar-respuesta" | "recuperado"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const cambiarVista = (siguiente) => {
    setError("");
    setVista(siguiente);
  };

  const ejecutar = async (accion) => {
    setError("");
    setCargando(true);
    try {
      await accion();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    ejecutar(async () => {
      const usuario = await iniciarSesion({ email, password, rolEsperado: rol });
      onLogin(usuario);
    });
  };

  const handleBuscarCuenta = (e) => {
    e.preventDefault();
    ejecutar(async () => {
      setPregunta(getPreguntaRecuperacion(email, rol));
      setRespuesta("");
      setNuevaPassword("");
      setConfirmacion("");
      setVista("recuperar-respuesta");
    });
  };

  const handleRecuperar = (e) => {
    e.preventDefault();
    ejecutar(async () => {
      if (nuevaPassword !== confirmacion) throw new Error("Las contraseñas no coinciden.");
      await recuperarPassword({ email, rolEsperado: rol, respuesta, nuevaPassword });
      setPassword("");
      setVista("recuperado");
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6 text-white">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">BOUTIQUE POS</h1>
            <p className="text-[11px] text-indigo-400 font-medium tracking-wide uppercase">Gestión de Moda</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-slate-950 text-white px-6 py-5 flex items-center gap-3">
            <Icono className={`w-6 h-6 ${portal.acento}`} />
            <div>
              <h2 className="font-bold text-sm">{portal.titulo}</h2>
              <p className="text-[11px] text-slate-400">{portal.descripcion}</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div role="alert" className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {vista === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block text-xs font-semibold text-slate-700">
                  Correo electrónico
                  <div className="relative mt-1">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" required autoFocus autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                  </div>
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Contraseña
                  <div className="relative mt-1">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                  </div>
                </label>
                <button type="submit" disabled={cargando} className={`w-full py-2.5 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 cursor-pointer ${portal.boton}`}>
                  {cargando ? "Verificando..." : "Ingresar"}
                </button>
                <button type="button" onClick={() => cambiarVista("recuperar-email")} className="w-full text-xs text-indigo-600 hover:underline cursor-pointer">
                  ¿Olvidaste tu contraseña?
                </button>
              </form>
            )}

            {vista === "recuperar-email" && (
              <form onSubmit={handleBuscarCuenta} className="space-y-4">
                <p className="text-xs text-slate-600">Escribe el correo de tu cuenta y te haremos tu pregunta de seguridad.</p>
                <label className="block text-xs font-semibold text-slate-700">
                  Correo electrónico
                  <div className="relative mt-1">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                  </div>
                </label>
                <button type="submit" disabled={cargando} className={`w-full py-2.5 text-white text-sm font-semibold rounded-xl disabled:opacity-60 cursor-pointer ${portal.boton}`}>
                  Continuar
                </button>
                <button type="button" onClick={() => cambiarVista("login")} className="w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver al ingreso
                </button>
              </form>
            )}

            {vista === "recuperar-respuesta" && (
              <form onSubmit={handleRecuperar} className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <span className="text-slate-500 block mb-0.5">Pregunta de seguridad</span>
                  <strong className="text-slate-800">{pregunta}</strong>
                </div>
                <label className="block text-xs font-semibold text-slate-700">
                  Tu respuesta
                  <div className="relative mt-1">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" required autoFocus autoComplete="off" value={respuesta} onChange={(e) => setRespuesta(e.target.value)} className={inputClass} />
                  </div>
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Nueva contraseña (mínimo 8 caracteres)
                  <div className="relative mt-1">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" required autoComplete="new-password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} className={inputClass} />
                  </div>
                </label>
                <label className="block text-xs font-semibold text-slate-700">
                  Confirmar contraseña
                  <div className="relative mt-1">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" required autoComplete="new-password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} className={inputClass} />
                  </div>
                </label>
                <button type="submit" disabled={cargando} className={`w-full py-2.5 text-white text-sm font-semibold rounded-xl disabled:opacity-60 cursor-pointer ${portal.boton}`}>
                  {cargando ? "Guardando..." : "Restablecer contraseña"}
                </button>
                <button type="button" onClick={() => cambiarVista("login")} className="w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5" /> Cancelar
                </button>
              </form>
            )}

            {vista === "recuperado" && (
              <div className="space-y-4 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm text-slate-700">Tu contraseña fue actualizada. Ya puedes ingresar.</p>
                <button onClick={() => cambiarVista("login")} className={`w-full py-2.5 text-white text-sm font-semibold rounded-xl cursor-pointer ${portal.boton}`}>
                  Ir al ingreso
                </button>
              </div>
            )}
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <a href={portal.otro.hash} className="text-indigo-600 hover:underline">{portal.otro.texto}</a>
            <a href="#/" className="text-slate-400 hover:text-slate-700">Inicio</a>
          </div>
        </div>
      </div>
    </div>
  );
}
