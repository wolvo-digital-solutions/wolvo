/**
 * Progressive loader + renderer for the supplied wolf → W frame sequence.
 *
 * Loading order is coarse-to-fine (every 16th frame, then 8th, 4th, 2nd, 1st),
 * so scrubbing is usable almost immediately and sharpens as frames arrive.
 * Drawing always falls back to the nearest loaded frame — never a blank canvas.
 */
export interface SequenceSet {
  base: string;
  count: number;
  width: number;
  height: number;
}

export const heroSets = {
  lg: { base: "/assets/video-frames/hero/lg", count: 240, width: 1600, height: 900 },
  sm: { base: "/assets/video-frames/hero/sm", count: 121, width: 900, height: 506 },
} satisfies Record<string, SequenceSet>;

const src = (set: SequenceSet, i: number) => `${set.base}/frame_${String(i + 1).padStart(4, "0")}.webp`;

export class FrameSequence {
  private images: (HTMLImageElement | null)[];
  private aborted = false;
  private ctx: CanvasRenderingContext2D | null = null;
  private lastDrawn = -1;
  /** Horizontal focal point for cover-cropping on narrow viewports (0–1). */
  focusX = 0.5;
  /**
   * 0 = cover-crop, 1 = fit the final W's width. Used on portrait screens so the
   * finished logo is never cropped (the W spans ~47% of the frame width).
   */
  zoomOut = 0;

  constructor(
    public set: SequenceSet,
    private onProgress?: (firstPass: number, all: number) => void,
    private onFrameReady?: (index: number) => void,
  ) {
    this.images = new Array(set.count).fill(null);
  }

  attach(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.lastDrawn = -1;
  }

  /** Coarse-to-fine order, with the first and last frames up front. */
  private order() {
    const n = this.set.count;
    const seen = new Set<number>([0, n - 1]);
    const out = [0, n - 1];
    for (const stride of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < n; i += stride) if (!seen.has(i)) (seen.add(i), out.push(i));
    }
    return { out, firstPass: Math.ceil(n / 16) + 1 };
  }

  async load(concurrency = 6) {
    const { out, firstPass } = this.order();
    let loaded = 0;
    let cursor = 0;
    const worker = async () => {
      while (!this.aborted && cursor < out.length) {
        const index = out[cursor++];
        const img = new Image();
        img.decoding = "async";
        img.src = src(this.set, index);
        try {
          await img.decode();
          if (this.aborted) return;
          this.images[index] = img;
          this.onFrameReady?.(index);
        } catch {
          // A missing frame is tolerated — the nearest loaded frame is drawn instead.
        }
        loaded++;
        this.onProgress?.(Math.min(1, loaded / firstPass), loaded / out.length);
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  private nearest(index: number) {
    if (this.images[index]) return index;
    for (let d = 1; d < this.set.count; d++) {
      if (this.images[index - d]) return index - d;
      if (this.images[index + d]) return index + d;
    }
    return -1;
  }

  /** Draw `progress` (0–1) with cover fit. Cheap no-op if the frame hasn't changed. */
  draw(progress: number, force = false) {
    const ctx = this.ctx;
    if (!ctx) return;
    const target = Math.round(progress * (this.set.count - 1));
    const i = this.nearest(target);
    const key = i * 2 + this.zoomOut; // unique per (frame, zoom)
    if (i < 0 || (!force && key === this.lastDrawn)) return;
    this.lastDrawn = key;
    const img = this.images[i]!;
    const { width: cw, height: ch } = ctx.canvas;
    const cover = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const subject = Math.min(cover, (0.94 * cw) / (0.47 * img.naturalWidth));
    const scale = cover + (subject - cover) * this.zoomOut;
    if (scale < cover) {
      ctx.fillStyle = "#030b1e";
      ctx.fillRect(0, 0, cw, ch);
    }
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (cw - w) * this.focusX;
    const y = (ch - h) / 2;
    ctx.drawImage(img, x, y, w, h);
    if (scale < cover) {
      // Feather the letterbox edges into the page background.
      const fade = h * 0.22;
      const top = ctx.createLinearGradient(0, y, 0, y + fade);
      top.addColorStop(0, "#030b1e");
      top.addColorStop(1, "rgba(3,11,30,0)");
      ctx.fillStyle = top;
      ctx.fillRect(0, y - 1, cw, fade + 1);
      const bottom = ctx.createLinearGradient(0, y + h - fade, 0, y + h);
      bottom.addColorStop(0, "rgba(3,11,30,0)");
      bottom.addColorStop(1, "#030b1e");
      ctx.fillStyle = bottom;
      ctx.fillRect(0, y + h - fade, cw, fade + 1);
    }
  }

  invalidate() {
    this.lastDrawn = -1;
  }

  dispose() {
    this.aborted = true;
    this.images.forEach((img) => img && (img.src = ""));
    this.images = [];
    this.ctx = null;
  }
}
