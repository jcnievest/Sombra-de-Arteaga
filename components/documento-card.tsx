import Link from "next/link"
import { FileText, ShieldCheck, Building2, Calendar } from "lucide-react"
import type { DocumentoOficial } from "@/lib/data"
import { formatFecha } from "@/lib/data"
import { ediciones } from "@/lib/ediciones"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BotonCopiaSimple } from "@/components/boton-copia-simple"

export function DocumentoCard({ doc }: { doc: DocumentoOficial }) {
  const edicion = ediciones.find(
    (item) => item.fecha === doc.fechaPublicacion && item.tipo === "Ordinaria",
  )

  return (
    <Card className="flex flex-col gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="outline" className="border-accent-foreground/20 bg-accent text-accent-foreground">
            {doc.tipo}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {doc.folio}
          </span>
        </div>

        <h3 className="text-pretty font-serif text-base font-semibold leading-snug text-foreground">
          <Link href={`/documento/${doc.id}`} className="hover:underline">
            {doc.titulo}
          </Link>
        </h3>

        <dl className="mt-auto flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{doc.dependencia}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{formatFecha(doc.fechaPublicacion)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Periódico {doc.numeroPeriodico}</span>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 border-t border-border bg-secondary/40 p-3">
        <Button
          render={<Link href={`/documento/${doc.id}`} />}
          size="sm"
          variant="default"
          className="flex-1"
        >
          <FileText className="h-4 w-4" />
          Ver ficha
        </Button>
        {edicion && (
          <BotonCopiaSimple
            edicion={edicion}
            label="Copia simple"
            className="flex-1"
          />
        )}
        <Button
          render={<Link href={`/verificar?folio=${doc.folio}`} />}
          size="sm"
          variant="outline"
          className="flex-1"
        >
          <ShieldCheck className="h-4 w-4" />
          Validar
        </Button>
      </CardFooter>
    </Card>
  )
}
