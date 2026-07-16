"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Search,
  Minus,
  Plus,
  BookOpenCheck,
  Download,
  Copy,
  Check,
  History,
  ArrowRight,
  ChevronRight,
  List,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { type Ley, type ArticuloLey } from "@/lib/leyes"
import { formatFecha } from "@/lib/data"
import { cn } from "@/lib/utils"

export function LeyLector({ ley }: { ley: Ley }) {
  const [query, setQuery] = useState("")
  const [irA, setIrA] = useState("")
  const [escala, setEscala] = useState(1) // 0.875 .. 1.5
  const [modoLectura, setModoLectura] = useState(false)
  const [indiceMovil, setIndiceMovil] = useState(false)
  const [copiado, setCopiado] = useState<string | null>(null)
  const [articuloHistorial, setArticuloHistorial] = useState<ArticuloLey | null>(null)

  const articulosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ley.articulos
    return ley.articulos.filter(
      (a) => a.texto.toLowerCase().includes(q) || a.numero.toLowerCase().includes(q),
    )
  }, [ley, query])

  const irAlArticulo = () => {
    const target = irA.trim().toLowerCase()
    if (!target) return
    const el = document.getElementById(`art-${target}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      el.classList.add("ring-2", "ring-primary")
      setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 1600)
    }
  }

  const copiarRef = async (a: ArticuloLey) => {
    const ref = `Artículo ${a.numero} de la ${ley.nombre}.`
    try {
      await navigator.clipboard.writeText(ref)
      setCopiado(a.numero)
      setTimeout(() => setCopiado(null), 1800)
    } catch {
      setCopiado(null)
    }
  }

  const fontPx = Math.round(16 * escala)

  const Indice = (
    <nav aria-label="Índice de la ley" className="text-sm">
      {ley.secciones.map((s) => (
        <div key={s.id} className="mb-3">
          <p className="font-serif text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {s.titulo}
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {s.capitulos.map((c) => (
              <li key={c.id}>
                <p className="px-2 py-1 text-xs text-muted-foreground">{c.titulo}</p>
                <ul>
                  {c.articulos.map((num) => (
                    <li key={num}>
                      <a
                        href={`#art-${num.toLowerCase()}`}
                        onClick={() => setIndiceMovil(false)}
                        className="flex items-center gap-1 rounded px-3 py-1 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <ChevronRight className="h-3 w-3" />
                        Artículo {num}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Barra de herramientas */}
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-4">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en el texto de la ley..."
            className="h-9 pl-9"
            aria-label="Buscar dentro del texto de la ley"
          />
        </div>
        <div className="flex items-center gap-1">
          <Input
            value={irA}
            onChange={(e) => setIrA(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && irAlArticulo()}
            placeholder="Ir al artículo"
            className="h-9 w-32"
            aria-label="Ir al artículo"
          />
          <Button variant="outline" size="sm" className="h-9" onClick={irAlArticulo}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setEscala((s) => Math.max(0.875, +(s - 0.125).toFixed(3)))}
            aria-label="Disminuir tamaño de letra"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-xs tabular-nums text-muted-foreground">
            {Math.round(escala * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setEscala((s) => Math.min(1.5, +(s + 0.125).toFixed(3)))}
            aria-label="Aumentar tamaño de letra"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant={modoLectura ? "default" : "outline"}
          size="sm"
          className="h-9"
          onClick={() => setModoLectura((m) => !m)}
        >
          <BookOpenCheck className="h-4 w-4" />
          Modo lectura
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 lg:hidden"
          onClick={() => setIndiceMovil(true)}
        >
          <List className="h-4 w-4" />
          Índice
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Índice lateral (desktop) */}
        {!modoLectura && (
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg border border-border bg-card p-4">
              {Indice}
            </div>
          </aside>
        )}

        {/* Texto de la ley */}
        <div className={cn("min-w-0 flex-1", modoLectura && "mx-auto max-w-3xl")}>
          {articulosFiltrados.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
              No se encontraron artículos que coincidan con la búsqueda.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {articulosFiltrados.map((a) => (
                <article
                  key={a.numero}
                  id={`art-${a.numero.toLowerCase()}`}
                  className="scroll-mt-24 rounded-lg border border-border bg-card p-5 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-semibold">Artículo {a.numero}</h3>
                      {a.reformas > 0 && (
                        <Badge variant="outline" className="bg-foreground/10 text-foreground border-foreground/25">
                          {a.reformas} {a.reformas === 1 ? "reforma" : "reformas"}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{a.capitulo}</span>
                  </div>

                  <p
                    className="mt-2 leading-relaxed text-foreground"
                    style={{ fontSize: `${fontPx}px`, lineHeight: 1.7 }}
                  >
                    {a.texto}
                  </p>

                  {!modoLectura && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => copiarRef(a)}>
                        {copiado === a.numero ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiado === a.numero ? "Copiada" : "Copiar referencia"}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        Descargar artículo
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setArticuloHistorial(a)}>
                        <History className="h-4 w-4" />
                        Ver historial del artículo
                      </Button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Índice móvil */}
      <Sheet open={indiceMovil} onOpenChange={setIndiceMovil}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="font-serif">Índice de la ley</SheetTitle>
            <SheetDescription>{ley.nombreCorto}</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">{Indice}</div>
        </SheetContent>
      </Sheet>

      {/* Historial del artículo */}
      <Sheet open={!!articuloHistorial} onOpenChange={(o) => !o && setArticuloHistorial(null)}>
        <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-md">
          {articuloHistorial && (
            <>
              <SheetHeader>
                <SheetTitle className="font-serif">
                  Historial del artículo {articuloHistorial.numero}
                </SheetTitle>
                <SheetDescription>{ley.nombreCorto}</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4 pb-6">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-md border border-border bg-card p-3">
                    <p className="text-muted-foreground">Publicación original</p>
                    <p className="mt-0.5 font-medium">
                      {formatFecha(articuloHistorial.versiones[0]?.fecha ?? ley.fechaPublicacionOriginal)}
                    </p>
                  </div>
                  <div className="rounded-md border border-border bg-card p-3">
                    <p className="text-muted-foreground">Última reforma</p>
                    <p className="mt-0.5 font-medium">
                      {articuloHistorial.ultimaReforma
                        ? formatFecha(articuloHistorial.ultimaReforma)
                        : "Sin reformas"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Versiones del artículo
                  </p>
                  <ol className="mt-2 flex flex-col gap-3">
                    {articuloHistorial.versiones.map((v, i) => {
                      const esVigente = i === articuloHistorial.versiones.length - 1
                      return (
                        <li
                          key={i}
                          className={cn(
                            "rounded-lg border bg-card p-3",
                            esVigente ? "border-primary/40" : "border-border",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              variant="outline"
                              className={
                                esVigente
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : ""
                              }
                            >
                              {v.etiqueta}
                            </Badge>
                            <time className="text-[11px] text-muted-foreground">
                              {formatFecha(v.fecha)}
                            </time>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed">{v.texto}</p>
                          <p className="mt-1.5 text-[11px] text-muted-foreground">
                            {v.numeroPeriodico}
                          </p>
                        </li>
                      )
                    })}
                  </ol>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    render={<Link href={`/leyes/${ley.id}?tab=comparar`} />}
                    size="sm"
                    variant="outline"
                  >
                    <History className="h-4 w-4" />
                    Comparar cambios
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
