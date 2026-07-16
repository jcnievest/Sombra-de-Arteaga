"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { FilePlus2, Eye, Search, ArrowRight } from "lucide-react"
import {
  solicitudesCiudadanas,
  estatusSolicitudFlujo,
  type EstatusSolicitud,
} from "@/lib/ciudadano"
import { formatFecha } from "@/lib/data"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import {
  EstatusSolicitudBadge,
  PagoBadge,
} from "@/components/ciudadano-badges"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SeguimientoPage() {
  const [q, setQ] = useState("")
  const [filtro, setFiltro] = useState<EstatusSolicitud | "Todas">("Todas")

  const filtradas = useMemo(() => {
    return solicitudesCiudadanas.filter((s) => {
      const matchQ =
        !q ||
        s.folio.toLowerCase().includes(q.toLowerCase()) ||
        s.documento.toLowerCase().includes(q.toLowerCase()) ||
        s.tipoPublicacion.toLowerCase().includes(q.toLowerCase())
      const matchEstatus = filtro === "Todas" || s.estatus === filtro
      return matchQ && matchEstatus
    })
  }, [q, filtro])

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PublicHeader />
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
                Mis solicitudes de publicación
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Da seguimiento al estado, pago y avance de tus solicitudes.
              </p>
            </div>
            <Button render={<Link href="/solicitar" />}>
              <FilePlus2 className="h-4 w-4" />
              Nueva solicitud
            </Button>
          </div>

          <Card>
            <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar folio, tipo o documento…"
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <FiltroChip
                    label="Todas"
                    active={filtro === "Todas"}
                    onClick={() => setFiltro("Todas")}
                  />
                  {estatusSolicitudFlujo.map((e) => (
                    <FiltroChip
                      key={e}
                      label={e}
                      active={filtro === e}
                      onClick={() => setFiltro(e)}
                    />
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Tipo de publicación</TableHead>
                      <TableHead>Fecha de solicitud</TableHead>
                      <TableHead>Estatus</TableHead>
                      <TableHead>Pago</TableHead>
                      <TableHead>Última actualización</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtradas.map((s) => (
                      <TableRow key={s.folio}>
                        <TableCell className="font-mono text-xs">
                          <Link
                            href={`/solicitar/seguimiento/${s.folio}`}
                            className="text-primary underline-offset-2 hover:underline"
                          >
                            {s.folio}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">
                          {s.tipoPublicacion}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatFecha(s.fechaSolicitud)}
                        </TableCell>
                        <TableCell>
                          <EstatusSolicitudBadge estatus={s.estatus} />
                        </TableCell>
                        <TableCell>
                          <PagoBadge estatus={s.pago} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatFecha(s.ultimaActualizacion)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            render={
                              <Link href={`/solicitar/seguimiento/${s.folio}`} />
                            }
                          >
                            <Eye className="h-4 w-4" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filtradas.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No hay solicitudes que coincidan con los filtros.
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                Mostrando {filtradas.length} de {solicitudesCiudadanas.length}{" "}
                solicitudes
              </p>
            </CardContent>
          </Card>

          <Card className="border-foreground/15 bg-secondary/30">
            <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                ¿Necesitas publicar un nuevo acto o documento en el Periódico
                Oficial?
              </p>
              <Button variant="outline" render={<Link href="/solicitar" />}>
                Iniciar solicitud
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}

function FiltroChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <Badge
      render={
        <button type="button" onClick={onClick}>
          {label}
        </button>
      }
      variant={active ? "default" : "outline"}
      className="cursor-pointer"
    />
  )
}
