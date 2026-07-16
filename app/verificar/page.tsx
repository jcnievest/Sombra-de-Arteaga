"use client"

import { useState } from "react"
import {
  ShieldCheck,
  Upload,
  Search,
  CheckCircle2,
  Loader2,
  QrCode,
  FileText,
} from "lucide-react"
import { documentos, formatFecha } from "@/lib/data"
import type { DocumentoOficial } from "@/lib/data"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

type Estado = "idle" | "verificando" | "valido" | "invalido"

export default function VerificarPage() {
  const [folio, setFolio] = useState("")
  const [estado, setEstado] = useState<Estado>("idle")
  const [resultado, setResultado] = useState<DocumentoOficial | null>(null)

  const verificarFolio = (e?: React.FormEvent) => {
    e?.preventDefault()
    setEstado("verificando")
    setTimeout(() => {
      const encontrado = documentos.find(
        (d) => d.folio.toLowerCase() === folio.trim().toLowerCase(),
      )
      if (encontrado) {
        setResultado(encontrado)
        setEstado("valido")
      } else {
        setResultado(null)
        setEstado("invalido")
      }
    }, 1600)
  }

  const verificarArchivo = () => {
    setEstado("verificando")
    setTimeout(() => {
      setResultado(documentos[0])
      setEstado("valido")
    }, 1900)
  }

  const reset = () => {
    setEstado("idle")
    setResultado(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="font-serif text-3xl font-semibold">
            Verificar autenticidad
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Comprueba la validez de una publicación oficial cargando el archivo
            PDF, ingresando el folio de verificación o escaneando su código QR.
          </p>
        </div>

        {estado !== "valido" && estado !== "invalido" && (
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="folio">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="folio">
                    <Search className="h-4 w-4" />
                    Folio
                  </TabsTrigger>
                  <TabsTrigger value="archivo">
                    <Upload className="h-4 w-4" />
                    Archivo PDF
                  </TabsTrigger>
                  <TabsTrigger value="qr">
                    <QrCode className="h-4 w-4" />
                    Código QR
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="folio" className="mt-5">
                  <form onSubmit={verificarFolio} className="flex flex-col gap-3">
                    <Label htmlFor="folio">Folio de verificación</Label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        id="folio"
                        value={folio}
                        onChange={(e) => setFolio(e.target.value)}
                        placeholder="POEQ-2026-00481"
                        className="font-mono"
                      />
                      <Button
                        type="submit"
                        disabled={!folio || estado === "verificando"}
                      >
                        {estado === "verificando" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        Verificar
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ejemplo: POEQ-2026-00481
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="archivo" className="mt-5">
                  <div className="flex flex-col gap-4">
                    <label
                      htmlFor="pdf"
                      className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/60"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Arrastra o selecciona un archivo PDF
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Se calculará el hash SHA-256 para validar la integridad.
                      </span>
                      <Input id="pdf" type="file" accept=".pdf" className="hidden" />
                    </label>
                    <Button
                      onClick={verificarArchivo}
                      disabled={estado === "verificando"}
                    >
                      {estado === "verificando" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                      Verificar documento
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="qr" className="mt-5">
                  <div className="flex flex-col items-center gap-4 py-4 text-center">
                    <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                      <QrCode className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Apunta la cámara al código QR del documento para validarlo
                      automáticamente.
                    </p>
                    <Button onClick={verificarArchivo} variant="outline">
                      <QrCode className="h-4 w-4" />
                      Activar cámara
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {estado === "verificando" && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Validando qFirma y sello de tiempo…
          </p>
        )}

        {estado === "valido" && resultado && (
          <Card className="border-foreground/25">
            <CardHeader className="items-center gap-2 text-center">
              <CheckCircle2 className="h-12 w-12 text-foreground" />
              <CardTitle className="font-serif text-xl">
                Documento auténtico
              </CardTitle>
              <Badge className="bg-primary text-primary-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verificado con qFirma · vigente
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Separator />
              <h3 className="text-pretty font-serif text-base font-semibold">
                {resultado.titulo}
              </h3>

              {/* Resultado de la validación */}
              <div className="rounded-lg border border-foreground/20 bg-secondary/40 p-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Resultado de la verificación
                </p>
                <dl className="flex flex-col divide-y divide-border">
                  <ResultadoLinea
                    label="Estado"
                    value="Documento auténtico"
                    ok
                  />
                  <ResultadoLinea
                    label="Folio de verificación"
                    value={resultado.folio}
                    mono
                  />
                  <ResultadoLinea
                    label="Hash verificado"
                    value="Coincidente"
                    ok
                  />
                  <ResultadoLinea
                    label="Firmante institucional"
                    value={`${resultado.firmante} · ${resultado.cargoFirmante}`}
                  />
                  <ResultadoLinea
                    label="Fecha y hora de publicación"
                    value={`${formatFecha(resultado.fechaPublicacion)} · ${resultado.horaPublicacion} h`}
                  />
                  <ResultadoLinea
                    label="Sello de tiempo"
                    value="Válido"
                    ok
                  />
                  <ResultadoLinea
                    label="Estado del archivo"
                    value="No alterado"
                    ok
                  />
                </dl>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button>
                  <FileText className="h-4 w-4" />
                  Descargar constancia de validación
                </Button>
                <Button render={<a href={`/documento/${resultado.id}`} />} variant="outline">
                  Ver ficha completa
                </Button>
                <Button variant="ghost" onClick={reset}>
                  Verificar otro
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {estado === "invalido" && (
          <Card className="border-destructive/40">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <ShieldCheck className="h-6 w-6 text-destructive" />
              </span>
              <p className="font-serif text-lg font-semibold">
                No se encontró el documento
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                El folio ingresado no corresponde a ninguna publicación oficial
                verificable. Revisa el dato e intenta nuevamente.
              </p>
              <Button variant="outline" onClick={reset}>
                Intentar de nuevo
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}

function ResultadoLinea({
  label,
  value,
  ok,
  mono,
}: {
  label: string
  value: string
  ok?: boolean
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        className={`flex items-center gap-1.5 text-right text-sm font-medium text-foreground ${
          mono ? "break-all font-mono text-xs" : ""
        }`}
      >
        {ok && <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground" />}
        {value}
      </dd>
    </div>
  )
}
