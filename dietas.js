// ── Perfiles de dieta ─────────────────────────────────────────────────────
// Cada perfil define cómo se reparte la energía del día entre macronutrientes
// y qué tan cargado de hidratos puede estar un platillo para entrar al menú.
//
// La proteína se fija en gramos por kilo de peso, no en porcentaje, porque el
// requerimiento de proteína depende del cuerpo y no de cuánto se coma ese día.
// El resto de la energía se reparte entre grasa e hidratos según el perfil.
//
// topeHC es la fracción máxima de calorías que puede venir de hidratos en un
// platillo para que el generador lo considere. Sirve para que una dieta baja en
// carbohidratos no arme un menú de tacos con arroz.

export const DIETAS = [
  {
    k: 'equilibrada',
    nombre: 'Equilibrada',
    resumen: 'Variedad, sin restringir grupos',
    detalle: 'El reparto por defecto: proteína suficiente, grasa moderada y el resto en hidratos. Es el punto de partida razonable cuando no hay una indicación médica de por medio.',
    protPorKg: 1.4, grasaPct: 0.27, topeHC: 1,
  },
  {
    k: 'proteina',
    nombre: 'Alta en proteína',
    resumen: 'Más proteína, útil si entrenas fuerte',
    detalle: 'Sube la proteína a 2 g por kilo y baja un poco los hidratos. Se usa cuando hay entrenamiento de fuerza de por medio o se busca conservar músculo.',
    protPorKg: 2.0, grasaPct: 0.30, topeHC: 0.5,
  },
  {
    k: 'bajaHC',
    nombre: 'Baja en carbohidratos',
    resumen: 'Menos harinas y azúcares',
    detalle: 'Reduce los hidratos a alrededor de la cuarta parte de la energía y sube la grasa. No elimina el maíz ni el frijol, sólo los limita.',
    protPorKg: 1.8, grasaPct: 0.45, topeHC: 0.32,
  },
  {
    k: 'cetogenica',
    nombre: 'Cetogénica',
    resumen: 'Hidratos muy bajos, grasa alta',
    detalle: 'Deja los hidratos por debajo del 10 % de la energía. Es una dieta terapéutica: nació para tratar epilepsia refractaria y hoy se usa en algunos contextos metabólicos. No es una dieta de mantenimiento general y conviene hacerla con seguimiento profesional.',
    protPorKg: 1.6, grasaPct: 0.72, topeHC: 0.12,
    aviso: 'La cetogénica es una dieta terapéutica, no de mantenimiento. Antes de sostenerla, vale la pena que la revise un nutriólogo o tu médico, sobre todo si tomas algún medicamento.',
  },
  {
    k: 'mediterranea',
    nombre: 'Mediterránea',
    resumen: 'Grasas buenas, pescado y verdura',
    detalle: 'Grasa moderada-alta pero de aceite de oliva, pescado, semillas y aguacate, con hidratos de cereales y leguminosas. Es de los patrones con más respaldo para salud cardiovascular a largo plazo.',
    protPorKg: 1.4, grasaPct: 0.38, topeHC: 0.55,
    prefiere: ['pescado', 'verdura', 'leguminosa', 'mariscos'],
  },
  {
    k: 'personalizada',
    nombre: 'La que me dio mi nutriólogo',
    resumen: 'Tú pones los números',
    detalle: 'Si alguien te dio un plan con cifras concretas, aquí las capturas tal cual y la app trabaja con ellas en vez de calcularlas.',
    protPorKg: 1.4, grasaPct: 0.30, topeHC: 1, editable: true,
  },
];

export const dietaPorClave = (k) => DIETAS.find((d) => d.k === k) || DIETAS[0];

