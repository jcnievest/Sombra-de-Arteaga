"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Paso {
  numero: number
  titulo: string
}

export function Stepper({
  pasos,
  actual,
  onSelect,
}: {
  pasos: Paso[]
  actual: number
  onSelect?: (n: number) => void
}) {
  return (
    <ol className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-0">
      {pasos.map((p, i) => {
        const completado = p.numero < actual
        const activo = p.numero === actual
        return (
          <li
            key={p.numero}
            className="flex items-center gap-3 sm:flex-1"
          >
            <button
              type="button"
              onClick={() => onSelect?.(p.numero)}
              disabled={!onSelect || p.numero > actual}
              className={cn(
                "flex items-center gap-2.5 text-left",
                onSelect && p.numero <= actual
                  ? "cursor-pointer"
                  : "cursor-default",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  completado &&
                    "border-primary bg-primary text-primary-foreground",
                  activo &&
                    "border-primary bg-primary/10 text-foreground",
                  !completado &&
                    !activo &&
                    "border-border bg-card text-muted-foreground",
                )}
              >
                {completado ? <Check className="h-4 w-4" /> : p.numero}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  activo ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {p.titulo}
              </span>
            </button>
            {i < pasos.length - 1 && (
              <span className="mx-2 hidden h-px flex-1 bg-border sm:block" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
