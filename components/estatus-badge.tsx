import type { EstatusInterno } from "@/lib/data"
import { estatusColor } from "@/lib/data"
import { cn } from "@/lib/utils"

export function EstatusBadge({ estatus }: { estatus: EstatusInterno }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        estatusColor(estatus),
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {estatus}
    </span>
  )
}
