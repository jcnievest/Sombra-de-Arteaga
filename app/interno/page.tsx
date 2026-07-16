import Link from "next/link"
import {
  Inbox,
  Eye,
  AlertTriangle,
  CheckCircle2,
  CalendarClock,
  BadgeCheck,
  ArrowRight,
  FilePlus2,
  ArrowUpRight,
  Users,
  Building2,
} from "lucide-react"
import { metricas, solicitudes, flujoEstatus, formatFecha } from "@/lib/data"
import { EstatusBadge } from "@/components/estatus-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const iconMap = [Inbox, Eye, AlertTriangle, CheckCircle2, CalendarClock, BadgeCheck]

const tonoStyles: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-secondary text-secondary-foreground",
  warning: "bg-foreground/10 text-foreground",
  success: "bg-primary text-primary-foreground",
}

export default function DashboardPage() {
  const recientes = solicitudes.slice(0, 5)

  // Conteo por estatus para el resumen de flujo
  const conteo = flujoEstatus.map((estatus) => ({
    estatus,
    total: solicitudes.filter((s) => s.estatus === estatus).length,
  }))

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">
            Tablero institucional
          </h1>
          <p className="text-sm text-muted-foreground">
            Resumen de solicitudes de publicación del Periódico Oficial.
          </p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/interno/solicitudes" />} variant="outline">
            <Inbox className="h-4 w-4" />
            Bandeja de solicitudes
          </Button>
          <Button render={<Link href="/interno/nueva" />}>
            <FilePlus2 className="h-4 w-4" />
            Carga institucional directa
          </Button>
        </div>
      </div>

      {/* Diferencia funcional ciudadano / institucional */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-border">
          <CardContent className="flex flex-col gap-1.5 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              Portal ciudadano
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              El usuario inicia, paga, da seguimiento, atiende observaciones y
              descarga su constancia.
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-secondary/30">
          <CardContent className="flex flex-col gap-1.5 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4 text-primary" />
              Portal institucional
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              La autoridad revisa, valida pago, observa, aprueba, programa,
              firma, publica y genera la constancia oficial.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {metricas.map((m, i) => {
          const Icon = iconMap[i]
          return (
            <Card key={m.etiqueta}>
              <CardContent className="flex flex-col gap-2 p-4">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${tonoStyles[m.tono]}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className="font-serif text-2xl font-semibold tabular-nums">
                  {m.valor}
                </p>
                <p className="text-xs leading-tight text-muted-foreground">
                  {m.etiqueta}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Solicitudes recientes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">
              Solicitudes recientes
            </CardTitle>
            <Button
              render={<Link href="/interno/solicitudes" />}
              variant="ghost"
              size="sm"
            >
              Ver bandeja
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Folio</TableHead>
                  <TableHead>Dependencia</TableHead>
                  <TableHead>Estatus</TableHead>
                  <TableHead className="text-right">Recepción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recientes.map((s) => (
                  <TableRow key={s.folio}>
                    <TableCell className="font-mono text-xs">
                      <Link
                        href={`/interno/solicitud/${s.folio}`}
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        {s.folio}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate text-sm">
                      {s.dependencia}
                    </TableCell>
                    <TableCell>
                      <EstatusBadge estatus={s.estatus} />
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {formatFecha(s.fechaRecepcion)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Flujo de revisión */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">
              Flujo de revisión
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {conteo.map((c, i) => (
              <div key={c.estatus} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <EstatusBadge estatus={c.estatus} />
                </div>
                <span className="font-serif text-lg font-semibold tabular-nums">
                  {c.total}
                </span>
              </div>
            ))}
            <Button
              render={<Link href="/interno/edicion" />}
              variant="outline"
              className="mt-2"
            >
              <BadgeCheck className="h-4 w-4" />
              Ir a cierre de edición
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
