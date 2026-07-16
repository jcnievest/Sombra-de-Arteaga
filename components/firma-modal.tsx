"use client"

import { useState } from "react"
import { ShieldCheck, KeyRound, Loader2, CheckCircle2, FileText } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface FirmaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  titulo: string
  documento: string
  onFirmado?: () => void
}

type Fase = "datos" | "firmando" | "completado"

export function FirmaModal({
  open,
  onOpenChange,
  titulo,
  documento,
  onFirmado,
}: FirmaModalProps) {
  const [fase, setFase] = useState<Fase>("datos")

  const reset = () => setFase("datos")

  const firmar = () => {
    setFase("firmando")
    setTimeout(() => {
      setFase("completado")
      toast.success("Documento firmado con qFirma", {
        description: "La firma electrónica avanzada se aplicó correctamente.",
      })
      onFirmado?.()
    }, 2200)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) setTimeout(reset, 200)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <DialogTitle className="font-serif">{titulo}</DialogTitle>
          <DialogDescription>{documento}</DialogDescription>
        </DialogHeader>

        {fase === "datos" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              qFirma / Firma Electrónica Avanzada garantiza la identidad del
              firmante y la integridad del documento conforme a la legislación
              vigente.
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rfc">RFC del firmante</Label>
              <Input id="rfc" placeholder="XAXX010101000" defaultValue="REOM850412QT4" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cer">Certificado (.cer)</Label>
              <Input id="cer" type="file" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="key">Clave privada (.key)</Label>
              <Input id="key" type="file" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pin">Contraseña de la clave privada</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pin"
                  type="password"
                  className="pl-9"
                  defaultValue="••••••••"
                />
              </div>
            </div>
          </div>
        )}

        {fase === "firmando" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium">Aplicando firma electrónica…</p>
            <p className="text-sm text-muted-foreground">
              Validando certificado y generando sello digital SHA-256.
            </p>
          </div>
        )}

        {fase === "completado" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-foreground" />
            <p className="font-serif text-lg font-semibold">
              Documento firmado correctamente
            </p>
            <Separator />
            <div className="w-full rounded-md border border-border bg-muted/40 p-3 text-left">
              <p className="text-xs text-muted-foreground">Sello digital (hash)</p>
              <p className="break-all font-mono text-xs">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Firmante</p>
              <p className="text-sm font-medium">
                Lic. María Fernanda Reyes Olvera
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {fase === "datos" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={firmar}>
                <ShieldCheck className="h-4 w-4" />
                Firmar con qFirma
              </Button>
            </>
          )}
          {fase === "completado" && (
            <Button onClick={() => onOpenChange(false)} className="w-full">
              <FileText className="h-4 w-4" />
              Aceptar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
