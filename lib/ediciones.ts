import { documentos, type TipoActo } from "@/lib/data"

export type TipoEdicion = "Ordinaria" | "Extraordinaria" | "Alcance"

export interface DocumentoIndice {
  pagina: number
  titulo: string
  dependencia: string
  tipoActo: TipoActo
  docId?: string
}

export interface Edicion {
  id: string
  numero: number
  tomo: string
  fecha: string // ISO yyyy-mm-dd
  tipo: TipoEdicion
  paginas: number
  hash: string
  selloTiempo: string
  documentos: DocumentoIndice[]
}

const dependenciasPool = [
  "Secretaría de Gobierno",
  "Secretaría de Finanzas",
  "Secretaría de Desarrollo Urbano",
  "Secretaría de Salud",
  "Poder Legislativo del Estado",
  "Tribunal Superior de Justicia",
  "Instituto Electoral del Estado",
  "Municipio de Querétaro",
]

const tiposActoPool: TipoActo[] = [
  "Decreto",
  "Acuerdo",
  "Reglamento",
  "Convocatoria",
  "Aviso",
  "Ley",
  "Norma Técnica",
]

const titulosPool = [
  "Decreto por el que se reforman disposiciones de la Ley de Hacienda del Estado",
  "Acuerdo de coordinación interinstitucional en materia de protección civil",
  "Reglamento de zonificación y usos de suelo municipal",
  "Convocatoria pública para la asignación de plazas",
  "Aviso de deslinde de terrenos nacionales",
  "Norma Técnica para la gestión integral de residuos sólidos",
  "Acuerdo del Pleno sobre días inhábiles del periodo",
  "Reglas de operación del programa estatal de apoyo al campo",
  "Manual de organización de la dependencia",
  "Acuerdo de cabildo sobre tarifas de servicios públicos",
  "Convocatoria a consulta ciudadana de movilidad",
  "Decreto de presupuesto de egresos del ejercicio fiscal",
]

// Generador determinístico de hash hexadecimal
function hashDeterminista(semilla: string): string {
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

function pick<T>(arr: T[], n: number): T {
  return arr[n % arr.length]
}

const anios = [2026, 2025, 2024, 2023, 2022, 2021]

function construirEdiciones(): Edicion[] {
  const lista: Edicion[] = []

  for (const anio of anios) {
    let numero = anio === 2026 ? 51 : 52
    const tomoBase = 2026 - anio
    const tomo = `Tomo ${["CLIX", "CLVIII", "CLVII", "CLVI", "CLV", "CLIV"][tomoBase] ?? "CLIX"}`

    for (let mes = 0; mes < 12; mes++) {
      // 2026 solo hasta junio (mes 5)
      if (anio === 2026 && mes > 5) break

      const diasEnMes = new Date(anio, mes + 1, 0).getDate()
      for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = new Date(anio, mes, dia)
        const dow = fecha.getDay() // 0 dom ... 5 vie
        const semilla = `${anio}-${mes}-${dia}`
        const h = (anio * 372 + mes * 31 + dia) % 100

        const esViernes = dow === 5
        const esExtra = dow === 2 && h % 5 === 0
        const esAlcance = dow === 3 && h % 7 === 0

        if (!esViernes && !esExtra && !esAlcance) continue

        const tiposDia: TipoEdicion[] = []
        if (esViernes) tiposDia.push("Ordinaria")
        if (esExtra) tiposDia.push("Extraordinaria")
        if (esAlcance) tiposDia.push("Alcance")
        if (esViernes && h % 11 === 0) tiposDia.push("Alcance")

        for (let k = 0; k < tiposDia.length; k++) {
          const tipo = tiposDia[k]
          numero += 1
          const iso = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
          const numDocs = 2 + ((h + k) % 6)
          const docs: DocumentoIndice[] = []
          let pagina = 1
          for (let d = 0; d < numDocs; d++) {
            const idx = h + d * 7 + k * 3
            const pags = 2 + (idx % 12)
            docs.push({
              pagina,
              titulo: pick(titulosPool, idx),
              dependencia: pick(dependenciasPool, idx + 1),
              tipoActo: pick(tiposActoPool, idx + 2),
            })
            pagina += pags
          }
          const id = `ed-${iso}-${k}`
          lista.push({
            id,
            numero,
            tomo,
            fecha: iso,
            tipo,
            paginas: pagina - 1,
            hash: hashDeterminista(semilla + tipo),
            selloTiempo: `${iso}T08:00:03-06:00`,
            documentos: docs,
          })
        }
      }
    }
  }

  return lista
}

export const ediciones: Edicion[] = construirEdiciones()

// Enlazar los documentos reales conocidos a su edición ordinaria correspondiente
function enlazarDocumentosReales() {
  for (const doc of documentos) {
    const ed = ediciones.find(
      (e) => e.fecha === doc.fechaPublicacion && e.tipo === "Ordinaria",
    )
    if (ed && ed.documentos[0]) {
      const slot = ed.documentos[0]
      slot.titulo = doc.titulo
      slot.dependencia = doc.dependencia
      slot.tipoActo = doc.tipo
      slot.docId = doc.id
    }
  }
}
enlazarDocumentosReales()

export const aniosDisponibles = anios

export function edicionesPorFecha(iso: string): Edicion[] {
  return ediciones
    .filter((e) => e.fecha === iso)
    .sort((a, b) => a.numero - b.numero)
}

export function edicionesDeMes(anio: number, mes: number): Edicion[] {
  const prefijo = `${anio}-${String(mes + 1).padStart(2, "0")}-`
  return ediciones.filter((e) => e.fecha.startsWith(prefijo))
}

export function getEdicion(id: string): Edicion | undefined {
  return ediciones.find((e) => e.id === id)
}

export function getEdicionPorNumero(numero: number): Edicion | undefined {
  return ediciones.find((e) => e.numero === numero)
}

export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export function tipoEdicionColor(tipo: TipoEdicion): string {
  switch (tipo) {
    case "Ordinaria":
      return "bg-primary text-primary-foreground border-primary"
    case "Extraordinaria":
      return "bg-foreground/10 text-foreground border-foreground/30"
    case "Alcance":
      return "bg-secondary text-secondary-foreground border-foreground/20"
    default:
      return "bg-muted text-foreground border-border"
  }
}
