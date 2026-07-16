import { hashHex } from "@/lib/data"

export type MateriaLey =
  | "Constitucional"
  | "Administrativa"
  | "Fiscal"
  | "Ambiental"
  | "Civil"
  | "Penal"
  | "Municipal"
  | "Transparencia"
  | "Gobierno Digital"
  | "Derechos Humanos"
  | "Desarrollo Social"
  | "Otra"

export type EstatusLey = "Vigente" | "Reformada" | "Abrogada" | "Histórica"

export type TipoMovimiento =
  | "Publicación original"
  | "Reforma"
  | "Adición"
  | "Derogación"
  | "Fe de erratas"

export interface MovimientoNormativo {
  id: string
  fecha: string // ISO
  numeroPeriodico: string
  tipo: TipoMovimiento
  descripcion: string
  articulos: string
  estatus: "Vigente" | "Superada" | "Aplicada"
  docId?: string
}

export interface VersionArticulo {
  fecha: string
  numeroPeriodico: string
  etiqueta: string // p.ej. "Original", "Reforma 2019"
  texto: string
}

export interface ArticuloLey {
  numero: string // "1", "2 Bis"
  titulo?: string // capítulo / título al que pertenece
  capitulo: string
  texto: string
  reformas: number
  ultimaReforma?: string
  versiones: VersionArticulo[]
}

export interface SeccionLey {
  id: string
  titulo: string // "Título Primero — Disposiciones Generales"
  capitulos: {
    id: string
    titulo: string
    articulos: string[] // números de artículo
  }[]
}

export interface Ley {
  id: string
  nombre: string
  nombreCorto: string
  materia: MateriaLey
  estatus: EstatusLey
  fechaPublicacionOriginal: string
  numeroPeriodicoOriginal: string
  fechaUltimaReforma: string
  numeroReformas: number
  consultas: number
  resumen: string
  hash: string
  selloTiempo: string
  movimientos: MovimientoNormativo[]
  secciones: SeccionLey[]
  articulos: ArticuloLey[]
}

export const MATERIAS: MateriaLey[] = [
  "Constitucional",
  "Administrativa",
  "Fiscal",
  "Ambiental",
  "Civil",
  "Penal",
  "Municipal",
  "Transparencia",
  "Gobierno Digital",
  "Derechos Humanos",
  "Desarrollo Social",
  "Otra",
]

export const ESTATUS_LEY: EstatusLey[] = ["Vigente", "Reformada", "Abrogada", "Histórica"]

export const TIPOS_MOVIMIENTO: TipoMovimiento[] = [
  "Publicación original",
  "Reforma",
  "Adición",
  "Derogación",
  "Fe de erratas",
]

// ---- Generadores de apoyo ----

function genMovimientos(
  semilla: string,
  publicacionOriginal: { fecha: string; periodico: string; desc: string },
  reformas: { fecha: string; periodico: string; tipo: TipoMovimiento; desc: string; articulos: string }[],
): MovimientoNormativo[] {
  const lista: MovimientoNormativo[] = [
    {
      id: `${semilla}-m0`,
      fecha: publicacionOriginal.fecha,
      numeroPeriodico: publicacionOriginal.periodico,
      tipo: "Publicación original",
      descripcion: publicacionOriginal.desc,
      articulos: "Texto íntegro",
      estatus: "Superada",
    },
  ]
  reformas.forEach((r, i) => {
    lista.push({
      id: `${semilla}-m${i + 1}`,
      fecha: r.fecha,
      numeroPeriodico: r.periodico,
      tipo: r.tipo,
      descripcion: r.desc,
      articulos: r.articulos,
      estatus: i === reformas.length - 1 ? "Vigente" : "Aplicada",
    })
  })
  return lista
}

// ---- Catálogo de leyes ----

