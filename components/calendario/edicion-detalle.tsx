"use client"

import Link from "next/link"
import {
  ShieldCheck,
  FileText,
  ListOrdered,
  BadgeCheck,
  Clock,
  Fingerprint,
  X,
} from "lucide-react"
import { type Edicion, tipoEdicionColor } from "@/lib/ediciones"
import { formatFecha } from "@/lib/data"
import { BotonDescargarEdicion } from "@/components/boton-descargar-edicion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrSimulado } from "@/components/qr-simulado"

interface Props {
  edicion: Edicion | null
  onCerrar?: () => void
}

export function EdicionDetalle({ edicion, onCerrar }: Props) {
  if (!edicion) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">Selecciona un día con publicación</p>
        <p className="text-xs text-muted-foreground">
          Verás aquí el detalle de la edición del Periódico Oficial, su firma
          electrónica y opciones de consulta.
        </p>
      </div>
    )
  }

  const hashCorto = `${edicion.hash.slice(0, 16)}…${edicion.hash.slice(-8)}`

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">
            {formatFecha(edicion.fecha)}
          </p>
          <h3 className="font-serif text-xl font-semibold">
            Periódico Oficial No. {edicion.numero}
          </h3>
          <p className="text-xs text-muted-foreground">{edicion.tomo}</p>
        </div>
        {onCerrar && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 lg:hidden"
            onClick={onCerrar}
            aria-label="Cerrar detalle"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={tipoEdicionColor(edicion.tipo)}>
          Edición {edicion.tipo}
        </Badge>
        <Badge
          variant="outline"
          className="gap-1 border-primary/30 bg-secondary/50 text-foreground"
        >
          <BadgeCheck className="h-3 w-3" />
          Edición auténtica y verificable
        </Badge>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Documentos incluidos</dt>
          <dd className="font-medium">{edicion.documentos.length}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Páginas</dt>
          <dd className="font-medium">{edicion.paginas}</dd>
        </div>
        <div className="col-span-2">
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            Firma electrónica
          </dt>
          <dd className="font-medium">qFirma / Firma Electrónica Avanzada</dd>
        </div>
        <div className="col-span-2">
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <Fingerprint className="h-3 w-3" />
            Hash de edición (SHA-256)
          </dt>
          <dd className="break-all font-mono text-xs">{hashCorto}</dd>
        </div>
        <div className="col-span-2">
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Sello de tiempo
          </dt>
          <dd className="font-mono text-xs">{edicion.selloTiempo}</dd>
        </div>
      </dl>

      <div className="flex items-center gap-4 rounded-md border border-border bg-secondary/30 p-3">
        <QrSimulado value={`${edicion.numero}-${edicion.hash}`} size={84} />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium">QR de verificación pública</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Escanea para validar la autenticidad e integridad de esta edición
            firmada con qFirma.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button render={<Link href={`/calendario/edicion/${edicion.id}`} />} size="sm">
          <FileText className="h-4 w-4" />
          Ver edición completa
        </Button>
        <BotonDescargarEdicion
          edicion={edicion}
          variant="outline"
          label="Descargar PDF"
        />
        <Button render={<Link href={`/calendario/edicion/${edicion.id}`} />} variant="outline" size="sm">
          <ListOrdered className="h-4 w-4" />
          Ver índice
        </Button>
        <Button render={<Link href="/verificar" />} variant="outline" size="sm">
          <ShieldCheck className="h-4 w-4" />
          Validar autenticidad
        </Button>
      </div>
    </div>
  )
}
