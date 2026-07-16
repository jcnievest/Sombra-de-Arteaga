export type EstatusInterno =
  | "Recibido"
  | "En revisión"
  | "Observado"
  | "Validado"
  | "Programado"
  | "Publicado"

export type TipoActo =
  | "Decreto"
  | "Acuerdo"
  | "Reglamento"
  | "Convocatoria"
  | "Aviso"
  | "Ley"
  | "Norma Técnica"

export interface DocumentoOficial {
  id: string
  folio: string
  titulo: string
  dependencia: string
  municipio: string
  tipo: TipoActo
  numeroPeriodico: string
  fechaPublicacion: string
  horaPublicacion: string
  hash: string
  firmante: string
  cargoFirmante: string
  paginas: number
  resumen: string
}

export interface EventoHistorial {
  fecha: string
  hora: string
  evento: string
  actor: string
}

export interface SolicitudPublicacion {
  folio: string
  dependencia: string
  documento: string
  tipo: TipoActo
  fechaRecepcion: string
  estatus: EstatusInterno
  responsable: string
  fechaProgramada?: string
  municipio: string
  solicitante: string
  cargoSolicitante: string
  paginas: number
  fundamento: string
  resumen: string
  observaciones: string[]
  historial: EventoHistorial[]
}

export const dependencias = [
  "Secretaría de Gobierno",
  "Secretaría de Finanzas",
  "Secretaría de Desarrollo Urbano",
  "Secretaría de Salud",
  "Poder Legislativo del Estado",
  "Tribunal Superior de Justicia",
  "Instituto Electoral del Estado",
  "Municipio de Querétaro",
]

export const municipios = [
  "Querétaro",
  "El Marqués",
  "Corregidora",
  "San Juan del Río",
  "Tequisquiapan",
  "Cadereyta de Montes",
  "Pedro Escobedo",
  "Amealco de Bonfil",
]

export const tiposActo: TipoActo[] = [
  "Decreto",
  "Acuerdo",
  "Reglamento",
  "Convocatoria",
  "Aviso",
  "Ley",
  "Norma Técnica",
]

export const documentos: DocumentoOficial[] = [
  {
    id: "doc-1",
    folio: "POEQ-2026-00481",
    titulo:
      "Decreto por el que se reforman diversas disposiciones de la Ley de Hacienda del Estado de Querétaro",
    dependencia: "Poder Legislativo del Estado",
    municipio: "Querétaro",
    tipo: "Decreto",
    numeroPeriodico: "No. 42, Tomo CLIX",
    fechaPublicacion: "2026-06-12",
    horaPublicacion: "08:00",
    hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    firmante: "Lic. María Fernanda Reyes Olvera",
    cargoFirmante: "Secretaria de Gobierno",
    paginas: 14,
    resumen:
      "Reforma fiscal que actualiza las disposiciones de la Ley de Hacienda estatal en materia de contribuciones y obligaciones tributarias para el ejercicio 2026.",
  },
  {
    id: "doc-2",
    folio: "POEQ-2026-00480",
    titulo:
      "Acuerdo de coordinación en materia de protección civil para el periodo de estiaje 2026",
    dependencia: "Secretaría de Gobierno",
    municipio: "El Marqués",
    tipo: "Acuerdo",
    numeroPeriodico: "No. 42, Tomo CLIX",
    fechaPublicacion: "2026-06-12",
    horaPublicacion: "08:00",
    hash: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    firmante: "Ing. Carlos Alberto Mendoza Ruiz",
    cargoFirmante: "Coordinador Estatal de Protección Civil",
    paginas: 6,
    resumen:
      "Establece los mecanismos de coordinación interinstitucional para la prevención y atención de contingencias durante la temporada de estiaje.",
  },
  {
    id: "doc-3",
    folio: "POEQ-2026-00478",
    titulo:
      "Reglamento de Zonificación y Usos de Suelo del Municipio de Corregidora",
    dependencia: "Secretaría de Desarrollo Urbano",
    municipio: "Corregidora",
    tipo: "Reglamento",
    numeroPeriodico: "No. 41, Tomo CLIX",
    fechaPublicacion: "2026-06-05",
    horaPublicacion: "08:00",
    hash: "486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7",
    firmante: "Arq. Sofía Granados Lemus",
    cargoFirmante: "Secretaria de Desarrollo Urbano",
    paginas: 28,
    resumen:
      "Actualiza la normativa de uso de suelo, densidades y compatibilidades urbanas para el ordenamiento territorial del municipio de Corregidora.",
  },
  {
    id: "doc-4",
    folio: "POEQ-2026-00475",
    titulo:
      "Convocatoria pública para la asignación de plazas docentes del nivel medio superior",
    dependencia: "Secretaría de Salud",
    municipio: "San Juan del Río",
    tipo: "Convocatoria",
    numeroPeriodico: "No. 41, Tomo CLIX",
    fechaPublicacion: "2026-06-05",
    horaPublicacion: "08:00",
    hash: "c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646",
    firmante: "Dra. Ana Lucía Pérez Tovar",
    cargoFirmante: "Directora de Recursos Humanos",
    paginas: 9,
    resumen:
      "Bases y requisitos para participar en el proceso de asignación de plazas docentes mediante concurso de oposición.",
  },
  {
    id: "doc-5",
    folio: "POEQ-2026-00470",
    titulo:
      "Aviso de deslinde de terrenos nacionales en la región de Cadereyta de Montes",
    dependencia: "Municipio de Querétaro",
    municipio: "Cadereyta de Montes",
    tipo: "Aviso",
    numeroPeriodico: "No. 40, Tomo CLIX",
    fechaPublicacion: "2026-05-29",
    horaPublicacion: "08:00",
    hash: "fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9",
    firmante: "Lic. Roberto Jiménez Salas",
    cargoFirmante: "Director de Patrimonio Estatal",
    paginas: 3,
    resumen:
      "Notificación oficial del procedimiento de deslinde de terrenos nacionales para efectos de regularización de la propiedad.",
  },
  {
    id: "doc-6",
    folio: "POEQ-2026-00468",
    titulo:
      "Norma Técnica para la gestión integral de residuos sólidos urbanos",
    dependencia: "Secretaría de Finanzas",
    municipio: "Tequisquiapan",
    tipo: "Norma Técnica",
    numeroPeriodico: "No. 40, Tomo CLIX",
    fechaPublicacion: "2026-05-29",
    horaPublicacion: "08:00",
    hash: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
    firmante: "M.C. Diego Salinas Vega",
    cargoFirmante: "Director de Medio Ambiente",
    paginas: 22,
    resumen:
      "Establece los lineamientos técnicos para el manejo, recolección, transporte y disposición final de residuos sólidos urbanos.",
  },
]

