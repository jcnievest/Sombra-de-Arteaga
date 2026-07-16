"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Inbox,
  FilePlus2,
  BookCheck,
  BadgeCheck,
  CreditCard,
  ExternalLink,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { InternalAuthGate, SESSION_KEY } from "@/components/internal-auth-gate"

const items = [
  { href: "/interno", label: "Tablero", icon: LayoutDashboard },
  {
    href: "/interno/solicitudes",
    label: "Bandeja de solicitudes",
    icon: Inbox,
  },
  {
    href: "/interno/pagos",
    label: "Validación de pagos",
    icon: CreditCard,
  },
  {
    href: "/interno/nueva",
    label: "Carga institucional directa",
    icon: FilePlus2,
  },
  { href: "/interno/edicion", label: "Cierre de edición", icon: BookCheck },
  { href: "/interno/publicacion", label: "Publicación oficial", icon: BadgeCheck },
]

export function InternalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const cerrarSesion = () => {
    sessionStorage.removeItem(SESSION_KEY)
    window.location.href = "/interno"
  }

  return (
    <InternalAuthGate>
      <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2 py-3">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-sidebar-border bg-card">
              <Image
                src="/escudo-queretaro.jpg"
                alt="Escudo del Poder Ejecutivo del Estado de Querétaro"
                width={56}
                height={56}
                className="h-8 w-8 object-contain object-top"
              />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-sm font-semibold text-sidebar-foreground">
                La Sombra de Arteaga
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                Portal institucional
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Gestión de publicaciones</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active =
                    item.href === "/interno"
                      ? pathname === "/interno"
                      : pathname.startsWith(item.href)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        }
                        isActive={active}
                      />
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Acceso público</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link href="/">
                        <ExternalLink className="h-4 w-4" />
                        <span>Ir al portal ciudadano</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-3 rounded-md p-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-accent text-xs text-sidebar-accent-foreground">
                MR
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-sidebar-foreground">
                M. Fernanda Reyes
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                Secretaría de Gobierno
              </span>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={cerrarSesion}>
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <span className="text-sm font-medium">Periódico Oficial del Estado de Querétaro</span>
          <Badge variant="outline" className="ml-auto gap-1.5 border-border bg-muted text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
            Sesión segura
          </Badge>
        </header>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
    </InternalAuthGate>
  )
}
