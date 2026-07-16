"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { getSolicitudCiudadana } from "@/lib/ciudadano"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { SeguimientoDetalle } from "@/components/solicitar/seguimiento-detalle"

export default function SeguimientoFolioPage({
  params,
}: {
  params: Promise<{ folio: string }>
}) {
  const { folio } = use(params)
  const solicitud = getSolicitudCiudadana(folio)

  if (!solicitud) {
    notFound()
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PublicHeader />
      <main className="flex-1 px-4 py-8 sm:px-6">
        <SeguimientoDetalle s={solicitud} />
      </main>
      <PublicFooter />
    </div>
  )
}