// ── Sistema Mexicano de Alimentos Equivalentes ────────────────────────────
// Aporte promedio de 1 equivalente de cada grupo, según Pérez Lizaur y cols.
// Cada grupo se define por su nutriente clave: hidratos en verduras, frutas,
// cereales, leguminosas, leche y azúcares; 7 g de proteína en los productos de
// origen animal; y 5 g de lípidos en las grasas.
//
// Los equivalentes que calcula la app son una ESTIMACIÓN a partir de los
// ingredientes de cada receta. Un plan real lo arma un nutriólogo con las
// tablas completas; esto sirve para tener una idea del reparto del día y para
// entenderse con quien sí lo arma.

export const GRUPOS_SMAE = [
  { k: 'verdura', nombre: 'Verduras', kcal: 25, prot: 2, gras: 0, carb: 4, color: 'var(--jade)' },
  { k: 'fruta', nombre: 'Frutas', kcal: 60, prot: 0, gras: 0, carb: 15, color: '#C0453A' },
  { k: 'cereal', nombre: 'Cereales sin grasa', kcal: 70, prot: 2, gras: 0, carb: 15, color: 'var(--maiz)' },
  { k: 'cerealGrasa', nombre: 'Cereales con grasa', kcal: 115, prot: 2, gras: 5, carb: 15, color: '#B8791F' },
  { k: 'leguminosa', nombre: 'Leguminosas', kcal: 120, prot: 8, gras: 1, carb: 20, color: '#7A4A3A' },
  { k: 'poaMuyBajo', nombre: 'Origen animal, muy bajo en grasa', kcal: 40, prot: 7, gras: 1, carb: 0, color: 'var(--cobalto-vivo)' },
  { k: 'poaBajo', nombre: 'Origen animal, bajo en grasa', kcal: 55, prot: 7, gras: 3, carb: 0, color: 'var(--cobalto)' },
  { k: 'poaModerado', nombre: 'Origen animal, moderado en grasa', kcal: 75, prot: 7, gras: 5, carb: 0, color: '#24478F' },
  { k: 'poaAlto', nombre: 'Origen animal, alto en grasa', kcal: 100, prot: 7, gras: 8, carb: 0, color: '#152B5C' },
  { k: 'leche', nombre: 'Leche', kcal: 110, prot: 9, gras: 4, carb: 12, color: '#8E9BC4' },
  { k: 'grasa', nombre: 'Aceites y grasas', kcal: 45, prot: 0, gras: 5, carb: 0, color: '#D9A05B' },
  { k: 'grasaProt', nombre: 'Grasas con proteína', kcal: 70, prot: 3, gras: 5, carb: 3, color: '#A8763C' },
  { k: 'azucar', nombre: 'Azúcares', kcal: 40, prot: 0, gras: 0, carb: 10, color: '#8E5B8E' },
];

export const grupoSmae = (k) => GRUPOS_SMAE.find((g) => g.k === k);

// Gramos (o piezas) de cada ingrediente que equivalen a 1 equivalente de su
// grupo. Tomado de las porciones de uso común del sistema.
const eq = (grupo, porEquivalente) => ({ grupo, porEquivalente });