export const solicitudes: SolicitudPublicacion[] = [
  {
    folio: "SOL-2026-1042",
    dependencia: "Poder Legislativo del Estado",
    documento: "Decreto de reforma a la Ley de Hacienda del Estado",
    tipo: "Decreto",
    fechaRecepcion: "2026-06-09",
    estatus: "Publicado",
    responsable: "M. Fernanda Reyes",
    fechaProgramada: "2026-06-12",
    municipio: "Querétaro",
    solicitante: "Dip. Jorge Luis Contreras Vázquez",
    cargoSolicitante: "Presidente de la Mesa Directiva",
    paginas: 14,
    fundamento:
      "Artículos 19 y 20 de la Ley del Periódico Oficial del Gobierno del Estado de Querétaro 'La Sombra de Arteaga'.",
    resumen:
      "Reforma fiscal que actualiza las disposiciones de la Ley de Hacienda estatal en materia de contribuciones para el ejercicio 2026.",
    observaciones: [],
    historial: [
      { fecha: "2026-06-09", hora: "09:14", evento: "Solicitud recibida en ventanilla electrónica", actor: "Sistema" },
      { fecha: "2026-06-09", hora: "11:30", evento: "Asignada a revisión jurídica", actor: "M. Fernanda Reyes" },
      { fecha: "2026-06-10", hora: "16:05", evento: "Validada para publicación", actor: "M. Fernanda Reyes" },
      { fecha: "2026-06-11", hora: "10:00", evento: "Programada en edición No. 42", actor: "Coordinación Editorial" },
      { fecha: "2026-06-12", hora: "08:00", evento: "Publicada en el Periódico Oficial", actor: "Sistema" },
    ],
  },
  {
    folio: "SOL-2026-1051",
    dependencia: "Secretaría de Desarrollo Urbano",
    documento: "Reglamento de Zonificación de Corregidora",
    tipo: "Reglamento",
    fechaRecepcion: "2026-06-10",
    estatus: "Programado",
    responsable: "J. Ramírez",
    fechaProgramada: "2026-06-19",
    municipio: "Corregidora",
    solicitante: "Arq. Sofía Granados Lemus",
    cargoSolicitante: "Secretaria de Desarrollo Urbano",
    paginas: 28,
    fundamento:
      "Artículo 21 de la Ley del Periódico Oficial y Ley de Asentamientos Humanos del Estado de Querétaro.",
    resumen:
      "Actualiza la normativa de uso de suelo, densidades y compatibilidades urbanas para el ordenamiento territorial del municipio de Corregidora.",
    observaciones: [],
    historial: [
      { fecha: "2026-06-10", hora: "08:42", evento: "Solicitud recibida en ventanilla electrónica", actor: "Sistema" },
      { fecha: "2026-06-10", hora: "13:20", evento: "Asignada a J. Ramírez", actor: "Coordinación Editorial" },
      { fecha: "2026-06-12", hora: "17:48", evento: "Validada para publicación", actor: "J. Ramírez" },
      { fecha: "2026-06-13", hora: "09:15", evento: "Programada en edición No. 43", actor: "Coordinación Editorial" },
    ],
  },
  {
    folio: "SOL-2026-1058",
    dependencia: "Secretaría de Salud",
    documento: "Convocatoria de plazas docentes 2026",
    tipo: "Convocatoria",
    fechaRecepcion: "2026-06-11",
    estatus: "Validado",
    responsable: "A. Pérez",
    municipio: "San Juan del Río",
    solicitante: "Dra. Ana Lucía Pérez Tovar",
    cargoSolicitante: "Directora de Recursos Humanos",
    paginas: 9,
    fundamento:
      "Artículo 19 de la Ley del Periódico Oficial y bases del concurso de oposición vigente.",
    resumen:
      "Bases y requisitos para participar en el proceso de asignación de plazas docentes mediante concurso de oposición.",
    observaciones: [],
    historial: [
      { fecha: "2026-06-11", hora: "10:05", evento: "Solicitud recibida en ventanilla electrónica", actor: "Sistema" },
      { fecha: "2026-06-11", hora: "15:40", evento: "Asignada a A. Pérez", actor: "Coordinación Editorial" },
      { fecha: "2026-06-13", hora: "12:22", evento: "Validada, lista para programar", actor: "A. Pérez" },
    ],
  },
  {
    folio: "SOL-2026-1063",
    dependencia: "Municipio de Querétaro",
    documento: "Acuerdo de cabildo sobre tarifas de agua potable",
    tipo: "Acuerdo",
    fechaRecepcion: "2026-06-12",
    estatus: "Observado",
    responsable: "R. Jiménez",
    municipio: "Querétaro",
    solicitante: "Lic. Roberto Jiménez Salas",
    cargoSolicitante: "Secretario del Ayuntamiento",
    paginas: 7,
    fundamento:
      "Artículo 20 de la Ley del Periódico Oficial y Ley de Ingresos del Municipio de Querétaro.",
    resumen:
      "Modificación de las tarifas del servicio de agua potable y alcantarillado para el ejercicio fiscal 2026.",
    observaciones: [
      "Falta el anexo tarifario completo referido en el considerando tercero.",
      "El acta de cabildo debe incluir la firma autógrafa del secretario.",
      "Verificar la fecha de sesión: el documento indica 30 de febrero (inexistente).",
    ],
    historial: [
      { fecha: "2026-06-12", hora: "11:18", evento: "Solicitud recibida en ventanilla electrónica", actor: "Sistema" },
      { fecha: "2026-06-12", hora: "14:50", evento: "Asignada a R. Jiménez", actor: "Coordinación Editorial" },
      { fecha: "2026-06-13", hora: "09:30", evento: "Devuelta con observaciones a la dependencia", actor: "R. Jiménez" },
    ],
  },
  {
    folio: "SOL-2026-1067",
    dependencia: "Secretaría de Finanzas",
    documento: "Norma Técnica de residuos sólidos urbanos",
    tipo: "Norma Técnica",
    fechaRecepcion: "2026-06-13",
    estatus: "En revisión",
    responsable: "D. Salinas",
    municipio: "Tequisquiapan",
    solicitante: "M.C. Diego Salinas Vega",
    cargoSolicitante: "Director de Medio Ambiente",
    paginas: 22,
    fundamento:
      "Artículo 19 de la Ley del Periódico Oficial y Ley de Prevención y Gestión Integral de Residuos del Estado.",
    resumen:
      "Establece los lineamientos técnicos para el manejo, recolección, transporte y disposición final de residuos sólidos urbanos.",
    observaciones: [],
    historial: [
      { fecha: "2026-06-13", hora: "08:55", evento: "Solicitud recibida en ventanilla electrónica", actor: "Sistema" },
      { fecha: "2026-06-13", hora: "13:10", evento: "Asignada a D. Salinas", actor: "Coordinación Editorial" },
      { fecha: "2026-06-14", hora: "10:40", evento: "En revisión jurídica y de formato", actor: "D. Salinas" },
    ],
  },
  {
    folio: "SOL-2026-1071",
    dependencia: "Tribunal Superior de Justicia",
    documento: "Acuerdo del Pleno sobre días inhábiles",
    tipo: "Acuerdo",
    fechaRecepcion: "2026-06-14",
    estatus: "Recibido",
    responsable: "Sin asignar",
    municipio: "Querétaro",
    solicitante: "Mtro. Eduardo Lara Camacho",
    cargoSolicitante: "Secretario General de Acuerdos",
    paginas: 4,
    fundamento:
      "Artículo 19 de la Ley del Periódico Oficial y Ley Orgánica del Poder Judicial del Estado.",
    resumen:
      "Determina los días inhábiles del segundo semestre de 2026 para efectos del cómputo de plazos procesales.",
    observaciones: [],
    historial: [
      { fecha: "2026-06-14", hora: "09:02", evento: "Solicitud recibida en ventanilla electrónica", actor: "Sistema" },
    ],
  },
  {
    folio: "SOL-2026-1072",
    dependencia: "Instituto Electoral del Estado",
    documento: "Convocatoria a consulta ciudadana 2026",
    tipo: "Convocatoria",
    fechaRecepcion: "2026-06-14",
    estatus: "Recibido",
    responsable: "Sin asignar",
    municipio: "Querétaro",
    solicitante: "Lic. Patricia Núñez Aguilar",
    cargoSolicitante: "Consejera Presidenta",
    paginas: 11,
    fundamento:
      "Artículo 20 de la Ley del Periódico Oficial y Ley Electoral del Estado de Querétaro.",
    resumen:
      "Convoca a la ciudadanía a participar en la consulta sobre el plan estatal de movilidad sustentable.",
    observaciones: [],
    historial: [
      { fecha: "2026-06-14", hora: "10:31", evento: "Solicitud recibida en ventanilla electrónica", actor: "Sistema" },
    ],
  },
]

