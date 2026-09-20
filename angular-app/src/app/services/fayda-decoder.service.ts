import { Injectable } from '@angular/core';

/** Identity fields carried by the Fayda card QR (subset we use). */
export interface FaydaFields {
  full_name?: string | null;
  gender?: string | null;
  fan?: string | null;
  date_of_birth?: string | null;
  face?: { format?: string; base64?: string } | null;
}

/** Result shape returned by the `fayda-decoder` library. */
export interface FaydaDecodeResult {
  ok: boolean;
  fields?: FaydaFields;
  signature?: { present?: boolean; verified?: boolean | null; jws?: string } | null;
  raw?: { payload?: string; map?: Record<string, string> } | null;
  error?: { code?: string };
}

/**
 * Thin wrapper around the open-source `fayda-decoder` package
 * (https://github.com/Alpha-mintamir/fayda-decoder).
 *
 * The library — and its `zxing-wasm` QR engine — is **dynamically imported** the first time a
 * user actually scans a card, so it never lands in the initial bundle. That keeps the public
 * pages light for low-bandwidth users; the ~WASM engine only downloads on demand.
 *
 * All decoding happens on-device: the card image and QR payload never leave the browser.
 */
@Injectable({ providedIn: 'root' })
export class FaydaDecoderService {
  private mod?: Promise<any>;
  private verifyMod?: Promise<any>;

  private load(): Promise<any> {
    return (this.mod ??= import('fayda-decoder'));
  }

  private loadVerify(): Promise<any> {
    return (this.verifyMod ??= import('fayda-decoder/verify'));
  }

  /** Decode a raw QR payload string (e.g. pasted from a scanner). */
  async decodeQrText(text: string): Promise<FaydaDecodeResult> {
    const mod = await this.load();
    return mod.decodePayload(text) as FaydaDecodeResult;
  }

  /** Decode a photo of the card by rasterising it to pixels and reading the QR locally. */
  async decodeImageFile(file: File): Promise<FaydaDecodeResult> {
    const { data, width, height } = await this.readPixels(file);
    const mod = await this.load();
    return mod.decodeImageData({ data, width, height }) as FaydaDecodeResult;
  }

  /**
   * Verify the card's detached JWS signature against the pinned NIDP key. Returns `false` on
   * any failure so a decode success without a valid signature still routes to manual review.
   */
  async verifySignature(decoded: FaydaDecodeResult): Promise<boolean> {
    try {
      const mod = await this.loadVerify();
      const res = await mod.verifySignature(decoded);
      return !!res?.verified;
    } catch {
      return false;
    }
  }

  /** Draw the image onto a canvas and pull raw RGBA pixels for the decoder. */
  private async readPixels(file: File): Promise<ImageData> {
    const bitmap = await createImageBitmap(file);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context unavailable');
      }
      ctx.drawImage(bitmap, 0, 0);
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    } finally {
      bitmap.close();
    }
  }
}
