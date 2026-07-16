import type { Metadata } from "next"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { LeyesCatalogo } from "@/components/leyes/leyes-catalogo"
import { ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Leyes vigentes del Estado de Querétaro | La Sombra de Arteaga",
  description:
    "Consulta el marco jurídico estatal, sus reformas, publicaciones oficiales y versiones vigentes verificables con qFirma.",
}

export default function LeyesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* Encabezado */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <p className="text-sm font-medium text-muted-foreground">Marco jurídico estatal</p>
            <h1 className="mt-1 text-balance font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Leyes vigentes del Estado de Querétaro
            </h1>
            <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
              Consulta el marco jurídico estatal, sus reformas, publicaciones oficiales y
              versiones vigentes verificables.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Versiones consolidadas con trazabilidad normativa y validación mediante qFirma
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <LeyesCatalogo />
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
