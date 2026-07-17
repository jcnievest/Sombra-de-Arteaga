"use client"

import { Eye } from "lucide-react"
import type { Edicion } from "@/lib/ediciones"
import { previsualizarCopiaSimplePdf } from "@/lib/generar-pdf-edicion"
import { Button } from "@/components/ui/button"

export function BotonVistaPreviaSimple({ edicion }: { edicion: Edicion }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => previsualizarCopiaSimplePdf(edicion)}
      aria-label="Vista previa de copia simple"
      title="Vista previa de copia simple"
    >
      <Eye className="h-4 w-4" />
    </Button>
  )
}
