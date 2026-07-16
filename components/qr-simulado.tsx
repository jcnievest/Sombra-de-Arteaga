interface QrSimuladoProps {
  value: string
  size?: number
  className?: string
}

// QR simulado determinístico a partir de un valor (solo para prototipo)
export function QrSimulado({ value, size = 140, className }: QrSimuladoProps) {
  const cells = 21
  // Generar patrón pseudo-aleatorio determinístico
  let seed = 0
  for (let i = 0; i < value.length; i++) {
    seed = (seed * 31 + value.charCodeAt(i)) >>> 0
  }
  const rng = (n: number) => {
    seed = (seed * 1103515245 + 12345) >>> 0
    return seed % n
  }
  const grid: boolean[][] = Array.from({ length: cells }, () =>
    Array.from({ length: cells }, () => rng(100) > 52),
  )

  // Marcadores de posición (esquinas)
  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        grid[r0 + r][c0 + c] = edge || inner
      }
    }
  }
  drawFinder(0, 0)
  drawFinder(0, cells - 7)
  drawFinder(cells - 7, 0)

  const cell = size / cells

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="Código QR de verificación"
    >
      <rect width={size} height={size} fill="white" />
      {grid.map((row, r) =>
        row.map(
          (on, c) =>
            on && (
              <rect
                key={`${r}-${c}`}
                x={c * cell}
                y={r * cell}
                width={cell}
                height={cell}
                fill="oklch(0.22 0.015 250)"
              />
            ),
        ),
      )}
    </svg>
  )
}
