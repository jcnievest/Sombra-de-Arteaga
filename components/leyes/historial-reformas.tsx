"use client"

import { useMemo, useState } from "react"
import { Search, Eye, Download, GitCompare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  type Ley,
  TIPOS_MOVIMIENTO,
  tipoMovimientoColor,
  type TipoMovimiento,
} from "@/lib/leyes"
import { formatFecha } from "@/lib/data"

export function HistorialReformas({ ley }: { ley: Ley }) {
  const [query, setQuery] = useState("")
  const [anio, setAnio] = useState("Todos")
  const [tipo, setTipo] = useState<TipoMovimiento | "Todos">("Todos")
  const [articulo, setArticulo] = useState("")

  const anios = useMemo(() => {
    const set = new Set(ley.movimientos.map((m) => m.fecha.slice(0, 4)))
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [ley])

  const filtrados = useMemo(() => {
    return [...ley.movimientos]
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .filter((m) => {
        const q = query.trim().toLowerCase()
        const matchQ =
          !q ||
          m.descripcion.toLowerCase().includes(q) ||
          m.numeroPeriodico.toLowerCase().includes(q) ||
          m.articulos.toLowerCase().includes(q)
        const matchAnio = anio === "Todos" || m.fecha.startsWith(anio)
        const matchTipo = tipo === "Todos" || m.tipo === tipo
        const matchArt =
          !articulo.trim() || m.articulos.toLowerCase().includes(articulo.trim().toLowerCase())
        return matchQ && matchAnio && matchTipo && matchArt
      })
  }, [ley, query, anio, tipo, articulo])

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en reformas..."
            className="pl-9"
            aria-label="Buscar dentro de reformas"
          />
        </div>
        <Select value={anio} onValueChange={(v) => setAnio(v ?? "Todos")}>
          <SelectTrigger aria-label="Filtrar por año">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos los años</SelectItem>
            {anios.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tipo} onValueChange={(v) => setTipo((v as TipoMovimiento) ?? "Todos")}>
          <SelectTrigger aria-label="Filtrar por tipo de movimiento">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos los movimientos</SelectItem>
            {TIPOS_MOVIMIENTO.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={articulo}
          onChange={(e) => setArticulo(e.target.value)}
          placeholder="Filtrar por artículo (p. ej. 27)"
          aria-label="Filtrar por artículo"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Periódico</TableHead>
              <TableHead>Movimiento</TableHead>
              <TableHead className="hidden md:table-cell">Descripción</TableHead>
              <TableHead className="hidden lg:table-cell">Artículos</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="whitespace-nowrap text-sm">{formatFecha(m.fecha)}</TableCell>
                <TableCell className="whitespace-nowrap text-sm font-medium">
                  {m.numeroPeriodico}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={tipoMovimientoColor(m.tipo)}>
                    {m.tipo}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-xs text-sm text-muted-foreground">
                  {m.descripcion}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm">{m.articulos}</TableCell>
                <TableCell>
                  <span className="text-xs font-medium">{m.estatus}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Ver publicación">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Descargar PDF">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Comparar">
                      <GitCompare className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No hay movimientos que coincidan con los filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
