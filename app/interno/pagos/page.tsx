"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  CreditCard,
  Hash,
} from "lucide-react"
import { toast } from "sonner"
import {
  solicitudesCiudadanas,
  pagoColor,
  type EstatusPago,
} from "@/lib/ciudadano"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const estatusPago: (EstatusPago | "Todos")[] = [
  "Todos",
  "Pendiente",
  "En validación",
  "Acreditado",
  "Rechazado",
]

function moneda(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" })
}

export default function PagosPage() {
  const [q, setQ] = useState("")
  const [filtro, setFiltro] = useState<EstatusPago | "Todos">("Todos")

  const registros = useMemo(() => {
    return solicitudesCiudadanas.filter((s) => {
      const matchQ =
        !q ||
        s.folio.toLowerCase().includes(q.toLowerCase()) ||
        s.solicitante.toLowerCase().includes(q.toLowerCase()) ||
        s.referenciaPago.toLowerCase().includes(q.toLowerCase())
      const matchFiltro = filtro === "Todos" || s.pago === filtro
      return matchQ && matchFiltro
    })
  }, [q, filtro])

  const resumen = useMemo(() => {
    const cuenta = (e: EstatusPago) =>
      solicitudesCiudadanas.filter((s) => s.pago === e).length
    return [
      { label: "Pendiente", total: cuenta("Pendiente") },
      { label: "En validación", total: cuenta("En validación") },
      { label: "Acreditado", total: cuenta("Acreditado") },
      { label: "Rechazado", total: cuenta("Rechazado") },
    ]
  }, [])

  function accion(texto: string, folio: string) {
    toast.success(texto, { description: `Folio ${folio}` })
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">
          Validación de pagos
        </h1>
        <p className="text-sm text-muted-foreground">
          Revisa y acredita los pagos de derechos de publicación recibidos por
          la tesorería antes de continuar con la revisión documental.
        </p>
      </div>

      {/* Resumen por estatus */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {resumen.map((r) => (
          <Card key={r.label}>
            <CardContent className="flex flex-col gap-1 p-4">
              <Badge
                variant="outline"
                className={cn("w-fit", pagoColor(r.label as EstatusPago))}
              >
                {r.label}
              </Badge>
              <p className="font-serif text-2xl font-semibold tabular-nums">
                {r.total}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar folio, solicitante o referencia…"
                className="pl-9"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Estatus de pago
              </span>
              <div className="flex flex-wrap gap-1.5">
                {estatusPago.map((e) => (
                  <Badge
                    key={e}
                    render={
                      <button type="button" onClick={() => setFiltro(e)}>
                        {e}
                      </button>
                    }
                    variant={filtro === e ? "default" : "outline"}
                    className="cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Folio</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead className="hidden md:table-cell">Concepto</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="hidden sm:table-cell">Referencia</TableHead>
                  <TableHead>Estatus</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((s) => (
                  <TableRow key={s.folio}>
                    <TableCell className="font-mono text-xs">{s.folio}</TableCell>
                    <TableCell className="max-w-[180px] truncate text-sm">
                      {s.solicitante}
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      Derechos de publicación · {s.tipoPublicacion}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {moneda(s.importe)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <Hash className="h-3 w-3" />
                        {s.referenciaPago}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(pagoColor(s.pago))}
                      >
                        {s.pago}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Validar pago"
                          title="Validar pago"
                          onClick={() => accion("Pago acreditado", s.folio)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Rechazar pago"
                          title="Rechazar pago"
                          onClick={() => accion("Pago rechazado", s.folio)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Solicitar aclaración"
                          title="Solicitar aclaración"
                          onClick={() =>
                            accion("Aclaración solicitada", s.folio)
                          }
                        >
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {registros.length === 0 && (
            <p className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
              <CreditCard className="h-6 w-6" />
              No hay pagos que coincidan con los filtros.
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Mostrando {registros.length} de {solicitudesCiudadanas.length}{" "}
            registros de pago
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
