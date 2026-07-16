"use client"

import { useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Building2,
  HelpCircle,
} from "lucide-react"
import { toast } from "sonner"
import { PublicHeader, PublicFooter } from "@/components/public-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const asuntos = [
  "Solicitud de publicación",
  "Pago y línea de captura",
  "Verificación de documentos",
  "Suscripciones y avisos",
  "Consulta de leyes vigentes",
  "Soporte técnico del portal",
  "Otro",
]

const datos = [
  { icon: MapPin, titulo: "Domicilio", valor: "Av. Luis Pasteur Sur 33, Centro Histórico, 76000 Santiago de Querétaro, Qro." },
  { icon: Phone, titulo: "Teléfono", valor: "442 238 5000 ext. 5021" },
  { icon: Mail, titulo: "Correo", valor: "periodicooficial@queretaro.gob.mx" },
  { icon: Clock, titulo: "Horario de atención", valor: "Lunes a viernes de 9:00 a 15:00 h" },
]

export default function ContactoPage() {
  const [enviado, setEnviado] = useState(false)

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    setEnviado(true)
    toast.success("Mensaje enviado", {
      description: "Te responderemos al correo proporcionado.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-semibold text-balance">
            Contacto
          </h1>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            ¿Tienes dudas sobre una publicación, un pago o el uso del portal?
            Escríbenos y la Dirección del Periódico Oficial te atenderá.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <Send className="h-5 w-5 text-primary" />
                Envíanos un mensaje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={enviar} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input id="nombre" placeholder="Nombre y apellidos" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="correo">Correo electrónico</Label>
                    <Input
                      id="correo"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="tel">Teléfono (opcional)</Label>
                    <Input id="tel" placeholder="442 000 0000" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="asunto">Asunto</Label>
                    <Select>
                      <SelectTrigger id="asunto" className="w-full">
                        <SelectValue placeholder="Selecciona…" />
                      </SelectTrigger>
                      <SelectContent>
                        {asuntos.map((a) => (
                          <SelectItem key={a} value={a}>
                            {a}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="mensaje">Mensaje</Label>
                  <Textarea
                    id="mensaje"
                    rows={5}
                    placeholder="Describe tu consulta o solicitud…"
                    required
                  />
                </div>

                <Button type="submit" className="sm:w-fit" disabled={enviado}>
                  <Send className="h-4 w-4" />
                  {enviado ? "Mensaje enviado" : "Enviar mensaje"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Datos de contacto */}
          <aside className="flex flex-col gap-4">
            <Card>
              <CardContent className="flex flex-col gap-4 p-5">
                <p className="flex items-center gap-2 font-medium">
                  <Building2 className="h-4 w-4 text-primary" />
                  Dirección del Periódico Oficial
                </p>
                {datos.map((d) => (
                  <div key={d.titulo} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground">
                      <d.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground">{d.titulo}</p>
                      <p className="text-pretty text-sm leading-snug">
                        {d.valor}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-accent-foreground/15 bg-accent/40">
              <CardContent className="flex flex-col gap-2 p-5">
                <HelpCircle className="h-5 w-5 text-accent-foreground" />
                <p className="font-medium text-accent-foreground">
                  ¿Vas a solicitar una publicación?
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Si tu consulta es para publicar un documento, puedes iniciar
                  directamente desde la ventanilla ciudadana en la sección
                  Solicitar publicación.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
