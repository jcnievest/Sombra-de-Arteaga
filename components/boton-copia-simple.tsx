"use client"

import { Download } from "lucide-react"
import type { Edicion } from "@/lib/ediciones"
import { descargarEdicionPdf } from "@/lib/generar-pdf-edicion"
import { Button } from "@/components/ui/button"

interface Props {
  edicion: Edicion
  label?: string
  iconOnly?: boolean
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default"
  className?: string
}

export function BotonCopiaSimple({
  edicion,
  label = "Descargar copia simple gratuita",
  iconOnly = false,
  variant = "outline",
  size = "sm",
  className,
}: Props) {
  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon" : size}
      className={className}
      onClick={() => descargarEdicionPdf(edicion, false)}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
    >
      <Download className="h-4 w-4" />
      {!iconOnly && label}
    </Button>
  )
}
