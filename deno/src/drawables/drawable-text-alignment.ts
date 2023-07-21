// Copyright Dirk Lemstra https://github.com/dlemstra/magick-wasm.
// Licensed under the Apache License, Version 2.0.
import { TextAlignment } from "../text-alignment.ts";
import { IDrawable } from "./drawable.ts";
import { IDrawingWand } from "./drawing-wand.ts";

export class DrawableTextAlignment implements IDrawable {
  private readonly _alignment: TextAlignment;

  constructor(alignment: TextAlignment) {
    this._alignment = alignment;
  }

  draw(wand: IDrawingWand): void {
    wand.textAlignment(this._alignment);
  }
}
