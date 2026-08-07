// Capa de nube: autenticación y sincronización con Supabase.
// La clave publishable es segura en el navegador: solo concede lo que permiten
// las políticas de seguridad por fila (cada usuario solo toca su propio registro).
import { createClient } from "@supabase/supabase-js";

const SB_URL = "https://zvldmexknnjnqsetcees.supabase.co";
const SB_KEY = "sb_publishable_aVvBOsbebwOr9rRrBChy0Q_18ptOT2X";
const TABLA = "centro_estado";

export const sb = createClient(SB_URL, SB_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: "edb-centro-auth" },
});

// ¿El estado tiene información real capturada? (para decidir siembra vs adopción)
export function tieneDatos(d) {
  if (!d) return false;
  const m = d.metas || {};
  return (
    (d.tareas || []).length || (d.pipeline || []).length || (d.tiempo || []).length ||
    (d.visitas || []).length || (d.mejoras || []).length ||
    (m.corto || []).length || (m.mediano || []).length || (m.largo || []).length
  ) > 0;
}

export async function sesionActual() {
  const { data } = await sb.auth.getSession();
  return data.session || null;
}

export function alCambiarSesion(cb) {
  const { data } = sb.auth.onAuthStateChange((_evento, sesion) => cb(sesion));
  return () => data.subscription.unsubscribe();
}

export async function entrar(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  return error ? { ok: false, msg: traducir(error.message) } : { ok: true };
}

export async function registrar(email, password) {
  const { data, error } = await sb.auth.signUp({ email: email.trim(), password });
  if (error) return { ok: false, msg: traducir(error.message) };
  // Con "Confirm email" desactivado, signUp deja sesión iniciada de una vez.
  if (data.session) return { ok: true, sesion: true };
  return { ok: true, sesion: false, msg: "Cuenta creada. Ahora inicia sesión." };
}

export async function salir() {
  await sb.auth.signOut();
}

// Lee el registro del usuario en la nube (o null si no existe todavía)
export async function leerNube(uid) {
  const { data, error } = await sb.from(TABLA).select("data, actualizado").eq("user_id", uid).maybeSingle();
  if (error) throw error;
  return data;
}

// Sube (inserta o actualiza) el estado completo del usuario
export async function subirNube(uid, estado) {
  const ts = estado.__actualizado || new Date().toISOString();
  const { error } = await sb.from(TABLA).upsert({ user_id: uid, data: estado, actualizado: ts });
  if (error) throw error;
}

function traducir(msg) {
  const m = (msg || "").toLowerCase();
  if (m.includes("invalid login")) return "Correo o contraseña incorrectos.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Ese correo ya tiene una cuenta. Inicia sesión.";
  if (m.includes("password should be at least") || m.includes("at least 6")) return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("unable to validate email") || m.includes("invalid email")) return "Correo no válido.";
  if (m.includes("email not confirmed")) return "Falta confirmar el correo (revisa la configuración de Supabase).";
  if (m.includes("network") || m.includes("failed to fetch")) return "Sin conexión. Revisa tu internet e inténtalo de nuevo.";
  return msg || "Ocurrió un error. Inténtalo de nuevo.";
}
