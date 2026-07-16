// Datos y tipos del flujo ciudadano de solicitud de publicación

export type TipoSolicitante =
  | "Particular"
  | "Dependencia estatal"
  | "Municipio"
  | "Organismo autónomo"
  | "Poder público"
  | "Notaría / corredor público"
  | "Otro"

export type TipoPublicacion =
  | "Edicto"
  | "Aviso"
  | "Convocatoria"
  | "Acuerdo"
  | "Decreto"
  | "Reglamento"
  | "Fe de erratas"
  | "Documento judicial"
  | "Otro"

export type EstatusSolicitud =
  | "Borrador"
  | "Pago pendiente"
  | "Pago acreditado"
  | "Recibida"
  | "En revisión"
  | "Observada"
  | "Corrección enviada"
  | "Validada"
  | "Programada"
  | "Publicada"
  | "Rechazada"

export type EstatusPago =
  | "Pendiente"
  | "En validación"
  | "Acreditado"
  | "Rechazado"

export type EstatusDocumento =
  | "Pendiente"
  | "Cargado"
  | "Observado"
  | "Validado"

export interface DocumentoCarga {
  id: string
  nombre: string
  descripcion: string
  requerido: boolean
  estatus: EstatusDocumento
}

export interface VersionDocumento {
  version: string
  estado: string
  fecha: string
  actual: boolean
}

export interface PublicacionFinal {
  numeroPeriodico: string
  fechaPublicacion: string
  paginaInicial: number
  paginaFinal: number
  folioPublicacion: string
  hash: string
}

export interface SolicitudCiudadana {
  folio: string
  tipoSolicitante: TipoSolicitante
  tipoPublicacion: TipoPublicacion
  solicitante: string
  rfc?: string
  correo: string
  telefono: string
  documento: string
  fechaSolicitud: string
  ultimaActualizacion: string
  estatus: EstatusSolicitud
  pago: EstatusPago
  importe: number
  paginas: number
  referenciaPago: string
  fechaTentativa?: string
  observaciones?: string[]
  fechaLimiteAtencion?: string
  documentos: DocumentoCarga[]
  versiones: VersionDocumento[]
  publicacion?: PublicacionFinal
}

export const tiposSolicitante: TipoSolicitante[] = [
  "Particular",
  "Dependencia estatal",
  "Municipio",
  "Organismo autónomo",
  "Poder público",
  "Notaría / corredor público",
  "Otro",
]

export const tiposPublicacion: TipoPublicacion[] = [
  "Edicto",
  "Aviso",
  "Convocatoria",
  "Acuerdo",
  "Decreto",
  "Reglamento",
  "Fe de erratas",
  "Documento judicial",
  "Otro",
]

// Tarifa por página (simulada), en pesos
export const TARIFA_POR_PAGINA = 480

export const documentosBase: DocumentoCarga[] = [
  {
    id: "escrito",
    nombre: "Escrito de solicitud",
    descripcion: "Petición formal dirigida a la Dirección del Periódico Oficial.",
    requerido: true,
    estatus: "Pendiente",
  },
  {
    id: "documento",
    nombre: "Documento a publicar (PDF)",
    descripcion: "Archivo en formato PDF/A del acto a publicar.",
    requerido: true,
    estatus: "Pendiente",
  },
  {
    id: "identificacion",
    nombre: "Identificación oficial",
    descripcion: "INE, pasaporte o cédula del solicitante o representante.",
    requerido: true,
    estatus: "Pendiente",
  },
  {
    id: "poder",
    nombre: "Poder o acreditación de personalidad",
    descripcion: "Solo si actúa mediante representante legal.",
    requerido: false,
    estatus: "Pendiente",
  },
  {
    id: "anexos",
    nombre: "Anexos",
    descripcion: "Documentación complementaria, planos o tablas.",
    requerido: false,
    estatus: "Pendiente",
  },
  {
    id: "comprobante",
    nombre: "Comprobante de pago",
    descripcion: "Recibo o línea de captura pagada, si aplica.",
    requerido: false,
    estatus: "Pendiente",
  },
]

