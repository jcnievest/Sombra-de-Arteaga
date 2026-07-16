"use client"

import { useState } from "react"
import {
  BookCheck,
  GripVertical,
  ListOrdered,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { documentos, formatFecha } from "@/lib/data"
import { FirmaModal } from "@/components/firma-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function EdicionPage() {
  const [orden, setOrden] = useState(documentos.slice(0, 5))
  const [indiceGenerado, setIndiceGenerado] = useState(false)
  const [pdfGenerado, setPdfGenerado] = useState(false)
  const [generandoPdf, setGenerandoPdf] = useState(false)
  const [firmaOpen, setFirmaOpen] = useState(false)

  const mover = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= orden.length) return
    const next = [...orden]
    ;[next[i], next[j]] = [next[j], next[i]]
    setOrden(next)
  }

  const generarIndice = () => {
    setIndiceGenerado(true)
    toast.success("Índice generado correctamente")
  }

  const generarPdf = () => {
    setGenerandoPdf(true)
    setTimeout(() => {
      setGenerandoPdf(false)
      setPdfGenerado(true)
      toast.success("PDF final de la edición generado")
    }, 1800)
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">
            Cierre de edición del Periódico Oficial
          </h1>
          <p className="text-sm text-muted-foreground">
            Edición No. 43, Tomo CLIX · Programada para el{" "}
            {formatFecha("2026-06-19")}
          </p>
        </div>
        <Badge variant="outline" className="w-fit gap-1.5">
          <BookCheck className="h-3.5 w-3.5" />
          {orden.length} documentos aprobados
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Orden de publicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <ListOrdered className="h-5 w-5 text-primary" />
              Orden de publicación
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {orden.map((doc, i) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold tabular-nums">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doc.titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.tipo} · {doc.dependencia}
                  </p>
                </div>
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => mover(i, -1)}
                    disabled={i === 0}
                    aria-label="Subir"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => mover(i, 1)}
                    disabled={i === orden.length - 1}
                    aria-label="Bajar"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Acciones de cierre */}
        <Card className="lg:sticky lg:top-20 lg:self-start">
          <CardHeader>
            <CardTitle className="font-serif text-lg">
              Generación y firma
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Paso
              n={1}
              titulo="Generar índice"
              desc="Crea el índice oficial a partir del orden definido."
              hecho={indiceGenerado}
            >
              <Button
                variant={indiceGenerado ? "outline" : "default"}
                onClick={generarIndice}
                disabled={indiceGenerado}
                className="w-full"
              >
                {indiceGenerado ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <ListOrdered className="h-4 w-4" />
                )}
                {indiceGenerado ? "Índice generado" : "Generar índice"}
              </Button>
            </Paso>

            <Separator />

            <Paso
              n={2}
              titulo="Generar PDF final"
              desc="Compila todos los documentos firmados en un solo archivo."
              hecho={pdfGenerado}
            >
              <Button
                variant={pdfGenerado ? "outline" : "default"}
                onClick={generarPdf}
                disabled={!indiceGenerado || pdfGenerado || generandoPdf}
                className="w-full"
              >
                {generandoPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : pdfGenerado ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                {pdfGenerado
                  ? "PDF generado"
                  : generandoPdf
                    ? "Generando…"
                    : "Generar PDF final"}
              </Button>
            </Paso>

            <Separator />

            <Paso
              n={3}
              titulo="Firmar edición"
              desc="Aplica qFirma para publicar oficialmente la edición."
              hecho={false}
            >
              <Button
                onClick={() => setFirmaOpen(true)}
                disabled={!pdfGenerado}
                className="w-full"
              >
                <ShieldCheck className="h-4 w-4" />
                Firmar edición con qFirma
              </Button>
            </Paso>
          </CardContent>
        </Card>
      </div>

      <FirmaModal
        open={firmaOpen}
        onOpenChange={setFirmaOpen}
        titulo="Firmar edición con qFirma"
        documento="Periódico Oficial No. 43, Tomo CLIX"
      />
    </div>
  )
}

function Paso({
  n,
  titulo,
  desc,
  hecho,
  children,
}: {
  n: number
  titulo: string
  desc: string
  hecho: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            hecho
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {hecho ? <CheckCircle2 className="h-3.5 w-3.5" /> : n}
        </span>
        <div>
          <p className="text-sm font-medium">{titulo}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
