"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react"
import { dependencias, municipios, tiposActo } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BuscadorPrincipal({
  compact = false,
}: {
  compact?: boolean
}) {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [advanced, setAdvanced] = useState(false)
  const [fecha, setFecha] = useState("")
  const [dependencia, setDependencia] = useState("")
  const [municipio, setMunicipio] = useState("")
  const [tipo, setTipo] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set("q", q.trim())
    if (fecha) params.set("fecha", fecha)
    if (dependencia) params.set("dependencia", dependencia)
    if (municipio) params.set("municipio", municipio)
    if (tipo) params.set("tipo", tipo)
    router.push(`/consultar${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const clearFilters = () => {
    setFecha("")
    setDependencia("")
    setMunicipio("")
    setTipo("")
  }

  const hasFilters = Boolean(fecha || dependencia || municipio || tipo)

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="busqueda-principal"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por palabra clave, título o número de periódico…"
            className="h-11 bg-background pl-9 text-foreground caret-primary placeholder:text-muted-foreground"
            aria-label="Palabra clave"
          />
        </div>
        <Button type="submit" size="lg" className="h-11 px-6">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </div>

      {!compact && (
        <div className="mt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-2 text-card-foreground"
            onClick={() => setAdvanced((value) => !value)}
            aria-expanded={advanced}
            aria-controls="filtros-avanzados"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros avanzados
            <ChevronDown className={`h-4 w-4 transition-transform ${advanced ? "rotate-180" : ""}`} />
          </Button>

          {advanced && (
          <div id="filtros-avanzados" className="mt-3 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filtro-fecha" className="text-xs text-muted-foreground">Fecha</Label>
            <Input id="filtro-fecha" name="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="h-10" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filtro-dependencia" className="text-xs text-muted-foreground">Dependencia</Label>
            <Select value={dependencia} onValueChange={(value) => setDependencia(value ?? "")}>
              <SelectTrigger id="filtro-dependencia" aria-label="Dependencia" className="h-10 w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                {dependencias.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filtro-municipio" className="text-xs text-muted-foreground">Municipio</Label>
            <Select value={municipio} onValueChange={(value) => setMunicipio(value ?? "")}>
              <SelectTrigger id="filtro-municipio" aria-label="Municipio" className="h-10 w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {municipios.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filtro-tipo" className="text-xs text-muted-foreground">
              Tipo de documento
            </Label>
            <Select value={tipo} onValueChange={(value) => setTipo(value ?? "")}>
              <SelectTrigger id="filtro-tipo" aria-label="Tipo de documento" className="h-10 w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {tiposActo.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {hasFilters && (
            <div className="sm:col-span-2 lg:col-span-4">
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" /> Limpiar filtros
              </Button>
            </div>
          )}
          </div>
          )}
        </div>
      )}
    </form>
  )
}
