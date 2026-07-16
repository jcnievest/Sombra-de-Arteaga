import { Newspaper, FileText, GitCompare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Ley, tipoMovimientoColor } from "@/lib/leyes"
import { formatFecha } from "@/lib/data"

export function LineaTiempo({ ley }: { ley: Ley }) {
  const eventos = [...ley.movimientos].sort((a, b) => a.fecha.localeCompare(b.fecha))

  return (
    <div className="relative">
      {/* Línea vertical */}
      <div className="absolute bottom-0 left-4 top-2 w-px bg-border sm:left-5" aria-hidden="true" />

      <ol className="flex flex-col gap-6">
        {eventos.map((ev, i) => {
          const esVigente = ev.estatus === "Vigente"
          return (
            <li key={ev.id} className="relative flex gap-4 sm:gap-5">
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10 ${
                  esVigente
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <Newspaper className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>

              <div className="flex-1 rounded-lg border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={tipoMovimientoColor(ev.tipo)}>
                      {ev.tipo}
                    </Badge>
                    {esVigente && (
                      <Badge variant="outline" className="bg-secondary text-secondary-foreground border-foreground/20">
                        Última reforma vigente
                      </Badge>
                    )}
                  </div>
                  <time className="text-sm font-semibold">{formatFecha(ev.fecha)}</time>
                </div>

                <p className="mt-2 text-sm leading-relaxed">{ev.descripcion}</p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{ev.numeroPeriodico}</span>
                  <span>Artículos: {ev.articulos}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Newspaper className="h-4 w-4" />
                    Ver periódico
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                    Ver documento
                  </Button>
                  <Button variant="ghost" size="sm">
                    <GitCompare className="h-4 w-4" />
                    Comparar
                  </Button>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