export const leyes: Ley[] = [
  {
    id: "constitucion-qro",
    nombre: "Constitución Política del Estado Libre y Soberano de Querétaro",
    nombreCorto: "Constitución del Estado de Querétaro",
    materia: "Constitucional",
    estatus: "Vigente",
    fechaPublicacionOriginal: "2008-09-12",
    numeroPeriodicoOriginal: "No. 47, Tomo CXLI",
    fechaUltimaReforma: "2025-11-28",
    numeroReformas: 38,
    consultas: 18420,
    resumen:
      "Norma suprema del Estado de Querétaro que establece la organización de los poderes públicos, los derechos humanos reconocidos y las bases del régimen interior del Estado.",
    hash: hashHex("constitucion-qro"),
    selloTiempo: "2025-11-28T08:00:02-06:00",
    movimientos: genMovimientos(
      "constitucion-qro",
      {
        fecha: "2008-09-12",
        periodico: "No. 47, Tomo CXLI",
        desc: "Publicación íntegra de la Constitución Política del Estado Libre y Soberano de Querétaro.",
      },
      [
        { fecha: "2014-04-04", periodico: "No. 18, Tomo CXLVII", tipo: "Reforma", desc: "Reforma en materia de derechos humanos y armonización con la Constitución Federal.", articulos: "Arts. 2, 3, 27" },
        { fecha: "2019-06-21", periodico: "No. 34, Tomo CLII", tipo: "Adición", desc: "Adición del capítulo de gobierno digital y datos abiertos.", articulos: "Art. 35 Bis" },
        { fecha: "2023-02-17", periodico: "No. 9, Tomo CLVI", tipo: "Reforma", desc: "Reforma al sistema estatal anticorrupción y fiscalización superior.", articulos: "Arts. 31, 32, 38" },
        { fecha: "2024-09-06", periodico: "No. 58, Tomo CLVII", tipo: "Fe de erratas", desc: "Corrección de referencias en el artículo 27 publicado en la reforma anterior.", articulos: "Art. 27" },
        { fecha: "2025-11-28", periodico: "No. 71, Tomo CLVIII", tipo: "Reforma", desc: "Reforma en materia de paridad de género y participación ciudadana.", articulos: "Arts. 7, 18, 20" },
      ],
    ),
    secciones: [
      {
        id: "t1",
        titulo: "Título Primero — De los Derechos Humanos y sus Garantías",
        capitulos: [
          { id: "c1", titulo: "Capítulo I — Disposiciones Generales", articulos: ["1", "2", "3"] },
          { id: "c2", titulo: "Capítulo II — De la Participación Ciudadana", articulos: ["7"] },
        ],
      },
      {
        id: "t2",
        titulo: "Título Segundo — De la Organización del Estado",
        capitulos: [
          { id: "c3", titulo: "Capítulo I — Del Poder Público", articulos: ["18", "20"] },
          { id: "c4", titulo: "Capítulo II — Del Gobierno Digital", articulos: ["35 Bis"] },
        ],
      },
    ],
    articulos: [
      {
        numero: "1",
        capitulo: "Capítulo I — Disposiciones Generales",
        texto:
          "En el Estado de Querétaro todas las personas gozarán de los derechos humanos reconocidos en la Constitución Política de los Estados Unidos Mexicanos, en los tratados internacionales de los que el Estado Mexicano sea parte y en esta Constitución.",
        reformas: 1,
        ultimaReforma: "2014-04-04",
        versiones: [
          { fecha: "2008-09-12", numeroPeriodico: "No. 47, Tomo CXLI", etiqueta: "Original", texto: "En el Estado de Querétaro toda persona goza de las garantías que otorga la Constitución Política de los Estados Unidos Mexicanos y la presente Constitución." },
          { fecha: "2014-04-04", numeroPeriodico: "No. 18, Tomo CXLVII", etiqueta: "Reforma 2014", texto: "En el Estado de Querétaro todas las personas gozarán de los derechos humanos reconocidos en la Constitución Política de los Estados Unidos Mexicanos, en los tratados internacionales de los que el Estado Mexicano sea parte y en esta Constitución." },
        ],
      },
      {
        numero: "7",
        capitulo: "Capítulo II — De la Participación Ciudadana",
        texto:
          "El Estado garantizará los mecanismos de participación ciudadana, asegurando la paridad de género en la integración de los órganos de representación y consulta.",
        reformas: 1,
        ultimaReforma: "2025-11-28",
        versiones: [
          { fecha: "2008-09-12", numeroPeriodico: "No. 47, Tomo CXLI", etiqueta: "Original", texto: "El Estado promoverá la participación de los ciudadanos en los asuntos públicos en los términos que señalen las leyes." },
          { fecha: "2025-11-28", numeroPeriodico: "No. 71, Tomo CLVIII", etiqueta: "Reforma 2025", texto: "El Estado garantizará los mecanismos de participación ciudadana, asegurando la paridad de género en la integración de los órganos de representación y consulta." },
        ],
      },
      {
        numero: "35 Bis",
        capitulo: "Capítulo II — Del Gobierno Digital",
        texto:
          "El Estado impulsará el gobierno digital, la interoperabilidad de los sistemas públicos y el uso de la Firma Electrónica Avanzada para la validez de los actos administrativos.",
        reformas: 0,
        ultimaReforma: "2019-06-21",
        versiones: [
          { fecha: "2019-06-21", numeroPeriodico: "No. 34, Tomo CLII", etiqueta: "Adición 2019", texto: "El Estado impulsará el gobierno digital, la interoperabilidad de los sistemas públicos y el uso de la Firma Electrónica Avanzada para la validez de los actos administrativos." },
        ],
      },
    ],
  },
  {
    id: "codigo-ambiental-qro",
    nombre: "Código Ambiental del Estado de Querétaro",
    nombreCorto: "Código Ambiental",
    materia: "Ambiental",
    estatus: "Vigente",
    fechaPublicacionOriginal: "2012-08-31",
    numeroPeriodicoOriginal: "No. 45, Tomo CXLV",
    fechaUltimaReforma: "2025-03-14",
    numeroReformas: 19,
    consultas: 7240,
    resumen:
      "Regula la protección, conservación y restauración del ambiente, así como el desarrollo sustentable en el territorio del Estado de Querétaro.",
    hash: hashHex("codigo-ambiental-qro"),
    selloTiempo: "2025-03-14T08:00:02-06:00",
    movimientos: genMovimientos(
      "codigo-ambiental-qro",
      { fecha: "2012-08-31", periodico: "No. 45, Tomo CXLV", desc: "Publicación íntegra del Código Ambiental del Estado de Querétaro." },
      [
        { fecha: "2016-11-18", periodico: "No. 66, Tomo CXLIX", tipo: "Reforma", desc: "Reforma en materia de gestión integral de residuos.", articulos: "Arts. 110-118" },
        { fecha: "2020-07-10", periodico: "No. 41, Tomo CLIII", tipo: "Adición", desc: "Adición del título de cambio climático y emisiones.", articulos: "Arts. 201-210" },
        { fecha: "2025-03-14", periodico: "No. 15, Tomo CLVIII", tipo: "Reforma", desc: "Actualización de criterios de evaluación de impacto ambiental.", articulos: "Arts. 54, 55, 56" },
      ],
    ),
    secciones: [
      {
        id: "t1",
        titulo: "Título Primero — Disposiciones Generales",
        capitulos: [{ id: "c1", titulo: "Capítulo Único — Objeto y Definiciones", articulos: ["1", "2"] }],
      },
      {
        id: "t2",
        titulo: "Título Segundo — Evaluación de Impacto Ambiental",
        capitulos: [{ id: "c2", titulo: "Capítulo I — Procedimiento", articulos: ["54", "55"] }],
      },
    ],
    articulos: [
      {
        numero: "1",
        capitulo: "Capítulo Único — Objeto y Definiciones",
        texto: "El presente Código tiene por objeto la preservación y restauración del equilibrio ecológico, así como la protección del ambiente en el Estado de Querétaro.",
        reformas: 0,
        ultimaReforma: "2012-08-31",
        versiones: [
          { fecha: "2012-08-31", numeroPeriodico: "No. 45, Tomo CXLV", etiqueta: "Original", texto: "El presente Código tiene por objeto la preservación y restauración del equilibrio ecológico, así como la protección del ambiente en el Estado de Querétaro." },
        ],
      },
      {
        numero: "54",
        capitulo: "Capítulo I — Procedimiento",
        texto: "Las obras o actividades que puedan causar desequilibrio ecológico requerirán autorización previa en materia de impacto ambiental, conforme a los criterios técnicos vigentes y a la manifestación correspondiente.",
        reformas: 1,
        ultimaReforma: "2025-03-14",
        versiones: [
          { fecha: "2012-08-31", numeroPeriodico: "No. 45, Tomo CXLV", etiqueta: "Original", texto: "Las obras o actividades que puedan causar desequilibrio ecológico requerirán autorización previa en materia de impacto ambiental." },
          { fecha: "2025-03-14", numeroPeriodico: "No. 15, Tomo CLVIII", etiqueta: "Reforma 2025", texto: "Las obras o actividades que puedan causar desequilibrio ecológico requerirán autorización previa en materia de impacto ambiental, conforme a los criterios técnicos vigentes y a la manifestación correspondiente." },
        ],
      },
    ],
  },
  {
    id: "codigo-civil-qro",
    nombre: "Código Civil del Estado de Querétaro",
    nombreCorto: "Código Civil",
    materia: "Civil",
    estatus: "Vigente",
    fechaPublicacionOriginal: "2009-12-15",
    numeroPeriodicoOriginal: "No. 72, Tomo CXLII",
    fechaUltimaReforma: "2024-10-25",
    numeroReformas: 27,
    consultas: 12880,
    resumen:
      "Regula las relaciones jurídicas de las personas, la familia, los bienes, las sucesiones y las obligaciones en el ámbito del derecho privado en el Estado.",
    hash: hashHex("codigo-civil-qro"),
    selloTiempo: "2024-10-25T08:00:02-06:00",
    movimientos: genMovimientos(
      "codigo-civil-qro",
      { fecha: "2009-12-15", periodico: "No. 72, Tomo CXLII", desc: "Publicación íntegra del Código Civil del Estado de Querétaro." },
      [
        { fecha: "2017-05-19", periodico: "No. 28, Tomo CL", tipo: "Reforma", desc: "Reforma en materia de matrimonio igualitario.", articulos: "Arts. 138, 139" },
        { fecha: "2024-10-25", periodico: "No. 66, Tomo CLVII", tipo: "Reforma", desc: "Actualización del régimen patrimonial del matrimonio.", articulos: "Arts. 165-170" },
      ],
    ),
    secciones: [
      {
        id: "t1",
        titulo: "Libro Primero — De las Personas",
        capitulos: [{ id: "c1", titulo: "Capítulo I — Disposiciones Preliminares", articulos: ["1"] }],
      },
      {
        id: "t2",
        titulo: "Libro Segundo — Del Matrimonio",
        capitulos: [{ id: "c2", titulo: "Capítulo I — Del Matrimonio", articulos: ["138"] }],
      },
    ],
    articulos: [
      {
        numero: "1",
        capitulo: "Capítulo I — Disposiciones Preliminares",
        texto: "Las disposiciones de este Código regirán en el Estado de Querétaro y obligan a todos sus habitantes, sean nacionales o extranjeros.",
        reformas: 0,
        ultimaReforma: "2009-12-15",
        versiones: [
          { fecha: "2009-12-15", numeroPeriodico: "No. 72, Tomo CXLII", etiqueta: "Original", texto: "Las disposiciones de este Código regirán en el Estado de Querétaro y obligan a todos sus habitantes, sean nacionales o extranjeros." },
        ],
      },
      {
        numero: "138",
        capitulo: "Capítulo I — Del Matrimonio",
        texto: "El matrimonio es la unión libre de dos personas para realizar la comunidad de vida, en donde ambas se procuran respeto, igualdad y ayuda mutua.",
        reformas: 1,
        ultimaReforma: "2017-05-19",
        versiones: [
          { fecha: "2009-12-15", numeroPeriodico: "No. 72, Tomo CXLII", etiqueta: "Original", texto: "El matrimonio es la unión de un solo hombre y una sola mujer para realizar la comunidad de vida." },
          { fecha: "2017-05-19", numeroPeriodico: "No. 28, Tomo CL", etiqueta: "Reforma 2017", texto: "El matrimonio es la unión libre de dos personas para realizar la comunidad de vida, en donde ambas se procuran respeto, igualdad y ayuda mutua." },
        ],
      },
    ],
  },
  {
    id: "codigo-fiscal-qro",
    nombre: "Código Fiscal del Estado de Querétaro",
    nombreCorto: "Código Fiscal",
    materia: "Fiscal",
    estatus: "Vigente",
    fechaPublicacionOriginal: "2011-01-21",
    numeroPeriodicoOriginal: "No. 4, Tomo CXLIV",
    fechaUltimaReforma: "2025-12-20",
    numeroReformas: 31,
    consultas: 9510,
    resumen:
      "Establece las disposiciones aplicables a las contribuciones estatales, los procedimientos de recaudación, los derechos de los contribuyentes y las facultades de la autoridad fiscal.",
    hash: hashHex("codigo-fiscal-qro"),
    selloTiempo: "2025-12-20T08:00:02-06:00",
    movimientos: genMovimientos(
      "codigo-fiscal-qro",
      { fecha: "2011-01-21", periodico: "No. 4, Tomo CXLIV", desc: "Publicación íntegra del Código Fiscal del Estado de Querétaro." },
      [
        { fecha: "2018-12-28", periodico: "No. 88, Tomo CLI", tipo: "Reforma", desc: "Reforma de la miscelánea fiscal estatal 2019.", articulos: "Arts. 30-45" },
        { fecha: "2022-12-23", periodico: "No. 90, Tomo CLV", tipo: "Reforma", desc: "Incorporación de medios electrónicos de pago y notificación.", articulos: "Arts. 12, 13, 14" },
        { fecha: "2025-12-20", periodico: "No. 78, Tomo CLVIII", tipo: "Reforma", desc: "Actualización de tasas y procedimientos para el ejercicio 2026.", articulos: "Arts. 50-58" },
      ],
    ),
    secciones: [
      { id: "t1", titulo: "Título Primero — Disposiciones Generales", capitulos: [{ id: "c1", titulo: "Capítulo I — De las Contribuciones", articulos: ["1", "12"] }] },
    ],
    articulos: [
      {
        numero: "1",
        capitulo: "Capítulo I — De las Contribuciones",
        texto: "Las personas físicas y morales están obligadas a contribuir para los gastos públicos del Estado conforme a las leyes fiscales respectivas.",
        reformas: 0,
        ultimaReforma: "2011-01-21",
        versiones: [
          { fecha: "2011-01-21", numeroPeriodico: "No. 4, Tomo CXLIV", etiqueta: "Original", texto: "Las personas físicas y morales están obligadas a contribuir para los gastos públicos del Estado conforme a las leyes fiscales respectivas." },
        ],
      },
      {
        numero: "12",
        capitulo: "Capítulo I — De las Contribuciones",
        texto: "Las promociones y notificaciones ante la autoridad fiscal podrán realizarse a través de medios electrónicos, utilizando la Firma Electrónica Avanzada con plena validez jurídica.",
        reformas: 1,
        ultimaReforma: "2022-12-23",
        versiones: [
          { fecha: "2011-01-21", numeroPeriodico: "No. 4, Tomo CXLIV", etiqueta: "Original", texto: "Las promociones ante la autoridad fiscal deberán presentarse por escrito en las oficinas correspondientes." },
          { fecha: "2022-12-23", numeroPeriodico: "No. 90, Tomo CLV", etiqueta: "Reforma 2022", texto: "Las promociones y notificaciones ante la autoridad fiscal podrán realizarse a través de medios electrónicos, utilizando la Firma Electrónica Avanzada con plena validez jurídica." },
        ],
      },
    ],
  },
  {
    id: "codigo-penal-qro",
    nombre: "Código Penal para el Estado de Querétaro",
    nombreCorto: "Código Penal",
    materia: "Penal",
    estatus: "Vigente",
    fechaPublicacionOriginal: "2010-06-23",
    numeroPeriodicoOriginal: "No. 35, Tomo CXLIII",
    fechaUltimaReforma: "2025-08-08",
    numeroReformas: 24,
    consultas: 15330,
    resumen:
      "Define los delitos y las penas aplicables en el Estado de Querétaro, así como las reglas generales de la responsabilidad penal.",
    hash: hashHex("codigo-penal-qro"),
    selloTiempo: "2025-08-08T08:00:02-06:00",
    movimientos: genMovimientos(
      "codigo-penal-qro",
      { fecha: "2010-06-23", periodico: "No. 35, Tomo CXLIII", desc: "Publicación íntegra del Código Penal para el Estado de Querétaro." },
      [
        { fecha: "2019-03-15", periodico: "No. 14, Tomo CLII", tipo: "Adición", desc: "Adición del delito de violencia digital.", articulos: "Art. 167 Bis" },
        { fecha: "2025-08-08", periodico: "No. 49, Tomo CLVIII", tipo: "Reforma", desc: "Reforma en materia de combate a la extorsión.", articulos: "Arts. 195, 196" },
      ],
    ),
    secciones: [
      { id: "t1", titulo: "Libro Primero — Parte General", capitulos: [{ id: "c1", titulo: "Capítulo I — Aplicación de la Ley Penal", articulos: ["1"] }] },
      { id: "t2", titulo: "Libro Segundo — Parte Especial", capitulos: [{ id: "c2", titulo: "Capítulo — Delitos contra la Intimidad", articulos: ["167 Bis"] }] },
    ],
    articulos: [
      {
        numero: "1",
        capitulo: "Capítulo I — Aplicación de la Ley Penal",
        texto: "Este Código se aplicará a los delitos del orden común que se cometan en el territorio del Estado de Querétaro.",
        reformas: 0,
        ultimaReforma: "2010-06-23",
        versiones: [
          { fecha: "2010-06-23", numeroPeriodico: "No. 35, Tomo CXLIII", etiqueta: "Original", texto: "Este Código se aplicará a los delitos del orden común que se cometan en el territorio del Estado de Querétaro." },
        ],
      },
      {
        numero: "167 Bis",
        capitulo: "Capítulo — Delitos contra la Intimidad",
        texto: "Comete el delito de violencia digital quien divulgue, comparta o publique imágenes o videos de contenido íntimo sexual de una persona sin su consentimiento, a través de medios electrónicos.",
        reformas: 0,
        ultimaReforma: "2019-03-15",
        versiones: [
          { fecha: "2019-03-15", numeroPeriodico: "No. 14, Tomo CLII", etiqueta: "Adición 2019", texto: "Comete el delito de violencia digital quien divulgue, comparta o publique imágenes o videos de contenido íntimo sexual de una persona sin su consentimiento, a través de medios electrónicos." },
        ],
      },
    ],
  },
  {
    id: "ley-firma-electronica-qro",
    nombre: "Ley de Firma Electrónica Avanzada para el Estado de Querétaro",
    nombreCorto: "Ley de Firma Electrónica Avanzada",
    materia: "Gobierno Digital",
    estatus: "Vigente",
    fechaPublicacionOriginal: "2014-11-07",
    numeroPeriodicoOriginal: "No. 62, Tomo CXLVII",
    fechaUltimaReforma: "2024-06-14",
    numeroReformas: 8,
    consultas: 6120,
    resumen:
      "Regula el uso de la Firma Electrónica Avanzada (qFirma) en los actos y procedimientos de los poderes y entes públicos del Estado, otorgándole plena validez jurídica.",
    hash: hashHex("ley-firma-electronica-qro"),
    selloTiempo: "2024-06-14T08:00:02-06:00",
    movimientos: genMovimientos(
      "ley-firma-electronica-qro",
      { fecha: "2014-11-07", periodico: "No. 62, Tomo CXLVII", desc: "Publicación íntegra de la Ley de Firma Electrónica Avanzada para el Estado de Querétaro." },
      [
        { fecha: "2020-09-25", periodico: "No. 55, Tomo CLIII", tipo: "Reforma", desc: "Ampliación del uso de la qFirma a trámites ciudadanos.", articulos: "Arts. 5, 6" },
        { fecha: "2024-06-14", periodico: "No. 38, Tomo CLVII", tipo: "Adición", desc: "Adición de la cadena de confianza y sello de tiempo verificable.", articulos: "Art. 14 Bis" },
      ],
    ),
    secciones: [
      { id: "t1", titulo: "Título Primero — Disposiciones Generales", capitulos: [{ id: "c1", titulo: "Capítulo I — Objeto y Definiciones", articulos: ["1", "5"] }] },
      { id: "t2", titulo: "Título Segundo — De la Validez", capitulos: [{ id: "c2", titulo: "Capítulo I — Efectos Jurídicos", articulos: ["14 Bis"] }] },
    ],
    articulos: [
      {
        numero: "1",
        capitulo: "Capítulo I — Objeto y Definiciones",
        texto: "La presente Ley tiene por objeto regular el uso de la Firma Electrónica Avanzada en los actos, trámites y procedimientos de los entes públicos del Estado de Querétaro.",
        reformas: 0,
        ultimaReforma: "2014-11-07",
        versiones: [
          { fecha: "2014-11-07", numeroPeriodico: "No. 62, Tomo CXLVII", etiqueta: "Original", texto: "La presente Ley tiene por objeto regular el uso de la Firma Electrónica Avanzada en los actos, trámites y procedimientos de los entes públicos del Estado de Querétaro." },
        ],
      },
      {
        numero: "14 Bis",
        capitulo: "Capítulo I — Efectos Jurídicos",
        texto: "Los documentos firmados electrónicamente contarán con una cadena de confianza, hash criptográfico y sello de tiempo que permitirán su verificación pública e inalterabilidad.",
        reformas: 0,
        ultimaReforma: "2024-06-14",
        versiones: [
          { fecha: "2024-06-14", numeroPeriodico: "No. 38, Tomo CLVII", etiqueta: "Adición 2024", texto: "Los documentos firmados electrónicamente contarán con una cadena de confianza, hash criptográfico y sello de tiempo que permitirán su verificación pública e inalterabilidad." },
        ],
      },
    ],
  },
  {
    id: "ley-archivos-qro",
    nombre: "Ley de Archivos del Estado de Querétaro",
    nombreCorto: "Ley de Archivos",
    materia: "Transparencia",
    estatus: "Vigente",
    fechaPublicacionOriginal: "2019-07-19",
    numeroPeriodicoOriginal: "No. 42, Tomo CLII",
    fechaUltimaReforma: "2023-11-10",
    numeroReformas: 5,
    consultas: 3980,
    resumen:
      "Establece los principios y bases para la organización, conservación, administración y preservación de los archivos en posesión de los sujetos obligados del Estado.",
    hash: hashHex("ley-archivos-qro"),
    selloTiempo: "2023-11-10T08:00:02-06:00",
    movimientos: genMovimientos(
      "ley-archivos-qro",
      { fecha: "2019-07-19", periodico: "No. 42, Tomo CLII", desc: "Publicación íntegra de la Ley de Archivos del Estado de Querétaro." },
      [
        { fecha: "2023-11-10", periodico: "No. 70, Tomo CLVI", tipo: "Reforma", desc: "Reforma para la digitalización y archivos electrónicos.", articulos: "Arts. 40, 41" },
      ],
    ),
    secciones: [
      { id: "t1", titulo: "Título Primero — Disposiciones Generales", capitulos: [{ id: "c1", titulo: "Capítulo I — Objeto", articulos: ["1"] }] },
      { id: "t2", titulo: "Título Segundo — Archivos Electrónicos", capitulos: [{ id: "c2", titulo: "Capítulo I — Digitalización", articulos: ["40"] }] },
    ],
    articulos: [
      {
        numero: "1",
        capitulo: "Capítulo I — Objeto",
        texto: "La presente Ley tiene por objeto establecer las bases de organización y funcionamiento del Sistema Estatal de Archivos.",
        reformas: 0,
        ultimaReforma: "2019-07-19",
        versiones: [
          { fecha: "2019-07-19", numeroPeriodico: "No. 42, Tomo CLII", etiqueta: "Original", texto: "La presente Ley tiene por objeto establecer las bases de organización y funcionamiento del Sistema Estatal de Archivos." },
        ],
      },
      {
        numero: "40",
        capitulo: "Capítulo I — Digitalización",
        texto: "Los sujetos obligados podrán digitalizar sus archivos garantizando la integridad, autenticidad y disponibilidad de los documentos mediante mecanismos de firma y sello de tiempo.",
        reformas: 1,
        ultimaReforma: "2023-11-10",
        versiones: [
          { fecha: "2019-07-19", numeroPeriodico: "No. 42, Tomo CLII", etiqueta: "Original", texto: "Los sujetos obligados podrán digitalizar sus archivos conforme a los lineamientos que se emitan." },
          { fecha: "2023-11-10", numeroPeriodico: "No. 70, Tomo CLVI", etiqueta: "Reforma 2023", texto: "Los sujetos obligados podrán digitalizar sus archivos garantizando la integridad, autenticidad y disponibilidad de los documentos mediante mecanismos de firma y sello de tiempo." },
        ],
      },
    ],
  },
  {
    id: "ley-derechos-humanos-qro",
    nombre: "Ley de Derechos Humanos del Estado de Querétaro",
    nombreCorto: "Ley de Derechos Humanos",
    materia: "Derechos Humanos",
    estatus: "Vigente",
    fechaPublicacionOriginal: "2016-02-12",
    numeroPeriodicoOriginal: "No. 8, Tomo CXLIX",
    fechaUltimaReforma: "2024-12-06",
    numeroReformas: 11,
    consultas: 5470,
    resumen:
      "Regula la protección, promoción y garantía de los derechos humanos en el Estado y establece las atribuciones de la Defensoría de los Derechos Humanos de Querétaro.",
    hash: hashHex("ley-derechos-humanos-qro"),
    selloTiempo: "2024-12-06T08:00:02-06:00",
    movimientos: genMovimientos(
      "ley-derechos-humanos-qro",
      { fecha: "2016-02-12", periodico: "No. 8, Tomo CXLIX", desc: "Publicación íntegra de la Ley de Derechos Humanos del Estado de Querétaro." },
      [
        { fecha: "2021-08-20", periodico: "No. 48, Tomo CLIV", tipo: "Adición", desc: "Adición del enfoque de igualdad y no discriminación.", articulos: "Art. 4 Bis" },
        { fecha: "2024-12-06", periodico: "No. 75, Tomo CLVII", tipo: "Reforma", desc: "Fortalecimiento de las recomendaciones de la Defensoría.", articulos: "Arts. 60, 61" },
      ],
    ),
    secciones: [
      { id: "t1", titulo: "Título Primero — Disposiciones Generales", capitulos: [{ id: "c1", titulo: "Capítulo I — Objeto y Principios", articulos: ["1", "4 Bis"] }] },
    ],
    articulos: [
      {
        numero: "1",
        capitulo: "Capítulo I — Objeto y Principios",
        texto: "La presente Ley tiene por objeto la protección, observancia, promoción, estudio y divulgación de los derechos humanos en el Estado de Querétaro.",
        reformas: 0,
        ultimaReforma: "2016-02-12",
        versiones: [
          { fecha: "2016-02-12", numeroPeriodico: "No. 8, Tomo CXLIX", etiqueta: "Original", texto: "La presente Ley tiene por objeto la protección, observancia, promoción, estudio y divulgación de los derechos humanos en el Estado de Querétaro." },
        ],
      },
      {
        numero: "4 Bis",
        capitulo: "Capítulo I — Objeto y Principios",
        texto: "Todas las autoridades estatales y municipales deberán garantizar el principio de igualdad y no discriminación en el ejercicio de sus funciones.",
        reformas: 0,
        ultimaReforma: "2021-08-20",
        versiones: [
          { fecha: "2021-08-20", numeroPeriodico: "No. 48, Tomo CLIV", etiqueta: "Adición 2021", texto: "Todas las autoridades estatales y municipales deberán garantizar el principio de igualdad y no discriminación en el ejercicio de sus funciones." },
        ],
      },
    ],
  },
]

