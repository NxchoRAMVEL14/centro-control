import React, { useState, useMemo } from 'react';
import {
  DIETAS, dietaPorClave, filtrarPorDieta, densidadHC, macrosDeDieta,
  GRUPOS_SMAE, grupoSmae, equivalentesDeReceta, sumarEquivalentes, coberturaEquivalentes,
} from './data/dietas.js';
import { TIEMPOS } from './data/recetas.js';
import { energiaDiaria } from './nucleo.js';

// ── Selector de dieta ─────────────────────────────────────────────────────
// Antes de aplicar una dieta se enseña cuántos platillos del recetario caben en
// ella, tiempo por tiempo. Una dieta que deja tres desayunos posibles va a
// repetirlos, y más vale saberlo antes que descubrirlo con el menú ya hecho.

export function SelectorDieta({ persona, recetas, onGuardar, onCerrar, Hoja }) {
  const [elegida, setElegida] = useState(persona.dieta || 'equilibrada');
  const [pers, setPers] = useState(persona.dietaPersonalizada || { prot: '', carb: '', gras: '' });
  const d = dietaPorClave(elegida);

  const cobertura = useMemo(() => {
    const { aptas } = filtrarPorDieta(recetas, elegida);
    const porTiempo = TIEMPOS.map((t) => ({
      ...t, n: aptas.filter((r) => r.tiempos.includes(t.k)).length,
    }));
    return { total: aptas.length, porTiempo, minimo: Math.min(...porTiempo.map((x) => x.n)) };
  }, [recetas, elegida]);

  const kcal = energiaDiaria(persona);
  const previa = kcal ? macrosDeDieta({
    kcal, peso: persona.peso, dieta: elegida, personalizada: pers,
  }) : null;

  const escasa = cobertura.minimo < 5;
  const imposible = cobertura.minimo === 0;

  return (
    <Hoja titulo="Tipo de dieta" sub="Cambia el reparto de macronutrientes y qué platillos entran al menú." onCerrar={onCerrar}>
      {DIETAS.map((x) => (
        <div className="linea-lista" key={x.k} onClick={() => setElegida(x.k)} style={{ cursor: 'pointer' }}>
          <span className={'check' + (elegida === x.k ? ' on' : '')}>{elegida === x.k ? '✓' : ''}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="nombre-item">{x.nombre}</div>
            <div style={{ fontSize: 11.5, color: 'var(--tinta-suave)' }}>{x.resumen}</div>
          </div>
        </div>
      ))}

      <p style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--tinta-media)', margin: '14px 0 0' }}>{d.detalle}</p>
      {d.aviso && <div className="aviso" style={{ marginTop: 10 }}>{d.aviso}</div>}

      {d.editable && (<>
        <h3>Tus números</h3>
        <p className="nota" style={{ marginTop: 0 }}>Captura los gramos diarios que te haya indicado tu nutriólogo.</p>
        <div className="rejilla2">
          {[['prot', 'Proteína (g)'], ['carb', 'Hidratos (g)'], ['gras', 'Grasa (g)']].map(([k, etq]) => (
            <div className="campo" key={k}><label>{etq}</label>
              <input type="number" inputMode="decimal" value={pers[k]}
                onChange={(e) => setPers({ ...pers, [k]: e.target.value })} /></div>
          ))}
        </div>
      </>)}

      {previa && (
        <div className="tarjeta plana" style={{ background: 'var(--cobalto-lavado)', border: 0, margin: '14px 0' }}>
          <div className="comida-tiempo" style={{ color: 'var(--cobalto)', marginBottom: 5 }}>Tu día quedaría así</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="pildora">{previa.kcal.toLocaleString('es-MX')} kcal</span>
            <span className="pildora jade">{previa.prot} g proteína</span>
            <span className="pildora maiz">{previa.carb} g hidratos</span>
            <span className="pildora gris">{previa.gras} g grasa</span>
          </div>
        </div>
      )}

      <h3>Platillos disponibles</h3>
      <div className="tarjeta plana" style={{ background: 'var(--cal)', marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
          <span style={{ color: 'var(--tinta-media)' }}>De los {recetas.length} del recetario</span>
          <b>{cobertura.total} caben</b>
        </div>
        {cobertura.porTiempo.map((t) => (
          <div key={t.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
            <span style={{ color: 'var(--tinta-media)' }}>{t.nombre}</span>
            <span style={{ fontWeight: 600, color: t.n < 5 ? 'var(--achiote)' : 'var(--tinta)' }}>
              {t.n} {t.n === 1 ? 'platillo' : 'platillos'}
            </span>
          </div>
        ))}
      </div>

      {imposible && (
        <div className="aviso" style={{ marginBottom: 10 }}>
          Con esta dieta hay tiempos de comida sin ningún platillo disponible. El menú va a
          quedar incompleto hasta que agregues recetas propias que cumplan.
        </div>
      )}
      {!imposible && escasa && (
        <div className="aviso" style={{ marginBottom: 10 }}>
          Algún tiempo queda con menos de cinco opciones, así que se van a repetir seguido.
          Si te decides por esta dieta, conviene que agregues recetas tuyas en el Recetario.
        </div>
      )}

      {/* Los números capturados se guardan aunque al final se elija otro
          perfil: si se pierden al cambiar de opción, hay que volver a pedirlos
          a quien los dio. */}
      <button className="btn" onClick={() => onGuardar(elegida, pers)}>
        Usar esta dieta
      </button>
      <p className="nota">
        Cambiar de dieta no rehace los menús que ya generaste. Aplica a los que generes desde
        ahora y al reparto de macronutrientes del día.
      </p>
    </Hoja>
  );
}

// ── Equivalentes del SMAE ─────────────────────────────────────────────────
export function Equivalentes({ cuenta, cobertura, compacto }) {
  const filas = GRUPOS_SMAE
    .map((g) => ({ ...g, n: cuenta[g.k] || 0 }))
    .filter((g) => g.n >= 0.1)
    .sort((a, b) => b.n - a.n);

  if (!filas.length) return <p className="nota" style={{ marginTop: 0 }}>Sin ingredientes que se puedan convertir a equivalentes.</p>;

  const max = Math.max(...filas.map((f) => f.n));

  return (<>
    {filas.map((g) => (
      <div className="medidor" key={g.k} style={{ marginBottom: compacto ? 8 : 12 }}>
        <div className="medidor-cab">
          <span style={{ color: 'var(--tinta-media)' }}>{g.nombre}</span>
          <b>{g.n}</b>
        </div>
        <div className="barra">
          <i style={{ width: (g.n / max) * 100 + '%', background: g.color }} />
        </div>
      </div>
    ))}
    {cobertura !== undefined && cobertura < 0.9 && (
      <p className="nota">
        Faltó clasificar {Math.round((1 - cobertura) * 100)} % de los ingredientes, así que el
        conteo se queda corto.
      </p>
    )}
  </>);
}

// Panel de equivalentes de un día completo, para la pantalla Hoy.
export function EquivalentesDelDia({ recetas, plan, reg, indice, factor }) {
  const cuentas = [];
  for (const [t, id] of Object.entries(plan || {})) {
    if (!(reg.hechos || {})[t]) continue;
    const r = indice[id];
    if (r) cuentas.push(equivalentesDeReceta(r, factor));
  }
  const total = sumarEquivalentes(cuentas);
  const hay = Object.values(total).some((v) => v >= 0.1);

  return (<>
    {hay ? <Equivalentes cuenta={total} compacto /> : (
      <p className="nota" style={{ marginTop: 0 }}>
        Marca tus comidas del día y aquí aparece el reparto por grupos.
      </p>
    )}
    <p className="nota">
      Equivalentes del Sistema Mexicano de Alimentos Equivalentes, estimados a partir de los
      ingredientes de cada platillo. Es una aproximación para entenderte con un nutriólogo,
      no un plan de alimentación.
    </p>
  </>);
}

// Etiqueta de qué tan cargado de hidratos está un platillo.
export function EtiquetaHC({ receta }) {
  const d = densidadHC(receta);
  if (d <= 0.15) return <span className="pildora jade">Muy bajo en hidratos</span>;
  if (d <= 0.32) return <span className="pildora jade">Bajo en hidratos</span>;
  if (d <= 0.55) return <span className="pildora gris">Hidratos moderados</span>;
  return <span className="pildora maiz">Alto en hidratos</span>;
}

export { equivalentesDeReceta, coberturaEquivalentes, dietaPorClave };
