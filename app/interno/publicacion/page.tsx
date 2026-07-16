import Link from "next/link"
import {
  BadgeCheck,
  Download,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  Hash,
  FileText,
  Building2,
} from "lucide-react"
import { formatFecha } from "@/lib/data"
import { getEdicionPorNumero } from "@/lib/ediciones"
import { QrSimulado } from "@/components/qr-simulado"
import { BotonDescargarEdicion } from "@/components/boton-descargar-edicion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const constancia = {
  edicion: "No. 43, Tomo CLIX",
  fecha: "2026-06-19",
  hora: "08:00",
  folio: "EDI-POEQ-2026-043",
  hash: "a3f5e8c1d9b74206e8f1c0a4d6b29375f0e1a8c4b6d23e9f7a05c1b8d4e6f209",
  firmante: "Lic. María Fernanda Reyes Olvera",
  cargo: "Secretaria de Gobierno",
  documentos: 5,
}

export default function PublicacionPage() {
  const edicion = getEdicionPorNumero(43)
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">
          Publicación oficial
        </h1>
        <p className="text-sm text-muted-foreground">
          Constancia electrónica firmada con qFirma de la edición publicada en
          el Periódico Oficial.
        </p>
      </div>

      {/* Confirmación */}
      <Card className="border-border bg-secondary/40">
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <BadgeCheck className="h-8 w-8" />
          </span>
          <h2 className="font-serif text-xl font-semibold">
            Edición publicada oficialmente
          </h2>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            El Periódico Oficial {constancia.edicion} fue firmado con qFirma /
            Firma Electrónica Avanzada y se encuentra disponible para consulta
            ciudadana.
          </p>
          <Badge className="bg-primary text-primary-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Constancia electrónica vigente
          </Badge>
        </CardContent>
      </Card>

      {/* Constancia electrónica de publicación oficial */}
      <Card className="overflow-hidden border-foreground/25 py-0">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-primary px-6 py-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-foreground/15">
              <BadgeCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
                Documento institucional
              </p>
              <p className="font-serif text-lg font-semibold">
                Constancia electrónica de publicación oficial
              </p>
            </div>
          </div>
          <Badge className="hidden bg-primary-foreground/15 text-primary-foreground sm:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Firmada con qFirma
          </Badge>
        </div>

        <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Edición publicada
              </p>
              <p className="font-serif text-lg font-semibold">
                Periódico Oficial {constancia.edicion}
              </p>
            </div>

            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Dato icon={Calendar} label="Fecha de publicación" value={formatFecha(constancia.fecha)} />
              <Dato icon={Clock} label="Hora" value={`${constancia.hora} h`} />
              <Dato icon={FileText} label="Documentos publicados" value={`${constancia.documentos} actos`} />
              <Dato icon={Building2} label="Firmante institucional" value={constancia.firmante} />
              <Dato icon={ShieldCheck} label="Sello de tiempo" value="Válido (TSA del Estado)" />
              <Dato icon={BadgeCheck} label="Tipo de firma" value="qFirma / Firma Electrónica Avanzada" />
            </dl>

            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Folio de la edición</p>
              <p className="font-mono text-sm font-medium">{constancia.folio}</p>
            </div>

            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                Sello digital de la edición (SHA-256)
              </p>
              <p className="mt-1 break-all font-mono text-sm">{constancia.hash}</p>
            </div>

            <div className="rounded-md border border-foreground/20 bg-secondary/40 p-3">
              <p className="text-xs text-muted-foreground">Firmado por</p>
              <p className="text-sm font-medium text-foreground">
                {constancia.firmante}
              </p>
              <p className="text-xs text-muted-foreground">{constancia.cargo}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 md:border-l md:border-border md:pl-6">
            <div className="rounded-lg border border-border bg-card p-3">
              <QrSimulado value={constancia.folio + constancia.hash} size={150} />
            </div>
            <p className="max-w-[150px] text-center text-xs text-muted-foreground">
              QR de validación pública de la edición
            </p>
            <Separator className="md:hidden" />
            <div className="flex w-full flex-col gap-2">
              <Button className="w-full">
                <Download className="h-4 w-4" />
                Descargar constancia
              </Button>
              {edicion ? (
                <BotonDescargarEdicion
                  edicion={edicion}
                  variant="outline"
                  className="w-full"
                  label="Descargar edición completa"
                />
              ) : (
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4" />
                  Descargar edición completa
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button render={<Link href="/" />}>
          <ExternalLink className="h-4 w-4" />
          Ver en portal ciudadano
        </Button>
      </div>
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
