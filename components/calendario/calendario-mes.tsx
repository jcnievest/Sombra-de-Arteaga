"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  edicionesDeMes,
  type Edicion,
  MESES,
  DIAS_SEMANA,
  tipoEdicionColor,
} from "@/lib/ediciones"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  anio: number
  mes: number
  seleccion: string | null
  aniosDisponibles: number[]
  onCambioMes: (mes: number) => void
  onCambioAnio: (anio: number) => void
  onSeleccionDia: (iso: string, ediciones: Edicion[]) => void
}

export function CalendarioMes({
  anio,
  mes,
  seleccion,
  aniosDisponibles,
  onCambioMes,
  onCambioAnio,
  onSeleccionDia,
}: Props) {
  const edsMes = edicionesDeMes(anio, mes)
  const porDia = new Map<string, Edicion[]>()
  for (const e of edsMes) {
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
  while (celdas.length % 7 !== 0) celdas.push(null)

  const mesAnterior = () => {
    if (mes === 0) {
      onCambioAnio(anio - 1)
      onCambioMes(11)
    } else {
      onCambioMes(mes - 1)
    }
  }
  const mesSiguiente = () => {
    if (mes === 11) {
      onCambioAnio(anio + 1)
      onCambioMes(0)
    } else {
      onCambioMes(mes + 1)
    }
  }

  const hoyIso = "2026-06-16"

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="font-serif text-xl font-semibold">
          {MESES[mes]} {anio}
        </h2>
        <div className="flex items-center gap-2">
          <Select
            value={String(mes)}
            onValueChange={(v) => v && onCambioMes(Number(v))}
          >
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((m, i) => (
                <SelectItem key={m} value={String(i)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(anio)}
            onValueChange={(v) => v && onCambioAnio(Number(v))}
          >
            <SelectTrigger className="h-9 w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aniosDisponibles.map((a) => (
                <SelectItem key={a} value={String(a)}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={mesAnterior}
              aria-label="Mes anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={mesSiguiente}
              aria-label="Mes siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 px-3 pt-3 text-center text-xs font-medium text-muted-foreground">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Cuadrícula */}
      <div className="grid grid-cols-7 gap-1 p-3">
        {celdas.map((dia, idx) => {
          if (dia === null) return <div key={`v-${idx}`} className="min-h-20" />
          const iso = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
          const eds = porDia.get(iso) ?? []
          const tiene = eds.length > 0
          const activo = seleccion === iso
          const esHoy = iso === hoyIso

          return (
            <button
              key={iso}
              type="button"
              disabled={!tiene}
              onClick={() => tiene && onSeleccionDia(iso, eds)}
              className={cn(
                "flex min-h-20 flex-col gap-1 rounded-md border p-1.5 text-left transition-colors",
                tiene
                  ? "cursor-pointer border-border bg-background hover:border-primary/50 hover:bg-secondary/40"
                  : "border-transparent bg-muted/30 text-muted-foreground",
                activo && "border-primary bg-secondary ring-1 ring-primary",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded text-xs font-medium",
                  esHoy && "bg-primary text-primary-foreground",
                )}
              >
                {dia}
              </span>
              {tiene && (
                <div className="flex flex-col gap-1">
                  {eds.length === 1 ? (
                    <span
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-[10px] font-semibold",
                        tipoEdicionColor(eds[0].tipo),
                      )}
                    >
                      No. {eds[0].numero}
                    </span>
                  ) : (
                    <span className="truncate rounded bg-primary px-1 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      {eds.length} publicaciones
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
