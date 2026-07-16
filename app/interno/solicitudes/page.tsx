"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Eye,
  FileText,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CalendarClock,
  BadgeCheck,
  History,
  X,
} from "lucide-react"
import { toast } from "sonner"
import {
  solicitudesCiudadanas,
  estatusSolicitudFlujo,
  tiposSolicitante,
  type SolicitudCiudadana,
  type TipoSolicitante,
  type EstatusSolicitud,
} from "@/lib/ciudadano"
import { formatFecha } from "@/lib/data"
import {
  EstatusSolicitudBadge,
  PagoBadge,
  DocumentoBadge,
} from "@/components/ciudadano-badges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Filtros de tipo de solicitante solicitados explícitamente
const filtrosSolicitante: (TipoSolicitante | "Todos")[] = [
  "Todos",
  "Particular",
  "Dependencia estatal",
  "Municipio",
  "Notaría / corredor público",
  "Organismo autónomo",
]

export default function SolicitudesPage() {
  const [q, setQ] = useState("")
  const [tipo, setTipo] = useState<TipoSolicitante | "Todos">("Todos")
  const [estatus, setEstatus] = useState<EstatusSolicitud | "Todas">("Todas")
  const [seleccion, setSeleccion] = useState<SolicitudCiudadana | null>(null)

  const filtradas = useMemo(() => {
    return solicitudesCiudadanas.filter((s) => {
      const matchQ =
        !q ||
        s.folio.toLowerCase().includes(q.toLowerCase()) ||
        s.solicitante.toLowerCase().includes(q.toLowerCase()) ||
        s.documento.toLowerCase().includes(q.toLowerCase())
      const matchTipo = tipo === "Todos" || s.tipoSolicitante === tipo
      const matchEstatus = estatus === "Todas" || s.estatus === estatus
      return matchQ && matchTipo && matchEstatus
    })
  }, [q, tipo, estatus])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">
          Bandeja de solicitudes de publicación
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestiona solicitudes de particulares, dependencias, municipios,
          notarías y organismos autónomos.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          {/* Controles */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar folio, solicitante o documento…"
                className="pl-9"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Tipo de solicitante
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filtrosSolicitante.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    active={tipo === t}
                    onClick={() => setTipo(t)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Estatus
              </span>
              <div className="flex flex-wrap gap-1.5">
                <Chip
                  label="Todas"
                  active={estatus === "Todas"}
                  onClick={() => setEstatus("Todas")}
                />
                {estatusSolicitudFlujo.map((e) => (
                  <Chip
                    key={e}
                    label={e}
                    active={estatus === e}
                    onClick={() => setEstatus(e)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Folio</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Estatus</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtradas.map((s) => (
                  <TableRow key={s.folio}>
                    <TableCell className="font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setSeleccion(s)}
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        {s.folio}
                      </button>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-sm">
                      {s.solicitante}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {s.tipoSolicitante}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">
                      {s.documento}
                    </TableCell>
                    <TableCell>
                      <EstatusSolicitudBadge estatus={s.estatus} />
                    </TableCell>
                    <TableCell>
                      <PagoBadge estatus={s.pago} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSeleccion(s)}
                      >
                        <Eye className="h-4 w-4" />
                        Revisar
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

      <DetalleSheet
        s={seleccion}
        onClose={() => setSeleccion(null)}
      />
    </div>
  )
}

function DetalleSheet({
  s,
  onClose,
}: {
  s: SolicitudCiudadana | null
  onClose: () => void
}) {
  function gestionar(accion: string) {
    toast.success(`Solicitud ${accion}`, {
      description: s ? `Folio ${s.folio}` : undefined,
    })
  }

  return (
    <Sheet open={!!s} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg">
        {s && (
          <>
            <SheetHeader>
              <SheetTitle className="font-serif">{s.folio}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-5 px-4 pb-6">
              <div>
                <h3 className="text-pretty font-serif text-lg font-semibold leading-snug">
                  {s.documento}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {s.tipoPublicacion} · {s.tipoSolicitante}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <EstatusSolicitudBadge estatus={s.estatus} />
                  <PagoBadge estatus={s.pago} />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Solicitante" value={s.solicitante} />
                <Info label="Correo" value={s.correo} />
                <Info label="Teléfono" value={s.telefono} />
                {s.rfc && <Info label="RFC" value={s.rfc} />}
                <Info
                  label="Fecha de solicitud"
                  value={formatFecha(s.fechaSolicitud)}
                />
                <Info
                  label="Importe"
                  value={s.importe.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                />
              </div>

              <Separator />

              {/* Documentos cargados */}
              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-primary" />
                  Documentos cargados
                </p>
                {s.documentos.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-border p-2.5"
                  >
                    <span className="truncate text-sm">{d.nombre}</span>
                    <DocumentoBadge estatus={d.estatus} />
                  </div>
                ))}
              </div>

              {/* Historial de observaciones */}
              {s.observaciones && s.observaciones.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4 text-foreground" />
                    Historial de observaciones
                  </p>
                  <ul className="flex flex-col gap-2">
                    {s.observaciones.map((o, i) => (
                      <li
                        key={i}
                        className="rounded-md border border-foreground/30 bg-muted/40 p-2.5 text-sm leading-relaxed"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Historial de versiones */}
              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <History className="h-4 w-4 text-primary" />
                  Versiones
                </p>
                <ol className="flex flex-col gap-2">
                  {s.versiones.map((v) => (
                    <li
                      key={v.version}
                      className="flex items-center justify-between gap-2 rounded-md border border-border p-2.5 text-sm"
                    >
                      <span className="font-medium">{v.version}</span>
                      <span className="flex-1 px-2 text-muted-foreground">
                        {v.estado}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatFecha(v.fecha)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <Separator />

              {/* Acciones de gestión */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Acciones</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => gestionar("observada")}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Observar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => gestionar("validada")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Validar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => gestionar("rechazada")}
                  >
                    <XCircle className="h-4 w-4" />
                    Rechazar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => gestionar("programada")}
                  >
                    <CalendarClock className="h-4 w-4" />
                    Programar
                  </Button>
                  <Button
                    size="sm"
                    className="col-span-2"
                    onClick={() => gestionar("publicada")}
                  >
                    <BadgeCheck className="h-4 w-4" />
                    Publicar
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="break-words font-medium">{value}</span>
    </div>
  )
}

function Chip({
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
