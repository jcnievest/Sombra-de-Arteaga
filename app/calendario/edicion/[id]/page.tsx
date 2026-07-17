import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  Fingerprint,
  BadgeCheck,
  FileText,
} from "lucide-react"
import { getEdicion, tipoEdicionColor } from "@/lib/ediciones"
import { formatFecha } from "@/lib/data"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { QrSimulado } from "@/components/qr-simulado"
import { BotonDescargarEdicion } from "@/components/boton-descargar-edicion"
import { BotonCopiaSimple } from "@/components/boton-copia-simple"
import { BotonVistaPreviaSimple } from "@/components/boton-vista-previa-simple"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function EdicionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const edicion = getEdicion(id)
  if (!edicion) notFound()

  const hashCorto = `${edicion.hash.slice(0, 24)}…${edicion.hash.slice(-12)}`

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Button render={<Link href="/consultar" />} variant="ghost" size="sm" className="mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a consultar publicaciones
        </Button>

        {/* Encabezado de la edición */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {formatFecha(edicion.fecha)}
              </p>
              <h1 className="font-serif text-3xl font-semibold text-balance">
                Periódico Oficial No. {edicion.numero}
              </h1>
              <p className="text-sm text-muted-foreground">{edicion.tomo}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={tipoEdicionColor(edicion.tipo)}
                >
                  Edición {edicion.tipo}
                </Badge>
                <Badge
                  variant="outline"
                  className="gap-1 border-primary/30 bg-secondary/50 text-foreground"
                >
                  <BadgeCheck className="h-3 w-3" />
                  Edición auténtica y verificable
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {edicion.documentos.length} documentos · {edicion.paginas}{" "}
                  páginas
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <BotonDescargarEdicion edicion={edicion} label="Descargar PDF" />
              <Button render={<Link href="/verificar" />} variant="outline" size="sm">
                <ShieldCheck className="h-4 w-4" />
                Validar autenticidad
              </Button>
            </div>
          </div>
        </div>

        {/* Firma qFirma */}
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">
                Edición firmada con qFirma
              </h2>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Fingerprint className="h-3 w-3" />
                  Hash SHA-256
                </dt>
                <dd className="break-all font-mono text-xs">{hashCorto}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Sello de tiempo válido
                </dt>
                <dd className="font-mono text-xs">{edicion.selloTiempo}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BadgeCheck className="h-3 w-3" />
                  Firma
                </dt>
                <dd className="font-medium">
                  qFirma / Firma Electrónica Avanzada
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-5">
            <QrSimulado value={`${edicion.numero}-${edicion.hash}`} size={120} />
            <p className="text-center text-xs text-muted-foreground">
              QR de verificación pública
            </p>
          </div>
        </div>

        {/* Índice de documentos */}
        <div className="mt-6">
          <h2 className="mb-3 font-serif text-xl font-semibold">
            Índice de la edición
          </h2>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Pág.</TableHead>
                  <TableHead>Título del documento</TableHead>
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
                        <BotonVistaPreviaSimple edicion={edicion} />
                        <BotonCopiaSimple
                          edicion={edicion}
                          iconOnly
                          variant="ghost"
                          className="h-8 w-8"
                        />
                        <Button
                          render={<Link href="/verificar" aria-label="Validar" />}
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
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
