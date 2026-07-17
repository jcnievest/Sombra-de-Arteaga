import { jsPDF } from "jspdf"
import type { Edicion } from "@/lib/ediciones"

const VERDE: [number, number, number] = [31, 74, 63] // verde institucional
const VERDE_CLARO: [number, number, number] = [233, 240, 237]
const ORO: [number, number, number] = [168, 134, 58]
const GRIS: [number, number, number] = [110, 116, 112]
const TINTA: [number, number, number] = [38, 46, 42]

// Genera la matriz determinística del QR (mismo patrón que QrSimulado)
function generarQrGrid(value: string): boolean[][] {
  const cells = 21
  let seed = 0
  for (let i = 0; i < value.length; i++) {
    seed = (seed * 31 + value.charCodeAt(i)) >>> 0
  }
  const rng = (n: number) => {
    seed = (seed * 1103515245 + 12345) >>> 0
    return seed % n
  }
  const grid: boolean[][] = Array.from({ length: cells }, () =>
    Array.from({ length: cells }, () => rng(100) > 52),
  )
  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        grid[r0 + r][c0 + c] = edge || inner
      }
    }
  }
  drawFinder(0, 0)
  drawFinder(0, cells - 7)
  drawFinder(cells - 7, 0)
  return grid
}

function dibujarQr(
  doc: jsPDF,
  value: string,
  x: number,
  y: number,
  size: number,
) {
  const grid = generarQrGrid(value)
  const cells = grid.length
  const cell = size / cells
  // Fondo blanco
  doc.setFillColor(255, 255, 255)
  doc.rect(x, y, size, size, "F")
  doc.setFillColor(TINTA[0], TINTA[1], TINTA[2])
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if (grid[r][c]) {
        doc.rect(x + c * cell, y + r * cell, cell, cell, "F")
      }
    }
  }
}

// Marca de agua diagonal repetida para las copias sin validez legal
function dibujarMarcaAgua(doc: jsPDF, texto: string) {
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    doc.saveGraphicsState()
    // gris claro translúcido
    // @ts-expect-error GState existe en jsPDF en runtime
    doc.setGState(new doc.GState({ opacity: 0.12 }))
    doc.setTextColor(120, 120, 120)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(40)
    for (let yy = 40; yy < H; yy += 60) {
      for (let xx = -10; xx < W + 40; xx += 110) {
        doc.text(texto, xx, yy, { angle: 30 })
      }
    }
    doc.restoreGraphicsState()
  }
}