export const metricas = [
  { etiqueta: "Solicitudes recibidas", valor: 128, tono: "neutral" as const },
  { etiqueta: "En revisión", valor: 24, tono: "info" as const },
  { etiqueta: "Observadas", valor: 9, tono: "warning" as const },
  { etiqueta: "Aprobadas", valor: 41, tono: "success" as const },
  { etiqueta: "Programadas", valor: 12, tono: "info" as const },
  { etiqueta: "Publicadas", valor: 42, tono: "success" as const },
]

export const flujoEstatus: EstatusInterno[] = [
  "Recibido",
  "En revisión",
  "Observado",
  "Validado",
  "Programado",
  "Publicado",
]

export function estatusColor(estatus: EstatusInterno): string {
  switch (estatus) {
    case "Recibido":
      return "bg-transparent text-muted-foreground border-border"
    case "En revisión":
      return "bg-muted text-foreground border-border"
    case "Observado":
      return "bg-gold/15 text-gold-foreground border-gold/50"
    case "Validado":
      return "bg-secondary text-secondary-foreground border-foreground/20"
    case "Programado":
      return "bg-foreground/10 text-foreground border-foreground/25"
    case "Publicado":
      return "bg-primary text-primary-foreground border-primary"
    default:
      return "bg-transparent text-muted-foreground border-border"
  }
}

export function formatFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]
  return `${d} de ${meses[m - 1]} de ${y}`
}

export function hashHex(semilla: string): string {
  let s = 0
  for (let i = 0; i < semilla.length; i++) {
    s = (s * 31 + semilla.charCodeAt(i)) >>> 0
  }
  let out = ""
  for (let i = 0; i < 64; i++) {
    s = (s * 1103515245 + 12345) >>> 0
    out += (s % 16).toString(16)
  }
  return out
}

export function getDocumento(id: string): DocumentoOficial | undefined {
  return documentos.find((d) => d.id === id)
}

export function getSolicitud(folio: string): SolicitudPublicacion | undefined {
  return solicitudes.find((s) => s.folio === folio)
}
