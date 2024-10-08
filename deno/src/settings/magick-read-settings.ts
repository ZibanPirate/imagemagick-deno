// Copyright Dirk Lemstra https://github.com/dlemstra/magick-wasm.
// Licensed under the Apache License, Version 2.0.
import { Disposable } from "../internal/disposable.ts";
import { ImageMagick } from "../image-magick.ts";
import { MagickSettings } from "./magick-settings.ts";
import { NativeMagickSettings } from "./native-magick-settings.ts";
import { _withString } from "../internal/native/string.ts";

export class MagickReadSettings extends MagickSettings {
  constructor(partialSettings?: Partial<MagickReadSettings>) {
    super();

    Object.assign(this, partialSettings);
  }

  height?: number;

  width?: number;

  /** @internal */
  _use<TReturnType>(
    func: (settings: NativeMagickSettings) => TReturnType,
  ): TReturnType {
    const settings = new NativeMagickSettings(this);

    const size = this.getSize();
    if (size !== "") {
      _withString(size, (sizePtr) => {
        ImageMagick._api._MagickSettings_SetSize(settings._instance, sizePtr);
      });
    }

    return Disposable._disposeAfterExecution(settings, func);
  }

  private getSize(): string {
    if (this.width !== undefined && this.height !== undefined) {
      return `${this.width}x${this.height}`;
    } else if (this.width !== undefined) {
      return `${this.width}x`;
    } else if (this.height !== undefined) {
      return `x${this.height}`;
    } else {
      return "";
    }
  }
}
