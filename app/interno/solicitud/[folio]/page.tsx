"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  FileText,
  Scale,
  User,
  CheckCircle2,
  AlertTriangle,
  Send,
  ShieldCheck,
  History,
  Hash,
  Upload,
  Layers,
} from "lucide-react"
import { toast } from "sonner"
import { getSolicitud, formatFecha } from "@/lib/data"
import { EstatusBadge } from "@/components/estatus-badge"
import { FirmaModal } from "@/components/firma-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function RevisionSolicitudPage({
  params,
}: {
  params: Promise<{ folio: string }>
}) {
  const { folio } = use(params)
  const solicitud = getSolicitud(decodeURIComponent(folio))

  const [firmaAbierta, setFirmaAbierta] = useState(false)
  const [firmaVersionAbierta, setFirmaVersionAbierta] = useState(false)
  const [obs, setObs] = useState("")

  if (!solicitud) return notFound()

  const esObservada = solicitud.estatus === "Observado"

  const observar = () => {
    if (!obs.trim()) {
      toast.error("Escribe al menos una observación antes de enviar.")
      return
    }
    toast.success("Observaciones enviadas a la dependencia", {
      description: `Folio ${solicitud.folio} regresado para corrección.`,
    })
    setObs("")
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Button
          render={<Link href="/interno/solicitudes" />}
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la bandeja
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {solicitud.folio}
              </Badge>
              <Badge variant="secondary">{solicitud.tipo}</Badge>
            </div>
            <h1 className="font-serif text-2xl font-semibold text-balance">
              {solicitud.documento}
            </h1>
          </div>
          <EstatusBadge estatus={solicitud.estatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Datos de la solicitud */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">
                Datos de la solicitud
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Dato icon={Building2} label="Dependencia" valor={solicitud.dependencia} />
              <Dato icon={User} label="Solicitante" valor={solicitud.solicitante} sub={solicitud.cargoSolicitante} />
              <Dato icon={CalendarDays} label="Fecha de recepción" valor={formatFecha(solicitud.fechaRecepcion)} />
              <Dato icon={FileText} label="Extensión" valor={`${solicitud.paginas} páginas`} />
              <Dato icon={Building2} label="Municipio" valor={solicitud.municipio} />
              <Dato icon={User} label="Responsable" valor={solicitud.responsable} />
              <div className="sm:col-span-2">
                <Dato icon={Scale} label="Fundamento legal" valor={solicitud.fundamento} />
              </div>
            </CardContent>
          </Card>

          {/* Vista previa del documento */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">
                Vista previa del documento
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {solicitud.resumen}
              </p>
              <div className="rounded-md border border-dashed border-border bg-muted/30 p-8 text-center">
                <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {solicitud.documento}.pdf
                </p>
                <p className="text-xs text-muted-foreground">
                  {solicitud.paginas} páginas · Documento adjunto por la dependencia
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Solicitud observada */}
          {esObservada && (
            <Card className="border-foreground/40 bg-secondary/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-foreground/40 text-foreground"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Solicitud observada
                  </Badge>
                </div>
                <CardTitle className="mt-1 font-serif text-lg">
                  Esta solicitud fue devuelta para corrección
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Motivo de observación
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    Documentación incompleta y datos a corregir antes de su
                    validación.
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Comentarios del revisor
                  </p>
                  <ul className="flex flex-col gap-2">
                    {solicitud.observaciones.map((o, i) => (
                      <li
                        key={i}
                        className="flex gap-2 rounded-md border border-border bg-card p-3 text-sm"
                      >
                        <span className="font-mono text-xs text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Revisor: {solicitud.responsable}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Layers className="h-3.5 w-3.5" />
                    Historial de versiones
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      {
                        v: "v2",
                        estado: "En corrección por la dependencia",
                        fecha: formatFecha(solicitud.fechaRecepcion),
                        actual: true,
                      },
                      {
                        v: "v1",
                        estado: "Devuelta con observaciones",
                        fecha: formatFecha(solicitud.fechaRecepcion),
                        actual: false,
                      },
                    ].map((ver) => (
                      <li
                        key={ver.v}
                        className="flex items-center justify-between gap-3 rounded-md border border-border bg-card p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-mono text-xs font-semibold">
                            {ver.v}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{ver.estado}</p>
                            <p className="text-xs text-muted-foreground">
                              {ver.fecha}
                            </p>
                          </div>
                        </div>
                        {ver.actual && (
                          <Badge variant="secondary" className="text-xs">
                            Versión actual
                          </Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast.success("Selecciona el archivo PDF corregido", {
                        description: "Se generará una nueva versión de la solicitud.",
                      })
                    }
                  >
                    <Upload className="h-4 w-4" />
                    Subir versión corregida
                  </Button>
                  <Button onClick={() => setFirmaVersionAbierta(true)}>
                    <ShieldCheck className="h-4 w-4" />
                    Firmar nueva versión con qFirma
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observaciones existentes */}
          {!esObservada && solicitud.observaciones.length > 0 && (
            <Card className="border-foreground/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-lg">
                  <AlertTriangle className="h-5 w-5 text-foreground" />
                  Observaciones registradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2">
                  {solicitud.observaciones.map((o, i) => (
                    <li
                      key={i}
                      className="flex gap-2 rounded-md bg-muted p-3 text-sm"
                    >
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Historial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <History className="h-5 w-5 text-muted-foreground" />
                Historial de seguimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-0">
                {solicitud.historial.map((h, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      {i < solicitud.historial.length - 1 && (
                        <span className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="pb-5">
                      <p className="text-sm font-medium">{h.evento}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFecha(h.fecha)} · {h.hora} h · {h.actor}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Panel de acciones */}
        <div className="flex flex-col gap-6">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="font-serif text-lg">
                Dictamen de revisión
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="obs">Observaciones a la dependencia</Label>
                <Textarea
                  id="obs"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Describe las correcciones requeridas…"
                  rows={4}
                />
              </div>
              <Button variant="outline" onClick={observar}>
                <Send className="h-4 w-4" />
                Devolver con observaciones
              </Button>
              <Separator />
              <Button onClick={() => setFirmaAbierta(true)}>
                <ShieldCheck className="h-4 w-4" />
                Validar y firmar dictamen
              </Button>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />
                Al validar, la solicitud queda lista para programarse en una edición.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-2 p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <Hash className="h-4 w-4" />
                <span className="font-medium">Integridad</span>
              </div>
              <p>
                El documento se sellará con SHA-256 al validarse y se vinculará a
                la qFirma / Firma Electrónica Avanzada del revisor.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <FirmaModal
        open={firmaAbierta}
        onOpenChange={setFirmaAbierta}
        titulo="Validar dictamen de revisión"
        documento={solicitud.documento}
        onFirmado={() =>
          toast.success("Dictamen validado", {
            description: "La solicitud avanzó a estatus Validado.",
          })
        }
      />

      <FirmaModal
        open={firmaVersionAbierta}
        onOpenChange={setFirmaVersionAbierta}
        titulo="Firmar nueva versión con qFirma"
        documento={solicitud.documento}
        onFirmado={() =>
          toast.success("Nueva versión firmada", {
            description: "La versión corregida se reenvió a revisión.",
          })
        }
      />
    </div>
  )
}

function Dato({
  icon: Icon,
  label,
  valor,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  valor: string
  sub?: string
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium leading-snug">{valor}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  )
}
