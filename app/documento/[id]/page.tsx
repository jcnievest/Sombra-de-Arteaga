import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ShieldCheck,
  Download,
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Hash,
  FileText,
  CheckCircle2,
  PenLine,
  Workflow,
} from "lucide-react"
import { getDocumento, formatFecha } from "@/lib/data"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { QrSimulado } from "@/components/qr-simulado"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default async function DocumentoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const doc = getDocumento(id)
  if (!doc) notFound()

  const cadenaFirmas = [
    {
      nombre: doc.firmante,
      cargo: doc.cargoFirmante,
      fecha: `${formatFecha(doc.fechaPublicacion)} · ${doc.horaPublicacion} h`,
      rol: "Firmante institucional",
    },
    {
      nombre: "Lic. Jorge Alberto Ramírez Núñez",
      cargo: "Director del Periódico Oficial",
      fecha: `${formatFecha(doc.fechaPublicacion)} · 07:45 h`,
      rol: "Validación editorial",
    },
    {
      nombre: "Sistema de Sellado de Tiempo",
      cargo: "Autoridad Certificadora del Estado",
      fecha: `${formatFecha(doc.fechaPublicacion)} · 08:00 h`,
      rol: "Sello de tiempo (TSA)",
    },
  ]

  const trazabilidad = [
    {
      etapa: "Solicitud recibida",
      detalle: "Ingreso por ventanilla electrónica de la dependencia.",
      fecha: `${formatFecha(doc.fechaPublicacion)} · 09:14 h`,
    },
    {
      etapa: "Solicitud firmada con qFirma",
      detalle: `${doc.dependencia}`,
      fecha: `${formatFecha(doc.fechaPublicacion)} · 09:20 h`,
    },
    {
      etapa: "Revisión jurídica/editorial",
      detalle: "Dictamen de procedencia y revisión de formato.",
      fecha: `${formatFecha(doc.fechaPublicacion)} · 11:30 h`,
    },
    {
      etapa: "Validación interna",
      detalle: "Aprobada por la Coordinación Editorial.",
      fecha: `${formatFecha(doc.fechaPublicacion)} · 16:05 h`,
    },
    {
      etapa: "Integración al número del periódico",
      detalle: doc.numeroPeriodico,
      fecha: `${formatFecha(doc.fechaPublicacion)} · 18:40 h`,
    },
    {
      etapa: "Edición firmada con qFirma",
      detalle: "Firma de la edición completa por la Secretaría de Gobierno.",
      fecha: `${formatFecha(doc.fechaPublicacion)} · 07:30 h`,
    },
    {
      etapa: "Publicación oficial",
      detalle: "Disponible para consulta ciudadana.",
      fecha: `${formatFecha(doc.fechaPublicacion)} · ${doc.horaPublicacion} h`,
    },
    {
      etapa: "Verificación ciudadana disponible",
      detalle: "Validación pública por folio, hash o código QR.",
      fecha: "Permanente",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Button
          render={<Link href="/consultar" />}
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a resultados
        </Button>

        {/* Estatus de autenticidad */}
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-foreground/20 bg-secondary/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-foreground" />
            <div>
              <p className="font-semibold text-foreground">
                Documento auténtico y firmado electrónicamente
              </p>
              <p className="text-sm text-muted-foreground">
                Verificado con qFirma / Firma Electrónica Avanzada y sello de
                tiempo.
              </p>
            </div>
          </div>
          <Badge className="w-fit bg-primary text-primary-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Válido
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Columna principal */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-accent-foreground/20 bg-accent text-accent-foreground"
                  >
                    {doc.tipo}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {doc.folio}
                  </span>
                </div>
                <h1 className="text-balance font-serif text-2xl font-semibold leading-snug">
                  {doc.titulo}
                </h1>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  {doc.resumen}
                </p>

                <Separator />

                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Dato icon={Building2} label="Dependencia emisora" value={doc.dependencia} />
                  <Dato icon={FileText} label="Periódico Oficial" value={doc.numeroPeriodico} />
                  <Dato icon={Calendar} label="Fecha de publicación" value={formatFecha(doc.fechaPublicacion)} />
                  <Dato icon={Clock} label="Hora de publicación" value={`${doc.horaPublicacion} h`} />
                  <Dato icon={Building2} label="Municipio" value={doc.municipio} />
                  <Dato icon={FileText} label="Extensión" value={`${doc.paginas} páginas`} />
                </dl>

                <Separator />

                <div className="rounded-md border border-border bg-muted/40 p-3">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="h-3.5 w-3.5" />
                    Hash de integridad (SHA-256)
                  </p>
                  <p className="mt-1 break-all font-mono text-sm text-foreground">
                    {doc.hash}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button>
                    <Download className="h-4 w-4" />
                    Descargar PDF firmado
                  </Button>
                  <Button
                    render={<Link href={`/verificar?folio=${doc.folio}`} />}
                    variant="outline"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Validar autenticidad
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cadena de firmas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-lg">
                  <PenLine className="h-5 w-5 text-primary" />
                  Cadena de firmas electrónicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative flex flex-col gap-6 border-l border-border pl-6">
                  {cadenaFirmas.map((f, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border border-foreground/30 bg-secondary">
                        <CheckCircle2 className="h-3 w-3 text-foreground" />
                      </span>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {f.rol}
                      </p>
                      <p className="font-medium text-foreground">{f.nombre}</p>
                      <p className="text-sm text-muted-foreground">{f.cargo}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {f.fecha}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Trazabilidad documental */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-lg">
                  <Workflow className="h-5 w-5 text-primary" />
                  Trazabilidad documental
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative flex flex-col gap-5 border-l border-border pl-6">
                  {trazabilidad.map((t, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                      <p className="font-medium text-foreground">{t.etapa}</p>
                      {t.detalle && (
                        <p className="text-sm text-muted-foreground">
                          {t.detalle}
                        </p>
                      )}
                      {t.fecha && (
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                          {t.fecha}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Columna lateral: QR */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-base">
                  Verificación por QR
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <div className="rounded-lg border border-border bg-card p-3">
                  <QrSimulado value={doc.folio + doc.hash} size={160} />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Escanea este código para validar la autenticidad del documento
                  en línea.
                </p>
                <Separator />
                <div className="w-full text-center">
                  <p className="text-xs text-muted-foreground">Folio de verificación</p>
                  <p className="font-mono text-sm font-medium">{doc.folio}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-secondary/40">
              <CardContent className="flex flex-col gap-2 p-5">
                <ShieldCheck className="h-6 w-6 text-foreground" />
                <p className="font-medium">Certeza jurídica</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Este documento tiene plena validez legal y es trazable desde
                  su recepción hasta su publicación oficial.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}

function Dato({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}
