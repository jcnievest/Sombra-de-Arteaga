"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HashVerificable({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false)
  const abbreviated = `${hash.slice(0, 10)}…${hash.slice(-8)}`

  const copyHash = async () => {
    await navigator.clipboard.writeText(hash)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-2 rounded-md border border-border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">Hash SHA-256</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <code className="min-w-0 truncate font-mono text-xs text-foreground" title={hash}>
          {abbreviated}
        </code>
        <Button type="button" variant="ghost" size="sm" onClick={copyHash} className="shrink-0">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiado" : "Copiar"}
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">{copied ? "Hash copiado al portapapeles" : ""}</p>
    </div>
  )
}
