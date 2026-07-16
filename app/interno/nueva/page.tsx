"use client"

import { useState } from "react"
import Link from "next/link"
import { FilePlus2, Upload, ShieldCheck, Info, ShieldAlert } from "lucide-react"
import { dependencias, tiposActo } from "@/lib/data"
import { FirmaModal } from "@/components/firma-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NuevaSolicitudPage() {
  const [titulo, setTitulo] = useState("")
  const [firmaOpen, setFirmaOpen] = useState(false)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">
          Carga institucional directa
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra una publicación institucional para su revisión y publicación
          en el Periódico Oficial.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-foreground/20 bg-secondary/40 p-4">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-medium">Uso exclusivo para dependencias autorizadas.</span>{" "}
          Las solicitudes de particulares ingresan por la ventanilla ciudadana y
          se atienden desde la{" "}
          <Link
            href="/interno/solicitudes"
            className="font-medium text-primary underline underline-offset-2"
          >
            Bandeja de solicitudes
          </Link>
          .
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <FilePlus2 className="h-5 w-5 text-primary" />
              Datos del documento
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dep">Dependencia solicitante</Label>
                <Select>
                  <SelectTrigger id="dep" className="w-full">
                    <SelectValue placeholder="Selecciona…" />
                  </SelectTrigger>
                  <SelectContent>
                    {dependencias.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tipo">Tipo de acto</Label>
                <Select>
                  <SelectTrigger id="tipo" className="w-full">
                    <SelectValue placeholder="Selecciona…" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposActo.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="titulo">Título del documento</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Decreto por el que se reforma…"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fundamento">Fundamento legal</Label>
              <Textarea
                id="fundamento"
                rows={3}
                placeholder="Artículos, leyes y disposiciones que sustentan la publicación…"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fecha">Fecha deseada de publicación</Label>
                <Input id="fecha" type="date" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="responsable">Funcionario responsable</Label>
                <Input
                  id="responsable"
                  placeholder="Nombre y cargo"
                  defaultValue="Lic. María Fernanda Reyes Olvera"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pdf">Archivo PDF del documento</Label>
              <label
                htmlFor="pdf"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-8 text-center transition-colors hover:bg-muted/60"
              >
                <Upload className="h-7 w-7 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Arrastra o selecciona el archivo PDF
                </span>
                <span className="text-xs text-muted-foreground">
                  Tamaño máximo 25 MB · Solo formato PDF/A
                </span>
                <Input id="pdf" type="file" accept=".pdf" className="hidden" />
              </label>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                render={<Link href="/interno/solicitudes">Cancelar</Link>}
              />
              <Button variant="secondary">Guardar borrador</Button>
              <Button onClick={() => setFirmaOpen(true)}>
                <ShieldCheck className="h-4 w-4" />
                Firmar solicitud con qFirma
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ayuda lateral */}
        <aside className="flex flex-col gap-4">
          <Card className="border-accent-foreground/15 bg-accent/40">
            <CardContent className="flex flex-col gap-2 p-5">
              <Info className="h-5 w-5 text-accent-foreground" />
              <p className="font-medium text-accent-foreground">
                Proceso de revisión
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Una vez firmada, la solicitud ingresa al flujo: Recibido → En
                revisión → Validado → Programado → Publicado.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-2 p-5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="font-medium">qFirma / Firma Electrónica Avanzada</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                La firma con qFirma da certeza jurídica al trámite y vincula al
                funcionario responsable con el documento presentado.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      <FirmaModal
        open={firmaOpen}
        onOpenChange={setFirmaOpen}
        titulo="Firmar solicitud con qFirma"
        documento={titulo || "Solicitud de publicación"}
      />
    </div>
  )
}
