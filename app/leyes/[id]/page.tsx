import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getLey } from "@/lib/leyes"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { LeyDetalle } from "@/components/leyes/ley-detalle"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const ley = getLey(id)
  if (!ley) return { title: "Ley no encontrada | La Sombra de Arteaga" }
  return {
    title: `${ley.nombreCorto} | Leyes vigentes de Querétaro`,
    description: ley.resumen,
  }
}

export default async function LeyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params
  const { tab } = await searchParams
  const ley = getLey(id)
  if (!ley) notFound()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <nav
          aria-label="Ruta de navegación"
          className="border-b border-border bg-card"
        >
          <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 py-3 text-sm text-muted-foreground sm:px-6">
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
            <li className="font-medium text-foreground" aria-current="page">
              {ley.nombreCorto}
            </li>
          </ol>
        </nav>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <LeyDetalle ley={ley} tabInicial={tab} />
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
