import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getLey } from "@/lib/leyes"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { LeyLector } from "@/components/leyes/ley-lector"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const ley = getLey(id)
  if (!ley) return { title: "Ley no encontrada | La Sombra de Arteaga" }
  return {
    title: `Leer ${ley.nombreCorto} en línea | Querétaro`,
    description: `Lectura accesible del texto vigente de ${ley.nombre}.`,
  }
}

export default async function LeerLeyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const ley = getLey(id)
  if (!ley) notFound()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        <nav aria-label="Ruta de navegación" className="border-b border-border bg-card">
          <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1.5 px-4 py-3 text-sm text-muted-foreground sm:px-6">
            <li>
              <Link href="/" className="hover:text-foreground hover:underline">
                Inicio
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <li>
              <Link href="/leyes" className="hover:text-foreground hover:underline">
                Leyes vigentes
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <li>
              <Link href={`/leyes/${ley.id}`} className="hover:text-foreground hover:underline">
                {ley.nombreCorto}
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <li className="font-medium text-foreground" aria-current="page">
              Lectura en línea
            </li>
          </ol>
        </nav>

        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="mb-5">
            <h1 className="text-balance font-serif text-2xl font-bold tracking-tight">
              {ley.nombre}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Texto vigente consolidado a partir de publicaciones oficiales en La Sombra de Arteaga.
            </p>
          </div>
          <LeyLector ley={ley} />
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
