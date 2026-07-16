"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PagoModal } from "@/components/pago-modal"
import type { Edicion } from "@/lib/ediciones"

interface Props {
  edicion: Edicion
  size?: "sm" | "default"
  variant?: "default" | "outline" | "ghost"
  className?: string
  label?: string
  iconOnly?: boolean
}

export function BotonDescargarEdicion({
  edicion,
  size = "sm",
  variant = "default",
  className,
  label = "Descargar PDF",
  iconOnly = false,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={iconOnly ? "icon" : size}
        className={className}
        onClick={() => setOpen(true)}
        aria-label={iconOnly ? label : undefined}
      >
        <Download className="h-4 w-4" />
        {!iconOnly && label}
      </Button>
      <PagoModal open={open} onOpenChange={setOpen} edicion={edicion} />
    </>
  )
}
