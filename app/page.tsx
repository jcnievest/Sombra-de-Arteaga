import Link from "next/link"
import {
  ShieldCheck,
  FileSearch,
  FileText,
  Download,
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  FilePlus2,
  Scale,
} from "lucide-react"
import { documentos, formatFecha } from "@/lib/data"
import { ediciones } from "@/lib/ediciones"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { BuscadorPrincipal } from "@/components/buscador-principal"
import { DocumentoCard } from "@/components/documento-card"
import { BotonDescargarEdicion } from "@/components/boton-descargar-edicion"
import { HashVerificable } from "@/components/hash-verificable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const ultimo = documentos[0]
  const recientes = documentos.slice(1, 4)
  const edicionUltimo =
    ediciones.find(
      (e) => e.fecha === ultimo.fechaPublicacion && e.tipo === "Ordinaria",
    ) ?? ediciones.find((e) => e.fecha === ultimo.fechaPublicacion)

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
            <Badge className="mb-4 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground">
              Gobierno del Estado de Querétaro
            </Badge>
            <h1 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              La Sombra de Arteaga
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-xl font-medium leading-snug text-primary-foreground">
              Publicación oficial verificable con qFirma
            </p>
            <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
              Consulta, valida y descarga publicaciones oficiales del Estado de
              Querétaro con trazabilidad, sello de tiempo y verificación
              pública.
            </p>

            <div className="mt-8 max-w-4xl">
              <BuscadorPrincipal />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Documentos verificables con qFirma
              </span>
              <span className="flex items-center gap-2">
                <FileSearch className="h-4 w-4" /> Verificación por folio, hash o QR
              </span>
              <Link href="/verificar" className="font-medium text-primary-foreground underline underline-offset-4 hover:no-underline">
                ¿Cómo funciona qFirma?
              </Link>
            </div>
          </div>
        </section>

        {/* Último periódico publicado */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold">
                Último periódico publicado
              </h2>
              <p className="text-sm text-muted-foreground">
                Edición vigente del Periódico Oficial del Estado
              </p>
            </div>
            <Button
              render={<Link href="/consultar" />}
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              Ver ediciones anteriores
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <Card className="overflow-hidden py-0">
            <div className="grid gap-0 md:grid-cols-[1fr_1.4fr]">
              <div className="flex flex-col justify-center gap-4 border-b border-border bg-secondary/50 p-6 md:border-b-0 md:border-r sm:p-8">
                <Badge className="w-fit bg-primary text-primary-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Edición auténtica y firmada
                </Badge>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Periódico Oficial
                  </p>
                  <p className="font-serif text-2xl font-semibold">
                    {ultimo.numeroPeriodico}
                  </p>
                </div>
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatFecha(ultimo.fechaPublicacion)}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {ultimo.horaPublicacion} h · Querétaro
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />6 documentos en esta edición
                  </div>
                </dl>
                <div className="flex flex-wrap gap-2">
                  {edicionUltimo ? (
                    <BotonDescargarEdicion
                      edicion={edicionUltimo}
                      size="default"
                      label="Descargar edición"
                    />
                  ) : (
                    <Button>
                      <Download className="h-4 w-4" />
                      Descargar edición
                    </Button>
                  )}
                  <Button
                    render={<Link href={`/documento/${ultimo.id}`} />}
                    variant="outline"
                  >
                    Ver contenido
                  </Button>
                </div>
              </div>

              <CardContent className="flex flex-col gap-3 p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Documento destacado
                </p>
                <h3 className="text-pretty font-serif text-xl font-semibold leading-snug">
                  {ultimo.titulo}
                </h3>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {ultimo.dependencia}
                </p>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {ultimo.resumen}
                </p>
                <HashVerificable hash={ultimo.hash} />
              </CardContent>
            </div>
          </Card>
        </section>

        {/* Acciones rápidas */}
        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3 sm:px-6">
            {[
              {
                icon: FileSearch,
                title: "Consultar publicaciones",
                desc: "Búsqueda avanzada, calendario, ediciones e índice del Periódico Oficial.",
                href: "/consultar",
                cta: "Ir a consultar",
              },
              {
                icon: FilePlus2,
                title: "Solicitar publicación",
                desc: "Particulares, notarías y dependencias pueden solicitar una publicación oficial.",
                href: "/solicitar",
                cta: "Iniciar solicitud",
              },
              {
                icon: ShieldCheck,
                title: "Verificar autenticidad",
                desc: "Valida un documento con folio, código QR o archivo PDF.",
                href: "/verificar",
                cta: "Verificar documento",
              },
            ].map((a) => (
              <Card key={a.title} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <a.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-serif text-lg font-semibold">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {a.desc}
                  </p>
                  <Button
                    render={<Link href={a.href} />}
                    variant="link"
                    className="mt-auto h-auto justify-start p-0"
                  >
                    {a.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Publicaciones recientes */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold">
              Publicaciones recientes
            </h2>
            <Button render={<Link href="/consultar" />} variant="ghost">
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recientes.map((doc) => (
              <DocumentoCard key={doc.id} doc={doc} />
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