export const estatusSolicitudFlujo: EstatusSolicitud[] = [
  "Borrador",
  "Pago pendiente",
  "Pago acreditado",
  "Recibida",
  "En revisión",
  "Observada",
  "Corrección enviada",
  "Validada",
  "Programada",
  "Publicada",
  "Rechazada",
]

export function estatusSolicitudColor(estatus: EstatusSolicitud): string {
  switch (estatus) {
    case "Borrador":
      return "bg-transparent text-muted-foreground border-border"
    case "Pago pendiente":
      return "bg-transparent text-foreground border-foreground/40"
    case "Pago acreditado":
      return "bg-muted text-foreground border-border"
    case "Recibida":
      return "bg-muted text-foreground border-border"
    case "En revisión":
      return "bg-secondary text-secondary-foreground border-foreground/20"
    case "Observada":
      return "bg-gold/15 text-gold-foreground border-gold/50"
    case "Corrección enviada":
      return "bg-secondary text-secondary-foreground border-foreground/20"
    case "Validada":
      return "bg-foreground/10 text-foreground border-foreground/25"
    case "Programada":
      return "bg-foreground/15 text-foreground border-foreground/30"
    case "Publicada":
      return "bg-primary text-primary-foreground border-primary"
    case "Rechazada":
      return "bg-destructive/10 text-destructive border-destructive/40"
    default:
      return "bg-transparent text-muted-foreground border-border"
  }
}

export function pagoColor(estatus: EstatusPago): string {
  switch (estatus) {
    case "Pendiente":
      return "bg-transparent text-foreground border-foreground/40"
    case "En validación":
      return "bg-secondary text-secondary-foreground border-foreground/20"
    case "Acreditado":
      return "bg-primary text-primary-foreground border-primary"
    case "Rechazado":
      return "bg-destructive/10 text-destructive border-destructive/40"
    default:
      return "bg-transparent text-muted-foreground border-border"
  }
}

export function documentoColor(estatus: EstatusDocumento): string {
  switch (estatus) {
    case "Pendiente":
      return "bg-transparent text-muted-foreground border-border"
    case "Cargado":
      return "bg-secondary text-secondary-foreground border-foreground/20"
    case "Observado":
      return "bg-gold/15 text-gold-foreground border-gold/50"
    case "Validado":
      return "bg-primary text-primary-foreground border-primary"
    default:
      return "bg-transparent text-muted-foreground border-border"
  }
}

function docs(overrides: Partial<Record<string, EstatusDocumento>> = {}): DocumentoCarga[] {
  return documentosBase.map((d) => ({
    ...d,
    estatus: overrides[d.id] ?? d.estatus,
  }))
}

