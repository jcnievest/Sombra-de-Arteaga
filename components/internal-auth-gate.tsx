"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ShieldCheck,
  KeyRound,
  Loader2,
  Lock,
  ArrowLeft,
  FileKey2,
  BadgeCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const SESSION_KEY = "lsa-interno-sesion"

type Fase = "credenciales" | "validando" | "autenticado"

export function InternalAuthGate({ children }: { children: React.ReactNode }) {
  const [autenticado, setAutenticado] = useState<boolean | null>(null)
  const [fase, setFase] = useState<Fase>("credenciales")
  const [p12Nombre, setP12Nombre] = useState<string | null>(null)
  const [pin, setPin] = useState("")

  useEffect(() => {
    setAutenticado(
      typeof window !== "undefined" &&
        sessionStorage.getItem(SESSION_KEY) === "activa",
    )
  }, [])

  const puedeAcceder = !!p12Nombre && pin.length >= 4

  const iniciarSesion = () => {
    setFase("validando")
    setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "activa")
      setFase("autenticado")
      setTimeout(() => setAutenticado(true), 700)
    }, 2200)
  }

  // Mientras se resuelve el estado inicial, evita parpadeo del contenido.
  if (autenticado === null) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/30">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (autenticado) return <>{children}</>

  return (
    <main className="flex min-h-svh flex-col bg-muted/30">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Portal ciudadano
            </Link>
          }
        />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
                <Image
                  src="/escudo-queretaro.jpg"
                  alt="Escudo del Poder Ejecutivo del Estado de Querétaro"
                  width={96}
                  height={96}
                  className="h-14 w-14 object-contain object-top"
                  priority
                />
              </span>
              <h1 className="mt-4 text-pretty font-serif text-xl font-semibold">
                Portal institucional
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                La Sombra de Arteaga · Periódico Oficial del Estado de
                Querétaro
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-md border border-foreground/15 bg-secondary/40 px-3 py-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Inicio de sesión con qFirma
            </div>

            {fase === "credenciales" && (
              <form
                className="mt-6 flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (puedeAcceder) iniciarSesion()
                }}
              >
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Autentíquese con su Firma Electrónica Avanzada (qFirma). El
                  acceso queda vinculado al certificado del servidor público y a
                  su dependencia.
                </p>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="p12">Archivo qFirma (.p12)</Label>
                  <label
                    htmlFor="p12"
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border bg-muted/30 px-3 py-3 text-sm transition-colors hover:bg-muted/50",
                      p12Nombre && "border-solid border-primary/40 bg-secondary/40",
                    )}
                  >
                    <FileKey2 className="h-5 w-5 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 truncate">
                      {p12Nombre ?? "Seleccionar archivo .p12"}
                    </span>
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">
                      Examinar
                    </span>
                    <input
                      id="p12"
                      type="file"
                      accept=".p12,.pfx"
                      className="sr-only"
                      onChange={(e) =>
                        setP12Nombre(e.target.files?.[0]?.name ?? null)
                      }
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="pin">Contraseña de la qFirma</Label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="pin"
                      type="password"
                      className="pl-9"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button type="submit" className="mt-1 w-full" disabled={!puedeAcceder}>
                  <Lock className="h-4 w-4" />
                  Ingresar con qFirma
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Prototipo demostrativo. No se transmiten archivos ni
                  credenciales reales.
                </p>
              </form>
            )}

            {fase === "validando" && (
              <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-medium">Validando qFirma…</p>
                <p className="text-sm text-muted-foreground">
                  Verificando vigencia del certificado y firma de
                  autenticación.
                </p>
              </div>
            )}

            {fase === "autenticado" && (
              <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
                <BadgeCheck className="h-12 w-12 text-foreground" />
                <p className="font-serif text-lg font-semibold">
                  Acceso autorizado
                </p>
                <Separator />
                <div className="w-full rounded-md border border-border bg-muted/40 p-3 text-left">
                  <p className="text-xs text-muted-foreground">Servidor público</p>
                  <p className="text-sm font-medium">
                    Lic. María Fernanda Reyes Olvera
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">Dependencia</p>
                  <p className="text-sm font-medium">Secretaría de Gobierno</p>
                </div>
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            ¿Necesita publicar como particular o dependencia?{" "}
            <Link href="/solicitar" className="font-medium text-foreground underline-offset-2 hover:underline">
              Solicitar publicación
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export { SESSION_KEY }
