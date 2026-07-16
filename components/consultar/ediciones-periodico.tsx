"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Newspaper,
  ListOrdered,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react"
import {
  ediciones,
  aniosDisponibles,
  tipoEdicionColor,
  type TipoEdicion,
} from "@/lib/ediciones"
import { BotonDescargarEdicion } from "@/components/boton-descargar-edicion"
import { formatFecha } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TODOS = "__todos__"
const tiposEdicion: TipoEdicion[] = ["Ordinaria", "Extraordinaria", "Alcance"]

export function EdicionesPeriodico() {
  const [anio, setAnio] = useState(2026)
  const [tipo, setTipo] = useState(TODOS)
  const [q, setQ] = useState("")

  const lista = useMemo(() => {
    return ediciones
      .filter((e) => {
        const mAnio = e.fecha.startsWith(String(anio))
        const mTipo = tipo === TODOS || e.tipo === tipo
        const mQ = !q || String(e.numero).includes(q.trim())
        return mAnio && mTipo && mQ
      })
      .sort((a, b) => b.numero - a.numero)
      .slice(0, 40)
  }, [anio, tipo, q])

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">
            Números publicados del Periódico Oficial
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Año</Label>
            <Select value={String(anio)} onValueChange={(v) => setAnio(Number(v))}>
              <SelectTrigger className="w-full">
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
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Tipo de edición
            </Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v ?? TODOS)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todas</SelectItem>
                {tiposEdicion.map((t) => (
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
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ej. 42"
                inputMode="numeric"
                className="pl-8"
              />
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {lista.length} edición(es) en {anio}
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lista.map((e) => (
          <Card key={e.id} className="flex flex-col">
            <CardContent className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-serif text-xl font-semibold">
                    No. {e.numero}
                  </p>
                  <p className="text-xs text-muted-foreground">{e.tomo}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(tipoEdicionColor(e.tipo))}
                >
                  {e.tipo}
                </Badge>
              </div>

              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Fecha</dt>
                  <dd className="text-right font-medium">
                    {formatFecha(e.fecha)}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Documentos</dt>
                  <dd className="font-medium">{e.documentos.length}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Páginas</dt>
                  <dd className="font-medium">{e.paginas}</dd>
                </div>
              </dl>

              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Firmada con qFirma
              </p>

              <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
                <Button
                  render={<Link href={`/calendario/edicion/${e.id}`} />}
                  variant="outline"
                  size="sm"
                >
                  <ListOrdered className="h-4 w-4" />
                  Índice
                </Button>
                <BotonDescargarEdicion edicion={e} label="Descargar" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lista.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
            <p className="font-medium">Sin ediciones</p>
            <p className="text-sm text-muted-foreground">
              No hay ediciones que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
