import { Suspense } from "react"
import type { Metadata } from "next"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { ConsultarCliente } from "@/components/consultar/consultar-cliente"

export const metadata: Metadata = {
  title: "Consultar publicaciones | La Sombra de Arteaga",
  description:
    "Consulta el Periódico Oficial del Estado de Querétaro: búsqueda avanzada, calendario de publicaciones, ediciones del periódico e índice de publicaciones.",
}

export default function ConsultarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-semibold text-balance">
            Consultar publicaciones
          </h1>
          <p className="max-w-2xl text-pretty text-sm text-muted-foreground">
            Encuentra publicaciones oficiales del Estado de Querétaro mediante
            búsqueda avanzada, calendario, ediciones del Periódico Oficial e
            índice de publicaciones. Todas las ediciones están firmadas con
            qFirma y son verificables.
          </p>
        </div>

        <Suspense fallback={null}>
          <ConsultarCliente />
        </Suspense>
      </main>

      <PublicFooter />
    </div>
  )
}
