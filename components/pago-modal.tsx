"use client"

import { useState } from "react"
import {
  CreditCard,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Lock,
  FileWarning,
  Download,
} from "lucide-react"
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
import type { Edicion } from "@/lib/ediciones"
import { descargarEdicionPdf } from "@/lib/generar-pdf-edicion"

// Costo fijo simulado por ejemplar oficial firmado
const COSTO_EJEMPLAR = 90

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  edicion: Edicion
}

type Fase = "datos" | "procesando" | "aprobado"

function soloDigitos(v: string) {
  return v.replace(/\D/g, "")
}

const moneda = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN" })

export function PagoModal({ open, onOpenChange, edicion }: Props) {
  const [fase, setFase] = useState<Fase>("datos")
  const [numero, setNumero] = useState("")
  const [nombre, setNombre] = useState("")
  const [exp, setExp] = useState("")
  const [cvv, setCvv] = useState("")

  const numeroFmt = soloDigitos(numero)
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim()
  const completo =
    soloDigitos(numero).length >= 15 &&
    nombre.trim().length > 2 &&
    exp.length === 5 &&
    cvv.length >= 3

  const reset = () => {
    setFase("datos")
    setNumero("")
    setNombre("")
    setExp("")
    setCvv("")
  }

  const pagar = () => {
    setFase("procesando")
    setTimeout(() => {
      setFase("aprobado")
      toast.success("Pago aprobado", {
        description: "Tu ejemplar oficial firmado está listo para descargar.",
      })
    }, 2400)
  }

  const descargarFirmado = () => {
    descargarEdicionPdf(edicion, true)
    toast.success("Descargando ejemplar oficial", {
      description: "PDF firmado con qFirma, hash, sello de tiempo y QR.",
    })
    onOpenChange(false)
    setTimeout(reset, 200)
  }

  const descargarSimple = () => {
    descargarEdicionPdf(edicion, false)
    toast("Descargando copia simple", {
      description: "Documento informativo sin validez oficial.",
    })
    onOpenChange(false)
    setTimeout(reset, 200)
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
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CreditCard className="h-5 w-5" />
          </div>
          <DialogTitle className="font-serif">
            Pago del ejemplar oficial
          </DialogTitle>
          <DialogDescription>
            {`Periódico Oficial No. ${edicion.numero} · ${edicion.tomo}`}
          </DialogDescription>
        </DialogHeader>

        {fase === "datos" && (
          <div className="flex flex-col gap-4">
            {/* Resumen de cobro */}
            <div className="flex items-center justify-between rounded-md border border-border bg-secondary/40 p-3">
              <div>
                <p className="text-sm font-medium">Ejemplar firmado (FEA)</p>
                <p className="text-xs text-muted-foreground">
                  {`${edicion.paginas} páginas · ${edicion.documentos.length} documentos`}
                </p>
              </div>
              <p className="font-serif text-lg font-semibold">
                {moneda(COSTO_EJEMPLAR)}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card">Número de tarjeta</Label>
              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="card"
                  inputMode="numeric"
                  className="pl-9 font-mono"
                  placeholder="4242 4242 4242 4242"
                  value={numeroFmt}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nombre en la tarjeta</Label>
              <Input
                id="name"
                placeholder="Como aparece en la tarjeta"
                value={nombre}
                onChange={(e) => setNombre(e.target.value.toUpperCase())}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="exp">Vencimiento</Label>
                <Input
                  id="exp"
                  inputMode="numeric"
                  className="font-mono"
                  placeholder="MM/AA"
                  value={exp}
                  onChange={(e) => {
                    const d = soloDigitos(e.target.value).slice(0, 4)
                    setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="cvv"
                    inputMode="numeric"
                    type="password"
                    className="pl-9 font-mono"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(soloDigitos(e.target.value).slice(0, 4))}
                  />
                </div>
              </div>
            </div>

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              Pago simulado y cifrado. No se procesan cargos reales.
            </p>
          </div>
        )}

        {fase === "procesando" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium">Procesando pago…</p>
            <p className="text-sm text-muted-foreground">
              Autorizando el cargo con la entidad bancaria.
            </p>
          </div>
        )}

        {fase === "aprobado" && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <p className="font-serif text-lg font-semibold">Pago aprobado</p>
            <Separator />
            <div className="w-full rounded-md border border-border bg-secondary/40 p-3 text-left">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed">
                  Tu ejemplar incluye Firma Electrónica Avanzada (qFirma), huella
                  digital SHA-256, sello digital de tiempo y código QR de
                  verificación. Este documento tiene validez legal.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col sm:gap-2">
          {fase === "datos" && (
            <>
              <Button className="w-full" onClick={pagar} disabled={!completo}>
                <Lock className="h-4 w-4" />
                {`Pagar ${moneda(COSTO_EJEMPLAR)} y descargar firmado`}
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={descargarSimple}
              >
                <FileWarning className="h-4 w-4" />
                Descargar copia simple sin validez legal
              </Button>
            </>
          )}
          {fase === "aprobado" && (
            <Button className="w-full" onClick={descargarFirmado}>
              <Download className="h-4 w-4" />
              Descargar ejemplar oficial firmado
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
