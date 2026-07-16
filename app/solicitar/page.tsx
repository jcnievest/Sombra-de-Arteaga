import type { Metadata } from "next"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { SolicitarWizard } from "@/components/solicitar/solicitar-wizard"

export const metadata: Metadata = {
  title: "Solicitar publicación | La Sombra de Arteaga",
  description:
    "Registra una solicitud de publicación en el Periódico Oficial del Estado de Querétaro con pago digital, validación documental y verificación con qFirma.",
}

export default function SolicitarPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PublicHeader />
      <main className="flex-1 px-4 py-8 sm:px-6">
        <SolicitarWizard />
      </main>
      <PublicFooter />
    </div>
  )
}