export const solicitudesCiudadanas: SolicitudCiudadana[] = [
  {
    folio: "SCP-2026-00318",
    tipoSolicitante: "Particular",
    tipoPublicacion: "Edicto",
    solicitante: "Juan Pablo Hernández Loyola",
    rfc: "HELJ850612AB3",
    correo: "jp.hernandez@example.com",
    telefono: "442 118 4422",
    documento: "Edicto de notificación a herederos del juicio sucesorio 482/2026",
    fechaSolicitud: "2026-06-14",
    ultimaActualizacion: "2026-06-14",
    estatus: "Publicada",
    pago: "Acreditado",
    importe: 1440,
    paginas: 3,
    referenciaPago: "LC-7741-0093-2261",
    fechaTentativa: "2026-06-12",
    documentos: docs({
      escrito: "Validado",
      documento: "Validado",
      identificacion: "Validado",
      comprobante: "Validado",
    }),
    versiones: [
      { version: "v1", estado: "Enviada a revisión", fecha: "2026-06-09", actual: true },
    ],
    publicacion: {
      numeroPeriodico: "No. 42, Tomo CLIX",
      fechaPublicacion: "2026-06-12",
      paginaInicial: 88,
      paginaFinal: 90,
      folioPublicacion: "POEQ-2026-00489",
      hash: "a3f5d9c4e1b27a8f06d3c2b14e7f9a0d5c8b6e2f1a4d7c9b0e3f5a8d2c6b4e1f",
    },
  },
  {
    folio: "SCP-2026-00342",
    tipoSolicitante: "Notaría / corredor público",
    tipoPublicacion: "Aviso",
    solicitante: "Notaría Pública No. 12 — Lic. Andrea Solís Marín",
    rfc: "SOMA760904K21",
    correo: "notaria12@example.com",
    telefono: "442 209 7781",
    documento: "Aviso notarial de sucesión testamentaria, expediente 1190/2026",
    fechaSolicitud: "2026-06-13",
    ultimaActualizacion: "2026-06-15",
    estatus: "Observada",
    pago: "Acreditado",
    importe: 960,
    paginas: 2,
    referenciaPago: "LC-7741-0094-1180",
    fechaLimiteAtencion: "2026-06-20",
    observaciones: [
      "El aviso debe incluir el número de instrumento notarial completo.",
      "Adjuntar copia legible de la identificación del compareciente.",
    ],
    documentos: docs({
      escrito: "Validado",
      documento: "Observado",
      identificacion: "Cargado",
      comprobante: "Validado",
    }),
    versiones: [
      { version: "v2", estado: "En corrección por el solicitante", fecha: "2026-06-15", actual: true },
      { version: "v1", estado: "Devuelta con observaciones", fecha: "2026-06-14", actual: false },
    ],
  },
  {
    folio: "SCP-2026-00351",
    tipoSolicitante: "Municipio",
    tipoPublicacion: "Convocatoria",
    solicitante: "Municipio de El Marqués — Secretaría del Ayuntamiento",
    rfc: "MEM850101QT4",
    correo: "ayuntamiento@elmarques.example.com",
    telefono: "442 277 6610",
    documento: "Convocatoria a licitación pública de obra LP-EM-014-2026",
    fechaSolicitud: "2026-06-15",
    ultimaActualizacion: "2026-06-15",
    estatus: "En revisión",
    pago: "Acreditado",
    importe: 2880,
    paginas: 6,
    referenciaPago: "LC-7741-0095-0140",
    documentos: docs({
      escrito: "Validado",
      documento: "Cargado",
      identificacion: "Validado",
      comprobante: "Validado",
    }),
    versiones: [
      { version: "v1", estado: "Enviada a revisión", fecha: "2026-06-15", actual: true },
    ],
  },
  {
    folio: "SCP-2026-00360",
    tipoSolicitante: "Particular",
    tipoPublicacion: "Fe de erratas",
    solicitante: "María Elena Vargas Quintero",
    correo: "me.vargas@example.com",
    telefono: "442 331 0098",
    documento: "Fe de erratas a edicto publicado en edición No. 40",
    fechaSolicitud: "2026-06-15",
    ultimaActualizacion: "2026-06-15",
    estatus: "Pago pendiente",
    pago: "Pendiente",
    importe: 480,
    paginas: 1,
    referenciaPago: "LC-7741-0096-2200",
    documentos: docs({
      escrito: "Cargado",
      documento: "Cargado",
      identificacion: "Pendiente",
    }),
    versiones: [
      { version: "v1", estado: "Borrador en captura", fecha: "2026-06-15", actual: true },
    ],
  },
  {
    folio: "SCP-2026-00366",
    tipoSolicitante: "Organismo autónomo",
    tipoPublicacion: "Acuerdo",
    solicitante: "Comisión Estatal de Derechos Humanos",
    rfc: "CED920311HU8",
    correo: "publicaciones@cedh.example.com",
    telefono: "442 214 0900",
    documento: "Acuerdo del Consejo sobre lineamientos de atención ciudadana",
    fechaSolicitud: "2026-06-16",
    ultimaActualizacion: "2026-06-16",
    estatus: "Borrador",
    pago: "Pendiente",
    importe: 1920,
    paginas: 4,
    referenciaPago: "—",
    documentos: docs({
      escrito: "Cargado",
    }),
    versiones: [
      { version: "v1", estado: "Borrador en captura", fecha: "2026-06-16", actual: true },
    ],
  },
]

export function getSolicitudCiudadana(
  folio: string,
): SolicitudCiudadana | undefined {
  return solicitudesCiudadanas.find((s) => s.folio === folio)
}
