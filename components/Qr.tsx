import qrcode from 'qrcode-generator';

/** A code a phone camera reads as an address. Drawn as one path, so it prints sharp at any size. */
export function Qr({ text, label }: { text: string; label: string }) {
  const code = qrcode(0, 'M');
  code.addData(text);
  code.make();
  const size = code.getModuleCount();
  let path = '';
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      if (code.isDark(row, column)) path += `M${column} ${row}h1v1h-1z`;
    }
  }
  // the quiet border a reader needs around the code is part of the drawing
  return (
    <svg className="qr" viewBox={`-3 -3 ${size + 6} ${size + 6}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect x={-3} y={-3} width={size + 6} height={size + 6} fill="var(--sheet)" />
      <path d={path} fill="var(--sheet-ink)" />
    </svg>
  );
}
