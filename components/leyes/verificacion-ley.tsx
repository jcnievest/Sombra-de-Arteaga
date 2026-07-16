import { ShieldCheck, Clock, Link2, QrCode } from "lucide-react"
import { QrSimulado } from "@/components/qr-simulado"
import { formatFecha } from "@/lib/data"

interface VerificacionLeyProps {
  hash: string
  selloTiempo: string
  fechaUltimaReforma: string
  qrValue: string
  compacto?: boolean
}

export function VerificacionLey({
  hash,
  selloTiempo,
  fechaUltimaReforma,
  qrValue,
  compacto = false,
}: VerificacionLeyProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-primary">
        <ShieldCheck className="h-5 w-5" />
        <h3 className="font-serif text-sm font-semibold text-foreground">
          Documento vigente verificable
        </h3>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Versión consolidada con trazabilidad normativa. Validación mediante qFirma / Firma
        Electrónica Avanzada.
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col items-center gap-2 rounded-md border border-border bg-background p-3">
          <QrSimulado value={qrValue} size={compacto ? 96 : 120} />
          <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <QrCode className="h-3 w-3" />
            Verificación pública
          </span>
        </div>

        <dl className="flex-1 space-y-3 text-xs">
          <div>
            <dt className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <Link2 className="h-3.5 w-3.5" />
              Hash SHA-256
            </dt>
            <dd className="mt-0.5 break-all font-mono text-[11px] leading-relaxed text-foreground">
              {hash}
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <dt className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Sello de tiempo
              </dt>
              <dd className="mt-0.5 font-mono text-[11px] text-foreground">{selloTiempo}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Última reforma vigente</dt>
              <dd className="mt-0.5 text-foreground">{formatFecha(fechaUltimaReforma)}</dd>
            </div>
          </div>
          <p className="rounded-md bg-secondary px-3 py-2 text-[11px] leading-relaxed text-secondary-foreground">
            Publicaciones oficiales vinculadas a La Sombra de Arteaga. Versión vigente generada a
            partir de publicaciones oficiales del Periódico Oficial del Estado.
          </p>
        </dl>
      </div>
    </div>
  )
}
