"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Search,
  CalendarDays,
  LayoutGrid,
  CalendarRange,
  ChevronRight,
  Hash,
  FileText,
} from "lucide-react"
import {
  ediciones,
  edicionesPorFecha,
  aniosDisponibles,
  type Edicion,
  type TipoEdicion,
  MESES,
  tipoEdicionColor,
} from "@/lib/ediciones"
import { formatFecha } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarioMes } from "@/components/calendario/calendario-mes"
import { CalendarioAnio } from "@/components/calendario/calendario-anio"
import { EdicionDetalle } from "@/components/calendario/edicion-detalle"

const TODOS = "__todos__"
const tiposEdicion: TipoEdicion[] = ["Ordinaria", "Extraordinaria", "Alcance"]

export function CalendarioCliente({
  mostrarBusqueda = true,
}: {
  mostrarBusqueda?: boolean
}) {
  const [vista, setVista] = useState<"mes" | "anio">("mes")
  const [anio, setAnio] = useState(2026)
  const [mes, setMes] = useState(5) // junio
  const [seleccion, setSeleccion] = useState<string | null>("2026-06-12")
  const [edsDia, setEdsDia] = useState<Edicion[]>(() =>
    edicionesPorFecha("2026-06-12"),
  )
  const [edActiva, setEdActiva] = useState<Edicion | null>(
    () => edicionesPorFecha("2026-06-12")[0] ?? null,
  )
  const [mostrarMasAnios, setMostrarMasAnios] = useState(false)

  // Búsqueda
  const [busqNumero, setBusqNumero] = useState("")
  const [busqFecha, setBusqFecha] = useState("")
  const [busqClave, setBusqClave] = useState("")
  const [filtroTipo, setFiltroTipo] = useState(TODOS)

  const hayBusqueda =
    !!busqNumero || !!busqFecha || !!busqClave || filtroTipo !== TODOS

  const resultados = useMemo(() => {
    if (!hayBusqueda) return []
    return ediciones
      .filter((e) => {
        const mNum = !busqNumero || String(e.numero).includes(busqNumero.trim())
        const mFecha = !busqFecha || e.fecha === busqFecha
        const mTipo = filtroTipo === TODOS || e.tipo === filtroTipo
        const mClave =
          !busqClave ||
          e.documentos.some(
            (d) =>
              d.titulo.toLowerCase().includes(busqClave.toLowerCase()) ||
              d.dependencia.toLowerCase().includes(busqClave.toLowerCase()),
          )
        return mNum && mFecha && mTipo && mClave
      })
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
      .slice(0, 30)
  }, [busqNumero, busqFecha, busqClave, filtroTipo, hayBusqueda])

  const seleccionarDia = (iso: string, eds: Edicion[]) => {
    setSeleccion(iso)
    setEdsDia(eds)
    setEdActiva(eds[0] ?? null)
  }

  const seleccionarDesdeAnio = (iso: string, eds: Edicion[], m: number) => {
    setMes(m)
    setVista("mes")
    seleccionarDia(iso, eds)
  }

  const aniosVisibles = mostrarMasAnios
    ? [...aniosDisponibles, 2020, 2019, 2018]
    : aniosDisponibles

  const limpiarBusqueda = () => {
    setBusqNumero("")
    setBusqFecha("")
    setBusqClave("")
    setFiltroTipo(TODOS)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de búsqueda rápida (oculta cuando el calendario vive dentro de pestañas) */}
      {mostrarBusqueda && (
        <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Búsqueda rápida</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Número de periódico
            </Label>
            <Input
              value={busqNumero}
              onChange={(e) => setBusqNumero(e.target.value)}
              placeholder="Ej. 51"
              inputMode="numeric"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Fecha</Label>
            <Input
              type="date"
              value={busqFecha}
              onChange={(e) => setBusqFecha(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Palabra clave
            </Label>
            <Input
              value={busqClave}
              onChange={(e) => setBusqClave(e.target.value)}
              placeholder="Título o dependencia"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Tipo de edición
            </Label>
            <Select
              value={filtroTipo}
              onValueChange={(v) => setFiltroTipo(v ?? TODOS)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos</SelectItem>
                {tiposEdicion.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hayBusqueda && (
          <div className="mt-4 border-t border-border pt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {resultados.length} edición(es) encontrada(s)
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs"
                onClick={limpiarBusqueda}
              >
                Limpiar búsqueda
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {resultados.map((e) => (
                <Link
                  key={e.id}
                  href={`/calendario/edicion/${e.id}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-border p-3 transition-colors hover:bg-secondary/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                      <FileText className="h-4 w-4 text-foreground" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">
                        Periódico Oficial No. {e.numero}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFecha(e.fecha)} · {e.documentos.length} documentos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("hidden sm:inline-flex", tipoEdicionColor(e.tipo))}
                    >
                      {e.tipo}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
              {resultados.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No se encontraron ediciones con esos criterios.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      )}

      {/* Cuerpo principal */}
      <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
        {/* Columna de años */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar año"
                className="h-8 pl-8 text-sm"
                inputMode="numeric"
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (v >= 2018 && v <= 2026) setAnio(v)
                }}
              />
            </div>
            <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">
              Años disponibles
            </p>
            <div className="flex flex-col gap-1">
              {aniosVisibles.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAnio(a)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    anio === a
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "text-foreground hover:bg-secondary",
                  )}
                >
                  {a}
                  {anio === a && <CalendarDays className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
            {!mostrarMasAnios && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 w-full text-xs text-muted-foreground"
                onClick={() => setMostrarMasAnios(true)}
              >
                Ver años anteriores
              </Button>
            )}
          </div>
        </aside>

        {/* Calendario + detalle */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex rounded-md border border-border p-0.5">
              <Button
                variant={vista === "mes" ? "default" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => setVista("mes")}
              >
                <LayoutGrid className="h-4 w-4" />
                Mes
              </Button>
              <Button
                variant={vista === "anio" ? "default" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => setVista("anio")}
              >
                <CalendarRange className="h-4 w-4" />
                Año completo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {vista === "mes" ? `${MESES[mes]} ${anio}` : `Año ${anio}`}
            </p>
          </div>

          {vista === "mes" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
              <CalendarioMes
                anio={anio}
                mes={mes}
                seleccion={seleccion}
                aniosDisponibles={aniosVisibles}
                onCambioMes={setMes}
                onCambioAnio={setAnio}
                onSeleccionDia={seleccionarDia}
              />
              <div className="flex flex-col gap-3">
                {edsDia.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {edsDia.map((e) => (
                      <Button
                        key={e.id}
                        variant={edActiva?.id === e.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEdActiva(e)}
                      >
                        <Hash className="h-3 w-3" />
                        No. {e.numero}
                      </Button>
                    ))}
                  </div>
                )}
                <EdicionDetalle
                  edicion={edActiva}
                  onCerrar={() => {
                    setSeleccion(null)
                    setEdActiva(null)
                    setEdsDia([])
                  }}
                />
              </div>
            </div>
          ) : (
            <CalendarioAnio
              anio={anio}
              onSeleccionDia={seleccionarDesdeAnio}
            />
          )}
        </div>
      </div>
    </div>
  )
}
