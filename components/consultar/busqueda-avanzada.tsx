"use client"

import { useMemo, useState } from "react"
import { SlidersHorizontal, X, Search } from "lucide-react"
import {
  documentos,
  dependencias,
  municipios,
  tiposActo,
} from "@/lib/data"
import { DocumentoCard } from "@/components/documento-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

const TODOS = "__todos__"

export function BusquedaAvanzada({ qInicial = "" }: { qInicial?: string }) {
  const [q, setQ] = useState(qInicial)
  const [fecha, setFecha] = useState("")
  const [dep, setDep] = useState(TODOS)
  const [mun, setMun] = useState(TODOS)
  const [tipo, setTipo] = useState(TODOS)
  const [periodico, setPeriodico] = useState("")
  const [folio, setFolio] = useState("")

  const resultados = useMemo(() => {
    return documentos.filter((d) => {
      const matchQ =
        !q ||
        d.titulo.toLowerCase().includes(q.toLowerCase()) ||
        d.folio.toLowerCase().includes(q.toLowerCase()) ||
        d.numeroPeriodico.toLowerCase().includes(q.toLowerCase())
      const matchFecha = !fecha || d.fechaPublicacion === fecha
      const matchDep = dep === TODOS || d.dependencia === dep
      const matchMun = mun === TODOS || d.municipio === mun
      const matchTipo = tipo === TODOS || d.tipo === tipo
      const matchPeriodico =
        !periodico ||
        d.numeroPeriodico.toLowerCase().includes(periodico.toLowerCase())
      const matchFolio =
        !folio || d.folio.toLowerCase().includes(folio.toLowerCase())
      return (
        matchQ &&
        matchFecha &&
        matchDep &&
        matchMun &&
        matchTipo &&
        matchPeriodico &&
        matchFolio
      )
    })
  }, [q, fecha, dep, mun, tipo, periodico, folio])

  const limpiar = () => {
    setQ("")
    setFecha("")
    setDep(TODOS)
    setMun(TODOS)
    setTipo(TODOS)
    setPeriodico("")
    setFolio("")
  }

  const hayFiltros =
    q || fecha || dep !== TODOS || mun !== TODOS || tipo !== TODOS || periodico || folio

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Filtros */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-medium">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros de búsqueda
              </h2>
              {hayFiltros && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limpiar}
                  className="h-auto p-1 text-xs text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                  Limpiar
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Palabra clave
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Título, contenido…"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Fecha</Label>
              <Input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Dependencia
              </Label>
              <Select value={dep} onValueChange={(v) => setDep(v ?? TODOS)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TODOS}>Todas</SelectItem>
                  {dependencias.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Municipio</Label>
              <Select value={mun} onValueChange={(v) => setMun(v ?? TODOS)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TODOS}>Todos</SelectItem>
                  {municipios.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Tipo de documento
              </Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v ?? TODOS)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TODOS}>Todos</SelectItem>
                  {tiposActo.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Número de periódico
              </Label>
              <Input
                value={periodico}
                onChange={(e) => setPeriodico(e.target.value)}
                placeholder="Ej. No. 42"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Folio</Label>
              <Input
                value={folio}
                onChange={(e) => setFolio(e.target.value)}
                placeholder="Ej. POEQ-2026-00481"
              />
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Resultados */}
      <section>
        <p className="mb-4 text-sm text-muted-foreground">
          {resultados.length}{" "}
          {resultados.length === 1
            ? "resultado encontrado"
            : "resultados encontrados"}
        </p>
        {resultados.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {resultados.map((doc) => (
              <DocumentoCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
              <p className="font-medium">Sin resultados</p>
              <p className="text-sm text-muted-foreground">
                Ajusta los filtros o la palabra clave para encontrar
                publicaciones.
              </p>
              <Button variant="outline" onClick={limpiar} className="mt-2">
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
