import {
  estatusSolicitudColor,
  pagoColor,
  documentoColor,
  type EstatusSolicitud,
  type EstatusPago,
  type EstatusDocumento,
} from "@/lib/ciudadano"
import { cn } from "@/lib/utils"

export function EstatusSolicitudBadge({
  estatus,
}: {
  estatus: EstatusSolicitud
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        estatusSolicitudColor(estatus),
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {estatus}
    </span>
  )
}

export function PagoBadge({ estatus }: { estatus: EstatusPago }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        pagoColor(estatus),
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {estatus}
    </span>
  )
}

export function DocumentoBadge({ estatus }: { estatus: EstatusDocumento }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        documentoColor(estatus),
      )}
    >
      {estatus}
    </span>
  )
}
