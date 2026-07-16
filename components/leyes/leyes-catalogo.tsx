"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  FileText,
  Download,
  History,
  ShieldCheck,
  ArrowUpDown,
  Scale,
} from "lucide-react"
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
  leyes,
  MATERIAS,
  ESTATUS_LEY,
  materiaColor,
  estatusLeyColor,
  type MateriaLey,
  type EstatusLey,
} from "@/lib/leyes"
import { formatFecha } from "@/lib/data"
import { cn } from "@/lib/utils"

type Orden = "alfabetico" | "consultadas" | "recientes" | "reforma"

const ordenLabels: Record<Orden, string> = {
  alfabetico: "Alfabético (A-Z)",
  consultadas: "Más consultadas",
  recientes: "Más recientes",
  reforma: "Última reforma",
}

export function LeyesCatalogo() {
  const [query, setQuery] = useState("")
  const [materia, setMateria] = useState<MateriaLey | "Todas">("Todas")
  const [estatus, setEstatus] = useState<EstatusLey | "Todos">("Todos")
  const [anioReforma, setAnioReforma] = useState<string>("Todos")
  const [orden, setOrden] = useState<Orden>("alfabetico")
  const [vista, setVista] = useState<"tarjetas" | "tabla">("tarjetas")

  const aniosReforma = useMemo(() => {
    const set = new Set(leyes.map((l) => l.fechaUltimaReforma.slice(0, 4)))
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [])

  const resultados = useMemo(() => {
    let r = leyes.filter((l) => {
      const q = query.trim().toLowerCase()
      const coincide =
        !q ||
        l.nombre.toLowerCase().includes(q) ||
        l.nombreCorto.toLowerCase().includes(q) ||
        l.materia.toLowerCase().includes(q) ||
        l.resumen.toLowerCase().includes(q)
      const mat = materia === "Todas" || l.materia === materia
      const est = estatus === "Todos" || l.estatus === estatus
      const anio = anioReforma === "Todos" || l.fechaUltimaReforma.startsWith(anioReforma)
      return coincide && mat && est && anio
    })

    r = [...r].sort((a, b) => {
      switch (orden) {
        case "alfabetico":
          return a.nombre.localeCompare(b.nombre)
        case "consultadas":
          return b.consultas - a.consultas
        case "recientes":
          return b.fechaPublicacionOriginal.localeCompare(a.fechaPublicacionOriginal)
        case "reforma":
          return b.fechaUltimaReforma.localeCompare(a.fechaUltimaReforma)
        default:
          return 0
      }
    })
    return r
  }, [query, materia, estatus, anioReforma, orden])

  return (
    <div className="flex flex-col gap-6">
      {/* Buscador */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre de ley, palabra clave o materia..."
          className="h-12 pl-12 text-base"
          aria-label="Buscar leyes"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Materia</label>
            <Select value={materia} onValueChange={(v) => setMateria((v as MateriaLey) ?? "Todas")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas las materias</SelectItem>
                {MATERIAS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Estatus</label>
            <Select value={estatus} onValueChange={(v) => setEstatus((v as EstatusLey) ?? "Todos")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los estatus</SelectItem>
                {ESTATUS_LEY.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Año de última reforma</label>
            <Select value={anioReforma} onValueChange={(v) => setAnioReforma(v ?? "Todos")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Cualquier año</SelectItem>
                {aniosReforma.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Ordenar por</label>
            <Select value={orden} onValueChange={(v) => setOrden((v as Orden) ?? "alfabetico")}>
              <SelectTrigger>
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ordenLabels) as Orden[]).map((o) => (
                  <SelectItem key={o} value={o}>
                    {ordenLabels[o]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Barra de resultados + cambio de vista */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{resultados.length}</span>{" "}
          {resultados.length === 1 ? "ordenamiento" : "ordenamientos"} encontrados
        </p>
        <div className="flex items-center gap-1 rounded-md border border-border p-1">
          <button
            onClick={() => setVista("tarjetas")}
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors",
              vista === "tarjetas"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={vista === "tarjetas"}
          >
            <LayoutGrid className="h-4 w-4" />
            Tarjetas
          </button>
          <button
            onClick={() => setVista("tabla")}
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors",
              vista === "tabla"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={vista === "tabla"}
          >
            <TableIcon className="h-4 w-4" />
            Tabla
          </button>
        </div>
      </div>

      {/* Resultados */}
      {resultados.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <Scale className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No se encontraron ordenamientos con los criterios seleccionados.
          </p>
        </div>
      ) : vista === "tarjetas" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {resultados.map((l) => (
            <article
              key={l.id}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Scale className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-pretty font-serif text-base font-semibold leading-snug">
                      <Link href={`/leyes/${l.id}`} className="hover:underline">
                        {l.nombre}
                      </Link>
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={materiaColor(l.materia)}>
                        {l.materia}
                      </Badge>
                      <Badge variant="outline" className={estatusLeyColor(l.estatus)}>
                        {l.estatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
                <div>
                  <p className="text-muted-foreground">Publicación original</p>
                  <p className="font-medium">{formatFecha(l.fechaPublicacionOriginal)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Última reforma</p>
                  <p className="font-medium">{formatFecha(l.fechaUltimaReforma)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Periódico original</p>
                  <p className="font-medium">{l.numeroPeriodicoOriginal}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reformas</p>
                  <p className="font-medium">{l.numeroReformas} registradas</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button render={<Link href={`/leyes/${l.id}`} />} size="sm">
                  <FileText className="h-4 w-4" />
                  Ver ley
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  PDF vigente
                </Button>
                <Button render={<Link href={`/leyes/${l.id}?tab=reformas`} />} variant="outline" size="sm">
                  <History className="h-4 w-4" />
                  Ver reformas
                </Button>
                <Button render={<Link href="/verificar" />} variant="ghost" size="sm">
                  <ShieldCheck className="h-4 w-4" />
                  Validar
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordenamiento</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Estatus</TableHead>
                <TableHead className="hidden md:table-cell">Última reforma</TableHead>
                <TableHead className="hidden lg:table-cell">Reformas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultados.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <Link href={`/leyes/${l.id}`} className="font-medium hover:underline">
                      {l.nombre}
                    </Link>
                    <p className="text-xs text-muted-foreground">{l.numeroPeriodicoOriginal}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={materiaColor(l.materia)}>
                      {l.materia}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={estatusLeyColor(l.estatus)}>
                      {l.estatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {formatFecha(l.fechaUltimaReforma)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{l.numeroReformas}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        render={<Link href={`/leyes/${l.id}`} aria-label="Ver ley" />}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Descargar PDF">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        render={<Link href={`/leyes/${l.id}?tab=reformas`} aria-label="Ver reformas" />}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