function formatoFechaLarga(iso: string): string {
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

/**
 * Genera y descarga un PDF de la edición completa del Periódico Oficial.
 *
 * - `firmado: true`  → copia OFICIAL con FEA/qFirma, hash SHA-256, sello de
 *   tiempo y QR de verificación pública (se obtiene tras el pago).
 * - `firmado: false` → copia SIMPLE informativa, marcada como SIN VALIDEZ
 *   LEGAL, sin firma electrónica ni elementos de verificación.
 */
export function descargarEdicionPdf(edicion: Edicion, firmado = true) {
  if (!firmado) {
    generarCopiaSimple(edicion, false)
    return
  }
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const margin = 18

  // ===== PORTADA =====
  // Banda superior verde institucional
  doc.setFillColor(VERDE[0], VERDE[1], VERDE[2])
  doc.rect(0, 0, W, 46, "F")
  // Línea dorada
  doc.setFillColor(ORO[0], ORO[1], ORO[2])
  doc.rect(0, 46, W, 1.4, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFont("times", "normal")
  doc.setFontSize(11)
  doc.text("GOBIERNO DEL ESTADO DE QUERÉTARO", W / 2, 18, { align: "center" })
  doc.setFont("times", "bold")
  doc.setFontSize(22)
  doc.text("La Sombra de Arteaga", W / 2, 30, { align: "center" })
  doc.setFont("times", "normal")
  doc.setFontSize(9.5)
  doc.text("PERIÓDICO OFICIAL DEL GOBIERNO DEL ESTADO", W / 2, 39, {
    align: "center",
  })

  // Bloque central de identificación
  let y = 74
  doc.setTextColor(TINTA[0], TINTA[1], TINTA[2])
  doc.setFont("times", "bold")
  doc.setFontSize(28)
  doc.text(`Número ${edicion.numero}`, W / 2, y, { align: "center" })
  y += 11
  doc.setFont("times", "normal")
  doc.setFontSize(13)
  doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
  doc.text(`${edicion.tomo}  ·  Edición ${edicion.tipo}`, W / 2, y, {
    align: "center",
  })
  y += 9
  doc.setFontSize(12)
  doc.text(
    `Santiago de Querétaro, ${formatoFechaLarga(edicion.fecha)}`,
    W / 2,
    y,
    { align: "center" },
  )
  y += 7
  doc.setFontSize(10)
  doc.text(
    `${edicion.documentos.length} documentos publicados · ${edicion.paginas} páginas`,
    W / 2,
    y,
    { align: "center" },
  )

  // ===== CERTIFICADO DE FIRMA ELECTRÓNICA =====
  const boxY = 120
  const boxH = 118
  doc.setDrawColor(VERDE[0], VERDE[1], VERDE[2])
  doc.setLineWidth(0.5)
  doc.setFillColor(VERDE_CLARO[0], VERDE_CLARO[1], VERDE_CLARO[2])
  doc.roundedRect(margin, boxY, W - margin * 2, boxH, 3, 3, "FD")

  // Título del recuadro
  doc.setFillColor(VERDE[0], VERDE[1], VERDE[2])
  doc.roundedRect(margin, boxY, W - margin * 2, 12, 3, 3, "F")
  doc.rect(margin, boxY + 6, W - margin * 2, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10.5)
  doc.text(
    "CONSTANCIA DE FIRMA ELECTRÓNICA AVANZADA (qFirma)",
    W / 2,
    boxY + 8,
    { align: "center" },
  )

  // Contenido del recuadro
  const innerX = margin + 8
  let cy = boxY + 24
  doc.setTextColor(TINTA[0], TINTA[1], TINTA[2])

  const fila = (label: string, value: string, mono = false) => {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
    doc.text(label.toUpperCase(), innerX, cy)
    cy += 4.5
    doc.setFont(mono ? "courier" : "helvetica", "normal")
    doc.setFontSize(mono ? 8.5 : 10)
    doc.setTextColor(TINTA[0], TINTA[1], TINTA[2])
    const maxW = W - margin * 2 - 16 - 46 // dejar espacio para el QR
    const lines = doc.splitTextToSize(value, maxW)
    doc.text(lines, innerX, cy)
    cy += lines.length * (mono ? 4.6 : 5) + 4
  }

  fila("Firmante autorizado", "Dirección del Periódico Oficial del Estado de Querétaro")
  fila(
    "Firma electrónica",
    "Firma Electrónica Avanzada (FEA) emitida mediante qFirma",
  )
  fila("Algoritmo de integridad", "SHA-256 / RSA-2048")
  fila("Huella digital (hash SHA-256)", edicion.hash, true)
  fila("Sello digital de tiempo (TSA)", edicion.selloTiempo, true)
  fila(
    "Folio de verificación",
    `LSA-${edicion.numero}-${edicion.hash.slice(0, 12).toUpperCase()}`,
    true,
  )

  // QR de verificación dentro del recuadro (esquina inferior derecha)
  const qrSize = 38
  const qrX = W - margin - 8 - qrSize
  const qrY = boxY + boxH - qrSize - 10
  dibujarQr(doc, `${edicion.numero}-${edicion.hash}`, qrX, qrY, qrSize)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
  doc.text("Verificación pública", qrX + qrSize / 2, qrY + qrSize + 4, {
    align: "center",
  })

  // Nota legal al pie de la portada
  doc.setFont("helvetica", "italic")
  doc.setFontSize(7.5)
  doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
  const nota =
    "Documento electrónico con validez oficial. La autenticidad e integridad de esta edición pueden verificarse en el portal de La Sombra de Arteaga escaneando el código QR o capturando el folio de verificación. Reproducción simulada para fines de demostración."
  const notaLines = doc.splitTextToSize(nota, W - margin * 2)
  doc.text(notaLines, W / 2, H - 16, { align: "center" })

  // ===== ÍNDICE DE LA EDICIÓN =====
  doc.addPage()
  const encabezadoPagina = (titulo: string) => {
    doc.setFillColor(VERDE[0], VERDE[1], VERDE[2])
    doc.rect(0, 0, W, 22, "F")
    doc.setFillColor(ORO[0], ORO[1], ORO[2])
    doc.rect(0, 22, W, 0.8, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFont("times", "bold")
    doc.setFontSize(13)
    doc.text("La Sombra de Arteaga", margin, 13)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text(
      `No. ${edicion.numero} · ${edicion.tomo} · ${titulo}`,
      W - margin,
      13,
      { align: "right" },
    )
  }
  encabezadoPagina("Índice")

  let iy = 36
  doc.setTextColor(TINTA[0], TINTA[1], TINTA[2])
  doc.setFont("times", "bold")
  doc.setFontSize(16)
  doc.text("Índice de la edición", margin, iy)
  iy += 4
  doc.setDrawColor(ORO[0], ORO[1], ORO[2])
  doc.setLineWidth(0.6)
  doc.line(margin, iy, margin + 40, iy)
  iy += 8

  // Cabecera de tabla
  const colPag = margin
  const colTitulo = margin + 16
  const colDep = W - margin - 52
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
  doc.text("PÁG.", colPag, iy)
  doc.text("DOCUMENTO", colTitulo, iy)
  doc.text("DEPENDENCIA", colDep, iy)
  iy += 3
  doc.setDrawColor(210, 214, 211)
  doc.setLineWidth(0.3)
  doc.line(margin, iy, W - margin, iy)
  iy += 6

  doc.setFontSize(9.5)
  edicion.documentos.forEach((d, i) => {
    if (iy > H - 24) {
      doc.addPage()
      encabezadoPagina("Índice (cont.)")
      iy = 36
    }
    // Página
    doc.setFont("courier", "normal")
    doc.setTextColor(VERDE[0], VERDE[1], VERDE[2])
    doc.text(String(d.pagina), colPag, iy)
    // Título
    doc.setFont("helvetica", "normal")
    doc.setTextColor(TINTA[0], TINTA[1], TINTA[2])
    const tLines = doc.splitTextToSize(d.titulo, colDep - colTitulo - 4)
    doc.text(tLines, colTitulo, iy)
    // Tipo de acto bajo el título
    doc.setFont("helvetica", "italic")
    doc.setFontSize(7.5)
    doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
    doc.text(d.tipoActo, colTitulo, iy + tLines.length * 4.4 + 1)
    // Dependencia
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
    const depLines = doc.splitTextToSize(d.dependencia, W - margin - colDep)
    doc.text(depLines, colDep, iy)
    doc.setFontSize(9.5)

    const usado = Math.max(tLines.length * 4.4 + 5, depLines.length * 4.4)
    iy += usado + 3
    doc.setDrawColor(232, 235, 232)
    doc.setLineWidth(0.2)
    doc.line(margin, iy - 2, W - margin, iy - 2)
    if (i === edicion.documentos.length - 1) iy += 2
  })

  // Pie de página con verificación en todas las páginas
  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
    doc.text(
      `Edición firmada con qFirma · Hash ${edicion.hash.slice(0, 16)}…`,
      margin,
      H - 8,
    )
    doc.text(`Página ${p} de ${total}`, W - margin, H - 8, { align: "right" })
  }

  doc.save(`Periodico-Oficial-No-${edicion.numero}-${edicion.fecha}.pdf`)
}

const ROJO: [number, number, number] = [150, 40, 40]

/**
 * Copia SIMPLE de la edición, sin firma electrónica ni elementos de
 * verificación. Incluye marca de agua y aviso de que no tiene validez legal.
 */
export function previsualizarCopiaSimplePdf(edicion: Edicion) {
  const ventana = window.open("", "_blank")
  generarCopiaSimple(edicion, true, ventana)
}

function generarCopiaSimple(
  edicion: Edicion,
  vistaPrevia: boolean,
  ventanaPrevia: Window | null = null,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const margin = 18

  // ===== PORTADA =====
  // Banda superior en gris (no institucional, para diferenciar de la oficial)
  doc.setFillColor(GRIS[0], GRIS[1], GRIS[2])
  doc.rect(0, 0, W, 46, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("times", "normal")
  doc.setFontSize(11)
  doc.text("GOBIERNO DEL ESTADO DE QUERÉTARO", W / 2, 18, { align: "center" })
  doc.setFont("times", "bold")
  doc.setFontSize(22)
  doc.text("La Sombra de Arteaga", W / 2, 30, { align: "center" })
  doc.setFont("times", "normal")
  doc.setFontSize(9.5)
  doc.text("PERIÓDICO OFICIAL DEL GOBIERNO DEL ESTADO", W / 2, 39, {
    align: "center",
  })

  // Bloque central de identificación
  let y = 74
  doc.setTextColor(TINTA[0], TINTA[1], TINTA[2])
  doc.setFont("times", "bold")
  doc.setFontSize(28)
  doc.text(`Número ${edicion.numero}`, W / 2, y, { align: "center" })
  y += 11
  doc.setFont("times", "normal")
  doc.setFontSize(13)
  doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
  doc.text(`${edicion.tomo}  ·  Edición ${edicion.tipo}`, W / 2, y, {
    align: "center",
  })
  y += 9
  doc.setFontSize(12)
  doc.text(
    `Santiago de Querétaro, ${formatoFechaLarga(edicion.fecha)}`,
    W / 2,
    y,
    { align: "center" },
  )
  y += 7
  doc.setFontSize(10)
  doc.text(
    `${edicion.documentos.length} documentos publicados · ${edicion.paginas} páginas`,
    W / 2,
    y,
    { align: "center" },
  )

  // ===== AVISO: SIN VALIDEZ LEGAL =====
  const boxY = 120
  const boxH = 88
  doc.setDrawColor(ROJO[0], ROJO[1], ROJO[2])
  doc.setLineWidth(0.6)
  doc.setFillColor(250, 242, 242)
  doc.roundedRect(margin, boxY, W - margin * 2, boxH, 3, 3, "FD")

  doc.setFillColor(ROJO[0], ROJO[1], ROJO[2])
  doc.roundedRect(margin, boxY, W - margin * 2, 12, 3, 3, "F")
  doc.rect(margin, boxY + 6, W - margin * 2, 6, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10.5)
  doc.text("COPIA SIMPLE — SIN VALIDEZ OFICIAL", W / 2, boxY + 8, {
    align: "center",
  })

  doc.setTextColor(TINTA[0], TINTA[1], TINTA[2])
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  const aviso =
    "Este documento es una copia informativa de la edición y NO cuenta con Firma Electrónica Avanzada (qFirma), huella digital SHA-256, sello digital de tiempo ni código QR de verificación. Por lo anterior, carece de validez legal y no surte efectos jurídicos."
  const avisoLines = doc.splitTextToSize(aviso, W - margin * 2 - 16)
  doc.text(avisoLines, margin + 8, boxY + 24)

  let ny = boxY + 24 + avisoLines.length * 5 + 6
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(ROJO[0], ROJO[1], ROJO[2])
  doc.text("Para obtener la edición con validez oficial:", margin + 8, ny)
  ny += 5.5
  doc.setFont("helvetica", "normal")
  doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
  const pasos =
    "Realice el pago correspondiente en el portal de La Sombra de Arteaga. Al completarlo, podrá descargar el ejemplar firmado electrónicamente con plena validez legal."
  doc.text(doc.splitTextToSize(pasos, W - margin * 2 - 16), margin + 8, ny)

  // Nota al pie de la portada
  doc.setFont("helvetica", "italic")
  doc.setFontSize(7.5)
  doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
  doc.text(
    doc.splitTextToSize(
      "Documento generado para fines informativos y de demostración. No debe utilizarse como constancia oficial.",
      W - margin * 2,
    ),
    W / 2,
    H - 16,
    { align: "center" },
  )

  // ===== ÍNDICE =====
  doc.addPage()
  const encabezadoPagina = (titulo: string) => {
    doc.setFillColor(GRIS[0], GRIS[1], GRIS[2])
    doc.rect(0, 0, W, 22, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFont("times", "bold")
    doc.setFontSize(13)
    doc.text("La Sombra de Arteaga", margin, 13)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text(`No. ${edicion.numero} · ${edicion.tomo} · ${titulo}`, W - margin, 13, {
      align: "right",
    })
  }
  encabezadoPagina("Índice (copia simple)")

  let iy = 36
  doc.setTextColor(TINTA[0], TINTA[1], TINTA[2])
  doc.setFont("times", "bold")
  doc.setFontSize(16)
  doc.text("Índice de la edición", margin, iy)
  iy += 4
  doc.setDrawColor(GRIS[0], GRIS[1], GRIS[2])
  doc.setLineWidth(0.6)
  doc.line(margin, iy, margin + 40, iy)
  iy += 8

  const colPag = margin
  const colTitulo = margin + 16
  const colDep = W - margin - 52
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
  doc.text("PÁG.", colPag, iy)
  doc.text("DOCUMENTO", colTitulo, iy)
  doc.text("DEPENDENCIA", colDep, iy)
  iy += 3
  doc.setDrawColor(210, 214, 211)
  doc.setLineWidth(0.3)
  doc.line(margin, iy, W - margin, iy)
  iy += 6

  doc.setFontSize(9.5)
  edicion.documentos.forEach((d) => {
    if (iy > H - 24) {
      doc.addPage()
      encabezadoPagina("Índice (cont.)")
      iy = 36
    }
    doc.setFont("courier", "normal")
    doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
    doc.text(String(d.pagina), colPag, iy)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(TINTA[0], TINTA[1], TINTA[2])
    const tLines = doc.splitTextToSize(d.titulo, colDep - colTitulo - 4)
    doc.text(tLines, colTitulo, iy)
    doc.setFont("helvetica", "italic")
    doc.setFontSize(7.5)
    doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
    doc.text(d.tipoActo, colTitulo, iy + tLines.length * 4.4 + 1)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8.5)
    const depLines = doc.splitTextToSize(d.dependencia, W - margin - colDep)
    doc.text(depLines, colDep, iy)
    doc.setFontSize(9.5)
    const usado = Math.max(tLines.length * 4.4 + 5, depLines.length * 4.4)
    iy += usado + 3
    doc.setDrawColor(232, 235, 232)
    doc.setLineWidth(0.2)
    doc.line(margin, iy - 2, W - margin, iy - 2)
  })

  // Pie de página
  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.setTextColor(ROJO[0], ROJO[1], ROJO[2])
    doc.text("COPIA SIMPLE SIN VALIDEZ OFICIAL", margin, H - 8)
    doc.setTextColor(GRIS[0], GRIS[1], GRIS[2])
    doc.text(`Página ${p} de ${total}`, W - margin, H - 8, { align: "right" })
  }

  // Marca de agua en todas las páginas
  dibujarMarcaAgua(doc, "SIN VALIDEZ OFICIAL")

  if (vistaPrevia) {
    const url = URL.createObjectURL(doc.output("blob"))
    if (ventanaPrevia) {
      ventanaPrevia.location.href = url
    } else {
      window.open(url, "_blank", "noopener,noreferrer")
    }
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return
  }

  doc.save(`Copia-simple-Periodico-No-${edicion.numero}-${edicion.fecha}.pdf`)
}
