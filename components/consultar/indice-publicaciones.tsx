"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ListOrdered,
  Eye,
  Download,
  ShieldCheck,
  Search,
} from "lucide-react"
import {
  ediciones,
  aniosDisponibles,
  tipoEdicionColor,
  type Edicion,
} from "@/lib/ediciones"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function IndicePublicaciones() {
  const [anio, setAnio] = useState(2026)

  const delAnio = useMemo(
    () =>
      ediciones
        .filter((e) => e.fecha.startsWith(String(anio)))
        .sort((a, b) => b.numero - a.numero),
    [anio],
  )

  const [edicionId, setEdicionId] = useState<string>(
    () => delAnio[0]?.id ?? "",
  )

  const edicion: Edicion | undefined = useMemo(
    () => ediciones.find((e) => e.id === edicionId) ?? delAnio[0],
    [edicionId, delAnio],
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">
            Selecciona una edición para ver su índice de publicaciones
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Año</Label>
            <Select
              value={String(anio)}
              onValueChange={(v) => {
                const a = Number(v)
                setAnio(a)
                const primera = ediciones
                  .filter((e) => e.fecha.startsWith(String(a)))
                  .sort((x, y) => y.numero - x.numero)[0]
                setEdicionId(primera?.id ?? "")
              }}
            >
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
              Edición / número de periódico
            </Label>
            <Select value={edicionId} onValueChange={(v) => setEdicionId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una edición">
                  {(value: string) => {
                    const ed = delAnio.find((e) => e.id === value)
                    return ed
                      ? `No. ${ed.numero} · ${formatFecha(ed.fecha)}`
                      : "Selecciona una edición"
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {delAnio.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    No. {e.numero} · {formatFecha(e.fecha)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {edicion ? (
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-secondary/30 p-5">
            <div>
              <p className="text-xs text-muted-foreground">
                {formatFecha(edicion.fecha)} · {edicion.tomo}
              </p>
              <h3 className="font-serif text-xl font-semibold">
                Índice de la edición No. {edicion.numero}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(tipoEdicionColor(edicion.tipo))}
                >
                  Edición {edicion.tipo}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {edicion.documentos.length} documentos · {edicion.paginas}{" "}
                  páginas
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                render={<Link href={`/calendario/edicion/${edicion.id}`} />}
                variant="outline"
                size="sm"
              >
                <Eye className="h-4 w-4" />
                Ver edición
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4" />
                Descargar
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Pág.</TableHead>
                    <TableHead>Documento incluido</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Dependencia o solicitante
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Tipo de acto
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {edicion.documentos.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {d.pagina}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-pretty text-sm font-medium leading-snug">
                          {d.titulo}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground md:hidden">
                          {d.dependencia}
                        </p>
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {d.dependencia}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="border-border">
                          {d.tipoActo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {d.docId ? (
                            <Button
                              render={
                                <Link
                                  href={`/documento/${d.docId}`}
                                  aria-label="Ver documento"
                                />
                              }
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label="Ver documento"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Descargar"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            render={
                              <Link href="/verificar" aria-label="Validar" />
                            }
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Search className="h-6 w-6 text-muted-foreground" />
            <p className="font-medium">Selecciona una edición</p>
            <p className="text-sm text-muted-foreground">
              Elige un año y un número de periódico para ver su índice.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
