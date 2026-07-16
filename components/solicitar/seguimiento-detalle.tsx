"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  Upload,
  AlertTriangle,
  CalendarClock,
  History,
  CheckCircle2,
  ShieldCheck,
  Hash,
  Download,
  CreditCard,
  Send,
} from "lucide-react"
import { toast } from "sonner"
import {
  type SolicitudCiudadana,
} from "@/lib/ciudadano"
import { formatFecha } from "@/lib/data"
import {
  EstatusSolicitudBadge,
  PagoBadge,
  DocumentoBadge,
} from "@/components/ciudadano-badges"
import { QrSimulado } from "@/components/qr-simulado"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function SeguimientoDetalle({ s }: { s: SolicitudCiudadana }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        render={<Link href="/solicitar/seguimiento" />}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis solicitudes
      </Button>

      {/* Encabezado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{s.folio}</p>
          <h1 className="text-balance font-serif text-2xl font-semibold sm:text-3xl">
            {s.documento}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {s.tipoPublicacion} · {s.tipoSolicitante}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <EstatusSolicitudBadge estatus={s.estatus} />
          <PagoBadge estatus={s.pago} />
        </div>
      </div>

      {/* Publicación realizada */}
      {s.estatus === "Publicada" && s.publicacion && (
        <PublicacionRealizada s={s} />
      )}

      {/* Solicitud observada */}
      {s.estatus === "Observada" && <SolicitudObservada s={s} />}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {/* Datos generales */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">
                Datos de la solicitud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Dato label="Solicitante" value={s.solicitante} />
                <Dato label="Tipo de solicitante" value={s.tipoSolicitante} />
                <Dato label="Correo" value={s.correo} />
                <Dato label="Teléfono" value={s.telefono} />
                {s.rfc && <Dato label="RFC" value={s.rfc} mono />}
                <Dato
                  label="Fecha de solicitud"
                  value={formatFecha(s.fechaSolicitud)}
                />
              </dl>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {s.documentos.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.nombre}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {d.descripcion}
                    </p>
                  </div>
                  <DocumentoBadge estatus={d.estatus} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Historial de versiones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <History className="h-5 w-5 text-primary" />
                Historial de versiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-3">
                {s.versiones.map((v) => (
                  <li key={v.version} className="flex items-start gap-3">
                    <span
                      className={
                        "mt-0.5 flex h-7 w-12 shrink-0 items-center justify-center rounded-full border text-xs font-semibold " +
                        (v.actual
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground")
                      }
                    >
                      {v.version}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{v.estado}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFecha(v.fecha)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Resumen lateral */}
        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-base">
                <CreditCard className="h-5 w-5 text-primary" />
                Pago de derechos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Páginas</span>
                <span className="font-medium">{s.paginas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Importe</span>
                <span className="font-serif text-lg font-semibold">
                  {s.importe.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Referencia</span>
                <span className="font-mono text-xs">{s.referenciaPago}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estatus de pago</span>
                <PagoBadge estatus={s.pago} />
              </div>
            </CardContent>
          </Card>

          {s.fechaTentativa && (
            <Card>
              <CardContent className="flex flex-col gap-1 p-5">
                <CalendarClock className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium">
                  Fecha tentativa de publicación
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFecha(s.fechaTentativa)}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-foreground/15 bg-secondary/30">
            <CardContent className="flex flex-col gap-2 p-5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">Trazabilidad garantizada</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Cada etapa queda registrada con sello de tiempo y validación
                documental con qFirma / Firma Electrónica Avanzada.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

/* ---------- Sección: Solicitud observada ---------- */
function SolicitudObservada({ s }: { s: SolicitudCiudadana }) {
  const [enviado, setEnviado] = useState(false)
  const [cargado, setCargado] = useState(false)

  return (
    <Card className="border-foreground/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <AlertTriangle className="h-5 w-5 text-foreground" />
          Solicitud observada
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Dato
            label="Documento observado"
            value="Documento a publicar (PDF)"
          />
          {s.fechaLimiteAtencion && (
            <Dato
              label="Fecha límite de atención"
              value={formatFecha(s.fechaLimiteAtencion)}
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Motivo de observación</p>
          <ul className="flex flex-col gap-2">
            {(s.observaciones ?? []).map((o, i) => (
              <li
                key={i}
                className="rounded-md border border-foreground/30 bg-muted/40 p-3 text-sm leading-relaxed"
              >
                {o}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Comentario del revisor</p>
          <p className="mt-1 text-sm leading-relaxed">
            Favor de atender las observaciones señaladas y reenviar el documento
            corregido dentro del plazo indicado para continuar con el proceso de
            publicación.
          </p>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setCargado(true)
              toast.success("Documento corregido cargado")
            }}
          >
            <Upload className="h-4 w-4" />
            {cargado ? "Documento cargado" : "Subir documento corregido"}
          </Button>
          <Button
            disabled={!cargado || enviado}
            onClick={() => {
              setEnviado(true)
              toast.success("Corrección enviada", {
                description: "Tu solicitud regresa a revisión.",
              })
            }}
          >
            <Send className="h-4 w-4" />
            {enviado ? "Corrección enviada" : "Enviar corrección"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------- Sección: Publicación realizada ---------- */
function PublicacionRealizada({ s }: { s: SolicitudCiudadana }) {
  const p = s.publicacion!
  return (
    <Card className="overflow-hidden py-0">
      <div className="flex items-center gap-3 border-b border-border bg-primary px-6 py-4 text-primary-foreground">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-foreground/15">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
            Publicación realizada
          </p>
          <p className="font-serif text-lg font-semibold">
            Publicado y verificable
          </p>
        </div>
      </div>
      <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-5">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Dato label="Número del Periódico Oficial" value={p.numeroPeriodico} />
            <Dato
              label="Fecha de publicación"
              value={formatFecha(p.fechaPublicacion)}
            />
            <Dato
              label="Página inicial y final"
              value={`${p.paginaInicial} – ${p.paginaFinal}`}
            />
            <Dato label="Folio de publicación" value={p.folioPublicacion} mono />
          </dl>

          <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3">
            <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Hash del documento publicado (SHA-256)
              </p>
              <p className="break-all font-mono text-xs">{p.hash}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              onClick={() =>
                toast.success("Descargando PDF publicado…")
              }
            >
              <Download className="h-4 w-4" />
              PDF publicado
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Descargando constancia de publicación…")
              }
            >
              <FileText className="h-4 w-4" />
              Constancia de publicación
            </Button>
            <Button
              variant="outline"
              render={<Link href="/verificar" />}
            >
              <ShieldCheck className="h-4 w-4" />
              Verificar autenticidad
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 md:border-l md:border-border md:pl-6">
          <div className="rounded-lg border border-border bg-card p-3">
            <QrSimulado value={p.folioPublicacion} size={140} />
          </div>
          <p className="max-w-[140px] text-center text-xs text-muted-foreground">
            QR de verificación pública
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function Dato({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? "break-all font-mono text-sm font-medium" : "text-sm font-medium"}>
        {value}
      </dd>
    </div>
  )
}