export const EQUIVALENTES_INGREDIENTE = {
  // Verduras — 1 equivalente ronda los 100 g de verdura cocida
  'Jitomate': eq('verdura', 120), 'Jitomate cherry': eq('verdura', 120), 'Cebolla': eq('verdura', 70),
  'Cebolla morada': eq('verdura', 70), 'Chile serrano': eq('verdura', 60), 'Chile poblano': eq('verdura', 100),
  'Tomate verde': eq('verdura', 120), 'Lechuga': eq('verdura', 100), 'Espinaca': eq('verdura', 100),
  'Calabacita': eq('verdura', 100), 'Nopal cocido': eq('verdura', 100), 'Chayote': eq('verdura', 100),
  'Zanahoria': eq('verdura', 80), 'Brócoli': eq('verdura', 100), 'Ejote': eq('verdura', 90),
  'Pimiento': eq('verdura', 100), 'Champiñón': eq('verdura', 100), 'Pepino': eq('verdura', 130),
  'Jícama': eq('verdura', 120), 'Apio': eq('verdura', 120), 'Rábano': eq('verdura', 120),
  'Cilantro': eq('verdura', 200), 'Ajo': eq('verdura', 30), 'Epazote': eq('verdura', 200),
  'Hierbabuena': eq('verdura', 200), 'Aceituna': eq('grasa', 25), 'Alcaparra': eq('verdura', 100),
  'Elote': eq('cereal', 80), 'Elote desgranado': eq('cereal', 80),

  // Frutas
  'Manzana': eq('fruta', 1), 'Plátano': eq('fruta', 0.8), 'Fresa': eq('fruta', 170),
  'Papaya': eq('fruta', 150), 'Melón': eq('fruta', 160), 'Limón': eq('fruta', 3),
  'Naranja agria': eq('fruta', 120), 'Plátano macho': eq('fruta', 70),

  // Cereales y tubérculos
  'Tortilla de maíz': eq('cereal', 1), 'Tostada de maíz': eq('cerealGrasa', 2),
  'Tortilla de harina': eq('cerealGrasa', 0.8), 'Tortilla de harina integral': eq('cerealGrasa', 0.8),
  'Masa de maíz': eq('cereal', 50), 'Bolillo': eq('cereal', 0.5), 'Pan integral': eq('cereal', 1),
  'Arroz': eq('cereal', 25), 'Arroz crudo': eq('cereal', 25), 'Fideo': eq('cereal', 22),
  'Espagueti': eq('cereal', 22), 'Avena en hojuelas': eq('cereal', 22), 'Granola': eq('cerealGrasa', 25),
  'Papa': eq('cereal', 90), 'Maíz pozolero': eq('cereal', 60), 'Maíz palomero': eq('cereal', 20),
  'Harina': eq('cereal', 20), 'Pan molido': eq('cereal', 20), 'Galleta integral': eq('cerealGrasa', 4),
  'Polvo para hornear': eq('cereal', 200),

  // Leguminosas
  'Frijol de la olla': eq('leguminosa', 100), 'Frijol refrito': eq('leguminosa', 70),
  'Frijol negro': eq('leguminosa', 100), 'Frijol bayo': eq('leguminosa', 100),
  'Lenteja': eq('leguminosa', 35), 'Garbanzo cocido': eq('leguminosa', 90),
  'Hummus': eq('grasaProt', 40), 'Chía': eq('grasaProt', 15),

  // Origen animal
  'Pechuga de pollo': eq('poaMuyBajo', 30), 'Pechuga de pollo deshebrada': eq('poaMuyBajo', 30),
  'Muslo de pollo': eq('poaModerado', 35), 'Filete de tilapia': eq('poaMuyBajo', 35),
  'Filete de pescado': eq('poaMuyBajo', 35), 'Filete de atún': eq('poaMuyBajo', 35),
  'Atún en agua': eq('poaMuyBajo', 30), 'Camarón': eq('poaMuyBajo', 35),
  'Bistec de res': eq('poaBajo', 30), 'Milanesa de res': eq('poaBajo', 30),
  'Falda de res': eq('poaModerado', 30), 'Chambarete de res': eq('poaModerado', 30),
  'Carne molida de res': eq('poaModerado', 30), 'Arrachera': eq('poaModerado', 30),
  'Pierna de cerdo': eq('poaModerado', 30), 'Espaldilla de cerdo': eq('poaModerado', 30),
  'Chorizo': eq('poaAlto', 25), 'Tocino': eq('poaAlto', 15), 'Jamón de pavo': eq('poaBajo', 40),
  'Huevo': eq('poaModerado', 1), 'Huevo cocido': eq('poaModerado', 1),
  'Queso fresco': eq('poaBajo', 30), 'Queso panela': eq('poaBajo', 30),
  'Queso Oaxaca': eq('poaModerado', 25), 'Queso manchego': eq('poaAlto', 25),
  'Queso mozzarella': eq('poaModerado', 25), 'Queso rallado': eq('poaAlto', 20),
  'Queso crema': eq('grasa', 15), 'Requesón': eq('poaBajo', 45),

  // Leche
  'Leche': eq('leche', 240), 'Yogur natural': eq('leche', 200),

  // Grasas
  'Aceite': eq('grasa', 5), 'Aceite de oliva': eq('grasa', 5), 'Mantequilla': eq('grasa', 5),
  'Crema': eq('grasa', 15), 'Mayonesa': eq('grasa', 10), 'Aguacate': eq('grasa', 30),
  'Nuez': eq('grasaProt', 12), 'Almendra': eq('grasaProt', 12), 'Crema de cacahuate': eq('grasaProt', 12),

  // Azúcares
  'Miel': eq('azucar', 10), 'Cacao en polvo': eq('azucar', 12),

  // Sin aporte relevante
  'Sal': null, 'Agua': null, 'Canela molida': null, 'Orégano': null, 'Romero': null,
  'Chile de árbol': null, 'Chile guajillo': null, 'Chipotle': null, 'Chile en polvo': null,
  'Achiote': null, 'Flor de jamaica': null, 'Vinagre': null, 'Salsa verde': null,
  'Salsa roja': null, 'Salsa de jitomate': null,
};

