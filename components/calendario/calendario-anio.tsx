"use client"

import { edicionesDeMes, type Edicion, MESES } from "@/lib/ediciones"
import { cn } from "@/lib/utils"

interface Props {
  anio: number
  onSeleccionDia: (iso: string, ediciones: Edicion[], mes: number) => void
}

function MiniMes({
  anio,
  mes,
  onSeleccionDia,
}: {
  anio: number
  mes: number
  onSeleccionDia: Props["onSeleccionDia"]
}) {
  const eds = edicionesDeMes(anio, mes)
  const porDia = new Map<string, Edicion[]>()
  for (const e of eds) {
    const arr = porDia.get(e.fecha) ?? []
    arr.push(e)
    porDia.set(e.fecha, arr)
  }

  const primerDia = new Date(anio, mes, 1).getDay()
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()
  const celdas: (number | null)[] = [
    ...Array(primerDia).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ]

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <h3 className="mb-2 font-serif text-sm font-semibold">{MESES[mes]}</h3>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] text-muted-foreground">
        {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-0.5">
        {celdas.map((dia, idx) => {
          if (dia === null) return <div key={`v-${idx}`} className="aspect-square" />
          const iso = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
          const dEds = porDia.get(iso) ?? []
          const tiene = dEds.length > 0
          return (
            <button
              key={iso}
              type="button"
              disabled={!tiene}
              onClick={() => tiene && onSeleccionDia(iso, dEds, mes)}
              title={
                tiene
                  ? `No. ${dEds.map((e) => e.numero).join(", No. ")}`
                  : undefined
              }
              className={cn(
                "flex aspect-square items-center justify-center rounded text-[10px] transition-colors",
                tiene
                  ? "cursor-pointer bg-primary font-semibold text-primary-foreground hover:opacity-80"
                  : "text-muted-foreground/60",
              )}
            >
              {dia}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function CalendarioAnio({ anio, onSeleccionDia }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {MESES.map((_, mes) => (
        <MiniMes
          key={mes}
          anio={anio}
          mes={mes}
          onSeleccionDia={onSeleccionDia}
        />
      ))}
    </div>
  )
}
