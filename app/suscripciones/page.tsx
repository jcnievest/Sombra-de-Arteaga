"use client"

import { useState } from "react"
import {
  BellRing,
  Mail,
  Check,
  CalendarDays,
  Building2,
  Scale,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { dependencias, tiposActo } from "@/lib/data"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const frecuencias = [
  { id: "diaria", label: "Cada edición", desc: "Recibe un aviso cada vez que se publica una nueva edición." },
  { id: "semanal", label: "Resumen semanal", desc: "Un solo correo con las publicaciones de la semana." },
  { id: "tema", label: "Solo mis temas", desc: "Únicamente cuando se publique algo de tu interés." },
]

const beneficios = [
  { icon: CalendarDays, titulo: "Avisos de nuevas ediciones", desc: "Notificación al publicarse cada número del Periódico Oficial." },
  { icon: Building2, titulo: "Por dependencia", desc: "Sigue las publicaciones de las dependencias que te interesan." },
  { icon: Scale, titulo: "Reformas a leyes", desc: "Entérate cuando una ley vigente sea reformada o adicionada." },
  { icon: FileText, titulo: "Por tipo de acto", desc: "Decretos, acuerdos, convocatorias, avisos y más." },
]

export default function SuscripcionesPage() {
  const [correo, setCorreo] = useState("")
  const [frecuencia, setFrecuencia] = useState("diaria")
  const [temas, setTemas] = useState<string[]>([])

  function toggleTema(t: string) {
    setTemas((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    )
  }

  function suscribir(e: React.FormEvent) {
    e.preventDefault()
    if (!correo) {
      toast.error("Ingresa un correo electrónico válido.")
      return
    }
    toast.success("Suscripción registrada", {
      description: `Enviaremos los avisos a ${correo}.`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Badge className="mb-3 bg-secondary text-secondary-foreground">
            <BellRing className="h-3.5 w-3.5" />
            Alertas del Periódico Oficial
          </Badge>
          <h1 className="font-serif text-3xl font-semibold text-balance">
            Suscripciones
          </h1>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Recibe en tu correo un aviso cuando se publiquen nuevas ediciones o
            documentos de tu interés en La Sombra de Arteaga. El servicio
            es gratuito y puedes cancelarlo en cualquier momento.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <Mail className="h-5 w-5 text-primary" />
                Configura tu suscripción
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={suscribir} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="correo">Correo electrónico</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Frecuencia de avisos</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {frecuencias.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFrecuencia(f.id)}
                        className={cn(
                          "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                          frecuencia === f.id
                            ? "border-primary bg-secondary/50"
                            : "border-border hover:bg-secondary/30",
                        )}
                      >
                        <span className="flex items-center justify-between text-sm font-medium">
                          {f.label}
                          {frecuencia === f.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </span>
                        <span className="text-xs leading-snug text-muted-foreground">
                          {f.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Temas de interés (opcional)</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {[...tiposActo, ...dependencias].map((t) => (
                      <Badge
                        key={t}
                        render={
                          <button type="button" onClick={() => toggleTema(t)}>
                            {t}
                          </button>
                        }
                        variant={temas.includes(t) ? "default" : "outline"}
                        className="cursor-pointer"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Si no eliges temas, recibirás avisos de todas las
                    publicaciones según la frecuencia seleccionada.
                  </p>
                </div>

                <Button type="submit" className="sm:w-fit">
                  <BellRing className="h-4 w-4" />
                  Suscribirme
                </Button>
              </form>
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-3">
            {beneficios.map((b) => (
              <Card key={b.titulo}>
                <CardContent className="flex gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <b.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{b.titulo}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {b.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
