"use client"

import { useMemo, useState } from "react"
import { ArrowRight, Plus, Minus, FileText } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Ley } from "@/lib/leyes"
import { formatFecha } from "@/lib/data"
import { cn } from "@/lib/utils"

// Diff por palabras simple (prototipo)
function difTokens(anterior: string, vigente: string) {
  const a = anterior.split(/(\s+)/)
  const b = vigente.split(/(\s+)/)
  const setA = new Set(a.map((t) => t.toLowerCase().trim()).filter(Boolean))
  const setB = new Set(b.map((t) => t.toLowerCase().trim()).filter(Boolean))
  const eliminados = a.map((t) => ({
    t,
    estado: t.trim() && !setB.has(t.toLowerCase().trim()) ? "del" : "igual",
  }))
  const agregados = b.map((t) => ({
    t,
    estado: t.trim() && !setA.has(t.toLowerCase().trim()) ? "add" : "igual",
  }))
  return { eliminados, agregados }
}

export function ComparadorVersiones({ ley }: { ley: Ley }) {
  // Artículos con al menos 2 versiones
  const articulosComparables = ley.articulos.filter((a) => a.versiones.length >= 2)
  const [articuloNum, setArticuloNum] = useState(
    articulosComparables[0]?.numero ?? ley.articulos[0]?.numero ?? "",
  )

  const articulo = ley.articulos.find((a) => a.numero === articuloNum)
  const versiones = articulo?.versiones ?? []

  const [idxAnterior, setIdxAnterior] = useState(0)
  const [idxVigente, setIdxVigente] = useState(Math.max(0, versiones.length - 1))

  const vAnterior = versiones[Math.min(idxAnterior, versiones.length - 1)]
  const vVigente = versiones[Math.min(idxVigente, versiones.length - 1)]

  const diff = useMemo(
    () => (vAnterior && vVigente ? difTokens(vAnterior.texto, vVigente.texto) : null),
    [vAnterior, vVigente],
  )

  if (articulosComparables.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        Este ordenamiento no cuenta con artículos con versiones comparables registradas.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Selección */}
      <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Artículo</label>
          <Select
            value={articuloNum}
            onValueChange={(v) => {
              const num = v ?? articuloNum
              setArticuloNum(num)
              const art = ley.articulos.find((a) => a.numero === num)
              setIdxAnterior(0)
              setIdxVigente(Math.max(0, (art?.versiones.length ?? 1) - 1))
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {articulosComparables.map((a) => (
                <SelectItem key={a.numero} value={a.numero}>
                  Artículo {a.numero}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Versión anterior</label>
          <Select value={String(idxAnterior)} onValueChange={(v) => setIdxAnterior(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versiones.map((v, i) => (
                <SelectItem key={i} value={String(i)}>
                  {v.etiqueta} — {formatFecha(v.fecha)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Versión vigente</label>
          <Select value={String(idxVigente)} onValueChange={(v) => setIdxVigente(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versiones.map((v, i) => (
                <SelectItem key={i} value={String(i)}>
                  {v.etiqueta} — {formatFecha(v.fecha)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-primary/15 ring-1 ring-primary/40" />
          Texto agregado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-destructive/10 ring-1 ring-destructive/40" />
          Texto eliminado
        </span>
        <span className="flex items-center gap-1.5">
          <Badge variant="outline" className="bg-foreground/10 text-foreground border-foreground/30">
            Artículo {articuloNum}
          </Badge>
          reformado
        </span>
      </div>

      {/* Comparación lado a lado */}
      {vAnterior && vVigente && diff && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-xs font-semibold text-muted-foreground">Texto anterior</span>
              <Badge variant="outline">{vAnterior.etiqueta}</Badge>
            </div>
            <div className="p-4">
              <p className="text-sm leading-relaxed">
                {diff.eliminados.map((tok, i) => (
                  <span
                    key={i}
                    className={cn(
                      tok.estado === "del" &&
                        "rounded-sm bg-destructive/10 px-0.5 text-foreground line-through decoration-destructive/60",
                    )}
                  >
                    {tok.t}
                  </span>
                ))}
              </p>
              <p className="mt-3 text-[11px] text-muted-foreground">
                {vAnterior.numeroPeriodico} · {formatFecha(vAnterior.fecha)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-primary/30 bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-xs font-semibold text-primary">Texto reformado (vigente)</span>
              <Badge variant="outline" className="bg-primary text-primary-foreground border-primary">
                {vVigente.etiqueta}
              </Badge>
            </div>
            <div className="p-4">
              <p className="text-sm leading-relaxed">
                {diff.agregados.map((tok, i) => (
                  <span
                    key={i}
                    className={cn(
                      tok.estado === "add" && "rounded-sm bg-primary/15 px-0.5 font-medium text-foreground",
                    )}
                  >
                    {tok.t}
                  </span>
                ))}
              </p>
              <p className="mt-3 text-[11px] text-muted-foreground">
                {vVigente.numeroPeriodico} · {formatFecha(vVigente.fecha)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de cambios */}
      <div className="rounded-lg border border-border bg-secondary/40 p-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-primary" />
          Cambios detectados
        </h4>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Plus className="h-4 w-4" />
            </span>
            <span>
              <span className="font-semibold">{diff?.agregados.filter((t) => t.estado === "add").length ?? 0}</span>{" "}
              fragmentos agregados
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/10 text-destructive">
              <Minus className="h-4 w-4" />
            </span>
            <span>
              <span className="font-semibold">{diff?.eliminados.filter((t) => t.estado === "del").length ?? 0}</span>{" "}
              fragmentos eliminados
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span>
              Entrada en vigor: <span className="font-medium">{vVigente && formatFecha(vVigente.fecha)}</span>
            </span>
          </div>
        </div>
        {vVigente && (
          <p className="mt-3 text-xs text-muted-foreground">
            Publicado en el Periódico Oficial {vVigente.numeroPeriodico}.
          </p>
        )}
      </div>
    </div>
  )
}
