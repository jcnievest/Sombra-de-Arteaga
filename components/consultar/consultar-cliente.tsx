"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, CalendarDays, Newspaper, ListOrdered, Info } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CalendarioCliente } from "@/components/calendario/calendario-cliente"
import { BusquedaAvanzada } from "@/components/consultar/busqueda-avanzada"
import { EdicionesPeriodico } from "@/components/consultar/ediciones-periodico"
import { IndicePublicaciones } from "@/components/consultar/indice-publicaciones"

const pestanas = [
  { value: "busqueda", label: "Búsqueda avanzada", icon: Search },
  { value: "calendario", label: "Calendario de publicaciones", icon: CalendarDays },
  { value: "ediciones", label: "Ediciones del Periódico Oficial", icon: Newspaper },
  { value: "indice", label: "Índice de publicaciones", icon: ListOrdered },
]

export function ConsultarCliente() {
  const searchParams = useSearchParams()
  const qInicial = searchParams.get("q") ?? ""
  const [tab, setTab] = useState(qInicial ? "busqueda" : "busqueda")

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as string)} className="gap-6">
      <div className="overflow-x-auto">
        <TabsList variant="line" className="h-auto flex-nowrap gap-1 p-0">
          {pestanas.map((p) => (
            <TabsTrigger
              key={p.value}
              value={p.value}
              className="h-auto whitespace-nowrap px-3 py-2"
            >
              <p.icon className="h-4 w-4" />
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="busqueda">
        <BusquedaAvanzada qInicial={qInicial} />
      </TabsContent>

      <TabsContent value="calendario">
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            El calendario no es otro buscador: es una forma visual de consultar
            las publicaciones por año, mes y día. Selecciona una fecha con
            edición para ver el detalle del Periódico Oficial.
          </p>
        </div>
        <CalendarioCliente mostrarBusqueda={false} />
      </TabsContent>

      <TabsContent value="ediciones">
        <EdicionesPeriodico />
      </TabsContent>

      <TabsContent value="indice">
        <IndicePublicaciones />
      </TabsContent>
    </Tabs>
  )
}
