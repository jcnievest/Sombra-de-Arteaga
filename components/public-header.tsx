"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Building2, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/consultar", label: "Consultar publicaciones" },
  { href: "/leyes", label: "Leyes vigentes" },
  { href: "/solicitar", label: "Solicitar publicación" },
  { href: "/verificar", label: "Verificar documento" },
  { href: "/suscripciones", label: "Suscripciones" },
  { href: "/contacto", label: "Contacto" },
]

const desktopNav = nav.filter((item) =>
  ["/", "/consultar", "/leyes", "/solicitar", "/verificar"].includes(item.href),
)

export function PublicHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-border bg-card">
            <Image
              src="/escudo-queretaro.jpg"
              alt="Escudo del Poder Ejecutivo del Estado de Querétaro"
              width={64}
              height={64}
              className="h-10 w-10 object-contain object-top"
              priority
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold text-foreground">
              La Sombra de Arteaga
            </span>
            <span className="text-xs text-muted-foreground">
              Periódico Oficial del Estado de Querétaro
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 2xl:flex">
          <nav className="flex items-center gap-1">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <Button
            render={<Link href="/interno" />}
            variant="outline"
            size="sm"
            className="ml-1"
          >
            <Building2 className="h-4 w-4" />
            Portal institucional
          </Button>
        </div>

        <div className="hidden items-center gap-2 lg:flex 2xl:hidden">
          <nav aria-label="Navegación principal" className="flex items-center gap-1">
            {desktopNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {item.label
                    .replace(" publicaciones", "")
                    .replace(" publicación", "")
                    .replace(" documento", "")}
                </Link>
              )
            })}
          </nav>
          <Button
            render={<Link href="/interno" />}
            variant="outline"
            size="sm"
            className="ml-1"
          >
            <Building2 className="h-4 w-4" />
            Portal
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-principal"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <nav
          id="menu-principal"
          aria-label="Navegación principal"
          className="flex max-h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto border-t border-border px-4 py-3 lg:hidden"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={
                item.href === "/"
                  ? pathname === "/" ? "page" : undefined
                  : pathname.startsWith(item.href) ? "page" : undefined
              }
              className={cn(
                "rounded-md px-3 py-2.5 text-sm font-medium",
                (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/interno"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <Building2 className="h-4 w-4" />
            Portal institucional
          </Link>
        </nav>
      )}
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/escudo-queretaro.jpg"
            alt="Escudo del Poder Ejecutivo del Estado de Querétaro"
            width={48}
            height={48}
            className="h-7 w-7 object-contain object-top"
          />
          <span className="font-serif text-sm font-semibold">
            La Sombra de Arteaga
          </span>
        </div>
        <p className="max-w-2xl text-pretty text-xs leading-relaxed text-muted-foreground">
          Periódico Oficial del Gobierno del Estado de Querétaro. Todas las
          publicaciones cuentan con qFirma / Firma Electrónica Avanzada y son
          verificables mediante folio, hash SHA-256 o código QR. Prototipo
          institucional con fines demostrativos.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Gobierno del Estado de Querétaro ·
          Secretaría de Gobierno
        </p>
      </div>
    </footer>
  )
}