// Convierte los ingredientes de una receta a equivalentes por grupo.
export function equivalentesDeReceta(receta, porciones = 1) {
  const cuenta = {};
  if (!receta || !receta.ing) return cuenta;
  for (const g of receta.ing) {
    const info = EQUIVALENTES_INGREDIENTE[g.item];
    if (!info) continue;
    const n = (g.cant * porciones) / info.porEquivalente;
    cuenta[info.grupo] = (cuenta[info.grupo] || 0) + n;
  }
  for (const k of Object.keys(cuenta)) cuenta[k] = Math.round(cuenta[k] * 10) / 10;
  return cuenta;
}

export function sumarEquivalentes(lista) {
  const total = {};
  for (const c of lista) for (const [k, v] of Object.entries(c)) total[k] = (total[k] || 0) + v;
  for (const k of Object.keys(total)) total[k] = Math.round(total[k] * 10) / 10;
  return total;
}

// Cuántos ingredientes de una receta quedaron sin clasificar. Sirve para no
// presentar como exacto un cálculo al que le faltan piezas.
export function coberturaEquivalentes(receta) {
  if (!receta || !receta.ing || !receta.ing.length) return 1;
  const conocidos = receta.ing.filter((g) => EQUIVALENTES_INGREDIENTE[g.item] !== undefined).length;
  return conocidos / receta.ing.length;
}

// ── Macros según la dieta elegida ─────────────────────────────────────────
export function macrosDeDieta({ kcal, peso, dieta, personalizada }) {
  if (!kcal || !peso) return null;
  const d = dietaPorClave(dieta);

  if (d.editable && personalizada && personalizada.prot) {
    const prot = Number(personalizada.prot) || 0;
    const gras = Number(personalizada.gras) || 0;
    const carb = Number(personalizada.carb) || 0;
    return { kcal: Math.round(prot * 4 + gras * 9 + carb * 4), prot, carb, gras, dieta: d.k };
  }

  const prot = Math.round(peso * d.protPorKg);
  const gras = Math.round((kcal * d.grasaPct) / 9);
  const carb = Math.round(Math.max(0, kcal - prot * 4 - gras * 9) / 4);
  return { kcal, prot, carb, gras, dieta: d.k };
}

// Fracción de la energía de un platillo que viene de hidratos.
export const densidadHC = (r) => (r && r.kcal ? (r.carb * 4) / r.kcal : 0);

// Platillos que caben en una dieta, y por qué se descartaron los demás.
export function filtrarPorDieta(recetas, dieta) {
  const d = dietaPorClave(dieta);
  if (d.topeHC >= 1) return { aptas: recetas, descartadas: [] };
  const aptas = [], descartadas = [];
  for (const r of recetas) (densidadHC(r) <= d.topeHC ? aptas : descartadas).push(r);
  return { aptas, descartadas };
}