export function getLey(id: string): Ley | undefined {
  return leyes.find((l) => l.id === id)
}

export function getArticulo(ley: Ley, numero: string): ArticuloLey | undefined {
  return ley.articulos.find((a) => a.numero === numero)
}

export function materiaColor(materia: MateriaLey): string {
  // tono sobrio basado en tokens; se mantiene consistente
  return "bg-secondary text-secondary-foreground border-foreground/15"
}

export function estatusLeyColor(estatus: EstatusLey): string {
  switch (estatus) {
    case "Vigente":
      return "bg-primary text-primary-foreground border-primary"
    case "Reformada":
      return "bg-foreground/10 text-foreground border-foreground/25"
    case "Abrogada":
      return "bg-transparent text-muted-foreground border-border line-through"
    case "Histórica":
      return "bg-muted text-foreground border-border"
    default:
      return "bg-muted text-foreground border-border"
  }
}

export function tipoMovimientoColor(tipo: TipoMovimiento): string {
  switch (tipo) {
    case "Publicación original":
      return "bg-primary text-primary-foreground border-primary"
    case "Reforma":
      return "bg-foreground/10 text-foreground border-foreground/30"
    case "Adición":
      return "bg-secondary text-secondary-foreground border-foreground/20"
    case "Derogación":
      return "bg-transparent text-foreground border-foreground/40"
    case "Fe de erratas":
      return "bg-muted text-muted-foreground border-border"
    default:
      return "bg-muted text-foreground border-border"
  }
}
