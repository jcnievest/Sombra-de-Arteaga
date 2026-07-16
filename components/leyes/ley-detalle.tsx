"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Download,
  BookOpen,
  History,
  GitCompare,
  ShieldCheck,
  Copy,
  Check,
  Clock3,
  Layers,
  Newspaper,
  Hash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerificacionLey } from "@/components/leyes/verificacion-ley"
import { HistorialReformas } from "@/components/leyes/historial-reformas"
import { LineaTiempo } from "@/components/leyes/linea-tiempo"
import { ComparadorVersiones } from "@/components/leyes/comparador-versiones"
import {
  type Ley,
  materiaColor,
  estatusLeyColor,
} from "@/lib/leyes"
import { formatFecha } from "@/lib/data"

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-border bg-card p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

export function LeyDetalle({ ley, tabInicial }: { ley: Ley; tabInicial?: string }) {
  const [copiado, setCopiado] = useState(false)
  const tabValido = ["general", "reformas", "timeline", "comparar"].includes(tabInicial ?? "")
    ? (tabInicial as string)
    : "general"

  const cita = `${ley.nombre}, publicada en el Periódico Oficial del Gobierno del Estado de Querétaro "La Sombra de Arteaga" ${ley.numeroPeriodicoOriginal}, ${formatFecha(ley.fechaPublicacionOriginal)}. Última reforma: ${formatFecha(ley.fechaUltimaReforma)}.`

  const copiarCita = async () => {
    try {
      await navigator.clipboard.writeText(cita)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado de la ficha */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={materiaColor(ley.materia)}>
            {ley.materia}
          </Badge>
          <Badge variant="outline" className={estatusLeyColor(ley.estatus)}>
            {ley.estatus}
          </Badge>
        </div>
        <h1 className="text-balance font-serif text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {ley.nombre}
        </h1>
        <p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">{ley.resumen}</p>

        {/* Acciones principales */}
        <div className="flex flex-wrap gap-2">
          <Button>
            <Download className="h-4 w-4" />
            Descargar versión vigente
          </Button>
          <Button render={<Link href={`/leyes/${ley.id}/leer`} />} variant="outline">
            <BookOpen className="h-4 w-4" />
            Leer ley en línea
          </Button>
          <Button variant="outline" onClick={copiarCita}>
            {copiado ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            {copiado ? "Cita copiada" : "Copiar cita oficial"}
          </Button>
          <Button render={<Link href="/verificar" />} variant="ghost">
            <ShieldCheck className="h-4 w-4" />
            Validar autenticidad
          </Button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat icon={Newspaper} label="Publicación original" value={formatFecha(ley.fechaPublicacionOriginal)} />
        <Stat icon={Hash} label="Periódico original" value={ley.numeroPeriodicoOriginal} />
        <Stat icon={Clock3} label="Última reforma" value={formatFecha(ley.fechaUltimaReforma)} />
        <Stat icon={History} label="Reformas registradas" value={`${ley.numeroReformas}`} />
        <Stat icon={Layers} label="Consultas" value={ley.consultas.toLocaleString("es-MX")} />
      </div>

      {/* Pestañas */}
      <Tabs defaultValue={tabValido} className="gap-4">
        <TabsList variant="line" className="flex w-full flex-wrap justify-start gap-1 border-b border-border">
          <TabsTrigger value="general">
            <ShieldCheck className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="reformas">
            <History className="h-4 w-4" />
            Historial de reformas
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock3 className="h-4 w-4" />
            Línea del tiempo
          </TabsTrigger>
          <TabsTrigger value="comparar">
            <GitCompare className="h-4 w-4" />
            Comparar versiones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-2">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <VerificacionLey
                hash={ley.hash}
                selloTiempo={ley.selloTiempo}
                fechaUltimaReforma={ley.fechaUltimaReforma}
                qrValue={`https://lasombradearteaga.qro.gob.mx/verificar/ley/${ley.id}`}
              />
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-serif text-sm font-semibold">Estructura del ordenamiento</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {ley.secciones.map((s) => (
                    <li key={s.id}>
                      <p className="font-medium">{s.titulo}</p>
                      <ul className="mt-1 space-y-0.5 pl-3 text-xs text-muted-foreground">
                        {s.capitulos.map((c) => (
                          <li key={c.id}>
                            {c.titulo} · {c.articulos.length} art.
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                <Button
                  render={<Link href={`/leyes/${ley.id}/leer`} />}
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                >
                  <BookOpen className="h-4 w-4" />
                  Abrir lectura accesible
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reformas" className="mt-2">
          <HistorialReformas ley={ley} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-2">
          <LineaTiempo ley={ley} />
        </TabsContent>

        <TabsContent value="comparar" className="mt-2">
          <ComparadorVersiones ley={ley} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
