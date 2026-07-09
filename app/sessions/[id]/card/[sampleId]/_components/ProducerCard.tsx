"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { t, type Lang } from "@/lib/i18n";
import { RADAR_KEYS, type SampleResult } from "@/lib/results";

const ORANGE = "#e85d24";
const INK = "#0a0a0a";
const GREY = "#9ca3af";
const LINE = "#e5e7eb";
const W = 1080;
const H = 1400;

type Props = {
  lang: Lang;
  sessionTitle: string;
  sessionId: string;
  dateLabel: string;
  result: SampleResult;
};

function clip(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export function ProducerCard({
  lang,
  sessionTitle,
  sessionId,
  dateLabel,
  result,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [busy, setBusy] = useState(false);

  function exportPng() {
    const svg = svgRef.current;
    if (!svg) return;
    setBusy(true);
    const xml = new XMLSerializer().serializeToString(svg);
    const src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(xml)));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.drawImage(img, 0, 0, W, H);
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${clip(result.coffee.producerName, 30)}-${result.blindCode}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
        setBusy(false);
      }, "image/png");
    };
    img.onerror = () => setBusy(false);
    img.src = src;
  }

  // ── Radar geometry ─────────────────────────────────────────────────────
  const cx = W / 2;
  const cy = 870;
  const R = 230;
  const n = RADAR_KEYS.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const point = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });
  const valuePts = RADAR_KEYS.map((k, i) => {
    const v = result.radar[k] ?? 0;
    return point(i, R * (v / 9));
  });
  const polygon = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const rings = [0.33, 0.66, 1].map((f) =>
    polygon(RADAR_KEYS.map((_, i) => point(i, R * f))),
  );

  const meta = [
    result.coffee.finca,
    result.coffee.region,
    result.coffee.altitude ? `${result.coffee.altitude} msnm` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const varietyProcess = [
    result.coffee.varieties.join(", ") || null,
    result.coffee.process,
  ]
    .filter(Boolean)
    .join(" · ");
  const descriptors = clip(
    result.topDescriptors.map((d) => d.label).join(" · "),
    70,
  );

  return (
    <main className="mx-auto max-w-xl px-6 pb-24 pt-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`/sessions/${sessionId}/reveal`}
          className="text-xs text-neutral-500 hover:text-neutral-900"
        >
          ← {t("reveal.title", lang)}
        </Link>
        <button
          type="button"
          onClick={exportPng}
          disabled={busy}
          className="rounded-md bg-origen-orange px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? t("common.saving", lang) : t("card.export", lang)}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
        >
          <rect width={W} height={H} fill="#ffffff" />

          {/* Wordmark */}
          <text x={80} y={110} fontSize={28} letterSpacing={6} fill={GREY}>
            {t("app.name", lang).toUpperCase()}
          </text>
          <line x1={80} y1={140} x2={W - 80} y2={140} stroke={LINE} strokeWidth={2} />

          {/* Identity */}
          <text x={80} y={230} fontSize={62} fontWeight={600} fill={INK}>
            {clip(result.coffee.producerName, 26)}
          </text>
          {meta && (
            <text x={80} y={285} fontSize={32} fill={GREY}>
              {clip(meta, 48)}
            </text>
          )}
          {varietyProcess && (
            <text x={80} y={330} fontSize={30} fill={GREY}>
              {clip(varietyProcess, 50)}
            </text>
          )}

          {/* FNC grade badge */}
          {result.fncGrade && (
            <>
              <rect
                x={80}
                y={360}
                width={260}
                height={56}
                rx={28}
                fill="#f5f5f5"
              />
              <text x={210} y={397} fontSize={28} fill={INK} textAnchor="middle">
                FNC · {result.fncGrade}
              </text>
            </>
          )}

          {/* Score */}
          <text
            x={cx}
            y={540}
            fontSize={210}
            fontWeight={700}
            fill={ORANGE}
            textAnchor="middle"
          >
            {result.mean === null ? "–" : result.mean.toFixed(2)}
          </text>
          <text x={cx} y={590} fontSize={30} fill={GREY} textAnchor="middle">
            {result.mean === null
              ? t("reveal.no_scores", lang)
              : `/ 100 · ${t("card.panel", lang, { count: result.cupperCount })}`}
          </text>

          {/* Radar */}
          {rings.map((r, i) => (
            <polygon
              key={i}
              points={r}
              fill="none"
              stroke={LINE}
              strokeWidth={2}
            />
          ))}
          {RADAR_KEYS.map((_, i) => {
            const p = point(i, R);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke={LINE}
                strokeWidth={1.5}
              />
            );
          })}
          <polygon
            points={polygon(valuePts)}
            fill={ORANGE}
            fillOpacity={0.18}
            stroke={ORANGE}
            strokeWidth={3}
          />
          {RADAR_KEYS.map((k, i) => {
            const p = point(i, R + 46);
            const anchor =
              p.x > cx + 5 ? "start" : p.x < cx - 5 ? "end" : "middle";
            return (
              <text
                key={k}
                x={p.x}
                y={p.y + 8}
                fontSize={26}
                fill={GREY}
                textAnchor={anchor}
              >
                {t(`affective.hedonic.${k}`, lang)}
              </text>
            );
          })}

          {/* Descriptors */}
          {descriptors && (
            <>
              <text
                x={cx}
                y={1230}
                fontSize={24}
                letterSpacing={3}
                fill={GREY}
                textAnchor="middle"
              >
                {t("card.descriptors", lang).toUpperCase()}
              </text>
              <text
                x={cx}
                y={1278}
                fontSize={32}
                fill={INK}
                textAnchor="middle"
              >
                {descriptors}
              </text>
            </>
          )}

          {/* Footer */}
          <line
            x1={80}
            y1={1330}
            x2={W - 80}
            y2={1330}
            stroke={LINE}
            strokeWidth={2}
          />
          <text x={80} y={1372} fontSize={26} fill={GREY}>
            {clip(sessionTitle, 36)}
          </text>
          <text x={W - 80} y={1372} fontSize={26} fill={GREY} textAnchor="end">
            {dateLabel}
          </text>
        </svg>
      </div>
    </main>
  );
}
