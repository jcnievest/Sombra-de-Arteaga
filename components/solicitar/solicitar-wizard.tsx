"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  FileText,
  Upload,
  ClipboardCheck,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Info,
  Building2,
  User,
  ArrowRight,
  ArrowLeft,
  Save,
  Hash,
  Clock,
  Download,
  PenLine,
} from "lucide-react"
import { toast } from "sonner"
import {
  tiposSolicitante,
  tiposPublicacion,
  documentosBase,
  TARIFA_POR_PAGINA,
  type DocumentoCarga,
  type EstatusDocumento,
  type TipoSolicitante,
} from "@/lib/ciudadano"
import { formatFecha } from "@/lib/data"
import { Stepper, type Paso } from "@/components/solicitar/stepper"
import { DocumentoBadge } from "@/components/ciudadano-badges"
import { FirmaModal } from "@/components/firma-modal"
import { QrSimulado } from "@/components/qr-simulado"
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

const pasos: Paso[] = [
  { numero: 1, titulo: "Solicitud" },
  { numero: 2, titulo: "Documentos" },
  { numero: 3, titulo: "Prevalidación" },
  { numero: 4, titulo: "Pago" },
  { numero: 5, titulo: "Acuse" },
]

const FOLIO = "SCP-2026-00371"

export function SolicitarWizard() {
  const router = useRouter()
  const [paso, setPaso] = useState(1)
  const [tipoSolicitante, setTipoSolicitante] = useState<TipoSolicitante | "">("")
  const [tipoPublicacion, setTipoPublicacion] = useState("")
  const [paginas, setPaginas] = useState(2)
  const [docs, setDocs] = useState<DocumentoCarga[]>(documentosBase)
  const [pagoGenerado, setPagoGenerado] = useState(false)
  const [firmaOpen, setFirmaOpen] = useState(false)

  const esDependencia =
    tipoSolicitante !== "" && tipoSolicitante !== "Particular"

  const importe = paginas * TARIFA_POR_PAGINA

  function marcarDoc(id: string, estatus: EstatusDocumento) {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, estatus } : d)),
    )
  }

  function avanzar() {
    setPaso((p) => Math.min(5, p + 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  function retroceder() {
    setPaso((p) => Math.max(1, p - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
          Solicitar publicación
        </h1>
        <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
          Registra y da seguimiento a tu solicitud de publicación en el
          Periódico Oficial del Estado de Querétaro, con pago digital,
          validación documental y verificación pública con qFirma.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <Stepper pasos={pasos} actual={paso} onSelect={setPaso} />
        </CardContent>
      </Card>

      {paso === 1 && (
        <PasoSolicitud
          tipoSolicitante={tipoSolicitante}
          setTipoSolicitante={setTipoSolicitante}
          tipoPublicacion={tipoPublicacion}
          setTipoPublicacion={setTipoPublicacion}
        />
      )}

      {paso === 2 && (
        <PasoDocumentos docs={docs} marcarDoc={marcarDoc} />
      )}

      {paso === 3 && (
        <PasoPrevalidacion
          tipoPublicacion={tipoPublicacion}
          paginas={paginas}
          setPaginas={setPaginas}
          importe={importe}
          docs={docs}
        />
      )}

      {paso === 4 && (
        <PasoPago
          paginas={paginas}
          importe={importe}
          pagoGenerado={pagoGenerado}
          setPagoGenerado={setPagoGenerado}
        />
      )}

      {paso === 5 && (
        <PasoAcuse
          esDependencia={esDependencia}
          onFirmar={() => setFirmaOpen(true)}
        />
      )}

      {/* Navegación */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={retroceder}
          disabled={paso === 1}
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex flex-col gap-2 sm:flex-row">
          {paso < 5 && (
            <Button
              variant="secondary"
              onClick={() =>
                toast.success("Borrador guardado", {
                  description: `Folio ${FOLIO} · puedes retomarlo en "Mis solicitudes".`,
                })
              }
            >
              <Save className="h-4 w-4" />
              Guardar borrador
            </Button>
          )}
          {paso === 3 && (
            <Button onClick={avanzar}>
              <CreditCard className="h-4 w-4" />
              Generar pago
            </Button>
          )}
          {paso === 4 && (
            <Button onClick={avanzar}>
              <ArrowRight className="h-4 w-4" />
              Enviar a revisión
            </Button>
          )}
          {paso !== 3 && paso !== 4 && paso < 5 && (
            <Button onClick={avanzar}>
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {paso === 5 && (
            <Button onClick={() => router.push("/solicitar/seguimiento")}>
              Ir a mis solicitudes
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <FirmaModal
        open={firmaOpen}
        onOpenChange={setFirmaOpen}
        titulo={
          esDependencia
            ? "Firmar solicitud con qFirma"
            : "Firmar electrónicamente con qFirma"
        }
        documento={`Solicitud ${FOLIO}`}
        onFirmado={() =>
          toast.success("Solicitud firmada con qFirma", {
            description: "Tu solicitud quedó firmada electrónicamente.",
          })
        }
      />
    </div>
  )
}

/* ---------- Paso 1: Solicitud ---------- */
function PasoSolicitud({
  tipoSolicitante,
  setTipoSolicitante,
  tipoPublicacion,
  setTipoPublicacion,
}: {
  tipoSolicitante: string
  setTipoSolicitante: (v: TipoSolicitante) => void
  tipoPublicacion: string
  setTipoPublicacion: (v: string) => void
}) {
  const esParticular =
    tipoSolicitante === "Particular" || tipoSolicitante === ""

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Datos de la solicitud
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Campo label="Tipo de solicitante">
            <Select
              value={tipoSolicitante}
              onValueChange={(v) => setTipoSolicitante(v as TipoSolicitante)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona…" />
              </SelectTrigger>
              <SelectContent>
                {tiposSolicitante.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
          <Campo label="Tipo de publicación">
            <Select
              value={tipoPublicacion}
              onValueChange={(v) => setTipoPublicacion(v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona…" />
              </SelectTrigger>
              <SelectContent>
                {tiposPublicacion.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            {esParticular ? (
              <User className="h-5 w-5 text-primary" />
            ) : (
              <Building2 className="h-5 w-5 text-primary" />
            )}
            Datos del solicitante
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Campo label={esParticular ? "Nombre completo" : "Nombre o razón social"}>
            <Input placeholder={esParticular ? "Nombre y apellidos" : "Razón social"} />
          </Campo>
          <Campo label="RFC (opcional)">
            <Input placeholder="XXXX000000XX0" />
          </Campo>
          <Campo label="CURP (opcional)">
            <Input placeholder="18 caracteres" />
          </Campo>
          <Campo label="Correo electrónico">
            <Input type="email" placeholder="correo@ejemplo.com" />
          </Campo>
          <Campo label="Teléfono">
            <Input placeholder="442 000 0000" />
          </Campo>
          <Campo label="Representante legal (si aplica)">
            <Input placeholder="Nombre del representante" />
          </Campo>
          <div className="sm:col-span-2">
            <Campo label="Domicilio para oír y recibir notificaciones">
              <Input placeholder="Calle, número, colonia, municipio, C.P." />
            </Campo>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Acto o documento a publicar
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Campo label="Descripción del acto o documento">
            <Input placeholder="Ej. Edicto de notificación, aviso de sucesión…" />
          </Campo>
          <Campo label="Fundamento o motivo de publicación">
            <Textarea
              rows={3}
              placeholder="Disposición legal, mandato judicial o motivo que sustenta la publicación…"
            />
          </Campo>
        </CardContent>
      </Card>
    </div>
  )
}

/* ---------- Paso 2: Documentos ---------- */
function PasoDocumentos({
  docs,
  marcarDoc,
}: {
  docs: DocumentoCarga[]
  marcarDoc: (id: string, e: EstatusDocumento) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <Upload className="h-5 w-5 text-primary" />
          Carga de documentos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {docs.map((d) => (
          <div
            key={d.id}
            className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{d.nombre}</p>
                {d.requerido ? (
                  <span className="text-xs text-muted-foreground">
                    (Requerido)
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    (Si aplica)
                  </span>
                )}
                <DocumentoBadge estatus={d.estatus} />
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {d.descripcion}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {d.estatus === "Pendiente" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => marcarDoc(d.id, "Cargado")}
                >
                  <Upload className="h-4 w-4" />
                  Cargar
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => marcarDoc(d.id, "Pendiente")}
                >
                  Reemplazar
                </Button>
              )}
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Formatos aceptados: PDF/A, JPG o PNG. Tamaño máximo 25 MB por archivo.
        </p>
      </CardContent>
    </Card>
  )
}

/* ---------- Paso 3: Prevalidación ---------- */
function PasoPrevalidacion({
  tipoPublicacion,
  paginas,
  setPaginas,
  importe,
  docs,
}: {
  tipoPublicacion: string
  paginas: number
  setPaginas: (n: number) => void
  importe: number
  docs: DocumentoCarga[]
}) {
  const cargados = docs.filter((d) => d.estatus !== "Pendiente")
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            Resumen de la solicitud
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Dato label="Tipo de publicación" value={tipoPublicacion || "Sin especificar"} />
            <Dato label="Número estimado de páginas" value={`${paginas} págs.`} />
            <Dato
              label="Costo estimado"
              value={importe.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })}
            />
            <Dato
              label="Fecha tentativa de publicación"
              value={formatFecha("2026-06-26")}
            />
          </dl>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="paginas">Ajustar número de páginas</Label>
            <Input
              id="paginas"
              type="number"
              min={1}
              value={paginas}
              onChange={(e) =>
                setPaginas(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-base">
            Documentos adjuntos
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {cargados.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aún no has cargado documentos.
            </p>
          )}
          {cargados.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 p-3 text-sm"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {d.nombre}
              </span>
              <DocumentoBadge estatus={d.estatus} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

/* ---------- Paso 4: Pago ---------- */
function PasoPago({
  paginas,
  importe,
  pagoGenerado,
  setPagoGenerado,
}: {
  paginas: number
  importe: number
  pagoGenerado: boolean
  setPagoGenerado: (v: boolean) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <CreditCard className="h-5 w-5 text-primary" />
          Pago de derechos de publicación
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Dato label="Concepto de pago" value="Derechos por publicación en el Periódico Oficial" />
          <Dato label="Número de páginas" value={`${paginas} págs.`} />
          <Dato
            label="Tarifa aplicable"
            value={`${TARIFA_POR_PAGINA.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })} / página`}
          />
          <Dato label="Vigencia de línea de captura" value={formatFecha("2026-06-23")} />
        </dl>

        <div className="rounded-lg border border-foreground/20 bg-secondary/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Importe total</span>
            <span className="font-serif text-2xl font-semibold">
              {importe.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })}
            </span>
          </div>
          {pagoGenerado && (
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm">LC-7741-0097-0371</span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-foreground/40 px-2.5 py-0.5 text-xs font-medium text-foreground">
                <Clock className="h-3 w-3" />
                Pago pendiente
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            onClick={() =>
              toast.success("Redirigiendo a la pasarela de pago…", {
                description: "Pago en línea simulado para el prototipo.",
              })
            }
          >
            <CreditCard className="h-4 w-4" />
            Pagar en línea
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPagoGenerado(true)
              toast.success("Línea de captura generada", {
                description: "Referencia LC-7741-0097-0371.",
              })
            }}
          >
            <FileText className="h-4 w-4" />
            Generar línea de captura
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Comprobante cargado", {
                description: "Quedará en validación por la tesorería.",
              })
            }
          >
            <Upload className="h-4 w-4" />
            Subir comprobante de pago
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------- Paso 5: Acuse ---------- */
function PasoAcuse({
  esDependencia,
  onFirmar,
}: {
  esDependencia: boolean
  onFirmar: () => void
}) {
  return (
    <Card className="overflow-hidden py-0">
      <div className="flex items-center gap-3 border-b border-border bg-primary px-6 py-4 text-primary-foreground">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-foreground/15">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
            Acuse electrónico
          </p>
          <p className="font-serif text-lg font-semibold">
            Solicitud recibida correctamente
          </p>
        </div>
      </div>
      <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Dato label="Folio de solicitud" value={FOLIO} mono />
            <Dato
              label="Fecha y hora de recepción"
              value={`${formatFecha("2026-06-16")} · 12:48 h`}
            />
          </dl>

          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm leading-relaxed text-muted-foreground">
            Conserva este acuse. Podrás dar seguimiento al estado de tu
            solicitud en la sección{" "}
            <span className="font-medium text-foreground">
              Mis solicitudes de publicación
            </span>
            .
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Firma de la solicitud</p>
            {esDependencia ? (
              <Button className="w-full sm:w-fit" onClick={onFirmar}>
                <ShieldCheck className="h-4 w-4" />
                Firmar solicitud con qFirma
              </Button>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={onFirmar}>
                  <PenLine className="h-4 w-4" />
                  Firmar electrónicamente con qFirma
                </Button>
                <Button
                  onClick={() =>
                    toast.success("Solicitud enviada", {
                      description:
                        "Aceptación digital registrada; sujeta a validación documental.",
                    })
                  }
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Enviar con aceptación digital
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {esDependencia
                ? "Las dependencias firman con qFirma / Firma Electrónica Avanzada."
                : "Si no cuentas con qFirma, puedes enviar con aceptación digital y validación documental."}
            </p>
          </div>

          <Button
            variant="secondary"
            className="w-full sm:w-fit"
            onClick={() =>
              toast.success("Descargando acuse…", {
                description: "Acuse electrónico en PDF.",
              })
            }
          >
            <Download className="h-4 w-4" />
            Descargar acuse
          </Button>
        </div>

        <div className="flex flex-col items-center gap-3 md:border-l md:border-border md:pl-6">
          <div className="rounded-lg border border-border bg-card p-3">
            <QrSimulado value={FOLIO} size={140} />
          </div>
          <p className="max-w-[140px] text-center text-xs text-muted-foreground">
            QR de seguimiento de tu solicitud
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------- Helpers ---------- */
function Campo({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function Dato({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-sm font-medium" : "text-sm font-medium"}>
        {value}
      </dd>
    </div>
  )
}
