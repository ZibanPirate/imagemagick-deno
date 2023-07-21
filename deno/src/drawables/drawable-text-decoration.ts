// Copyright Dirk Lemstra https://github.com/dlemstra/magick-wasm.
// Licensed under the Apache License, Version 2.0.
import { TextDecoration } from "../text-decoration.ts";
import { IDrawable } from "./drawable.ts";
import { IDrawingWand } from "./drawing-wand.ts";

export class DrawableTextDecoration implements IDrawable {
  private readonly _decoration: TextDecoration;

  constructor(decoration: TextDecoration) {
    this._decoration = decoration;
  }

  draw(wand: IDrawingWand): void {
    wand.textDecoration(this._decoration);
  }
}
