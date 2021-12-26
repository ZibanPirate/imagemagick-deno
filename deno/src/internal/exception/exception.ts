// Copyright Dirk Lemstra https://github.com/dlemstra/magick-wasm.
// Licensed under the Apache License, Version 2.0.
import { ImageMagick } from "../../image-magick.ts";
import { MagickError } from "../../magick-error.ts";
import { MagickErrorSeverity } from "../../magick-error-severity.ts";
import { Pointer } from "../pointer/pointer.ts";
import { _createString } from "../native/string.ts";

/** @internal */
export class Exception {
  private readonly pointer: Pointer;

  private constructor(pointer: Pointer) {
    this.pointer = pointer;
  }

  get ptr(): number {
    return this.pointer.ptr;
  }

  check<TReturnType>(
    success: () => TReturnType,
    error: () => TReturnType,
  ): TReturnType {
    if (this.isError()) {
      return error();
    }

    return success();
  }

  static usePointer<TReturnType>(
    func: (exception: number) => TReturnType,
  ): TReturnType {
    return Pointer.use((pointer) => {
      const result = func(pointer.ptr);

      return Exception.checkException(pointer, result);
    });
  }

  static use<TReturnType>(
    func: (exception: Exception) => TReturnType,
  ): TReturnType {
    return Pointer.use((pointer) => {
      const result = func(new Exception(pointer));

      return Exception.checkException(pointer, result);
    });
  }

  private static checkException<TReturnType>(
    exception: Pointer,
    result: TReturnType,
  ): TReturnType {
    if (!Exception.isRaised(exception)) {
      return result;
    }

    const severity = Exception.getErrorSeverity(exception);
    if (severity >= MagickErrorSeverity.Error) {
      Exception.throw(exception, severity);
    } else {
      Exception.dispose(exception);
    }

    return result;
  }

  private isError() {
    if (!Exception.isRaised(this.pointer)) {
      return false;
    }

    const severity = Exception.getErrorSeverity(this.pointer);
    return severity >= MagickErrorSeverity.Error;
  }

  private static getErrorSeverity(exception: Pointer): MagickErrorSeverity {
    return ImageMagick._api._MagickExceptionHelper_Severity(
      exception.value,
    ) as MagickErrorSeverity;
  }

  private static isRaised(exception: Pointer): boolean {
    return exception.value !== 0;
  }

  private static throw(
    exception: Pointer,
    severity: MagickErrorSeverity,
  ): void {
    const errorMessage = Exception.getMessage(exception);
    Exception.dispose(exception);

    throw new MagickError(errorMessage, severity);
  }

  private static getMessage(exception: Pointer): string {
    const message = ImageMagick._api._MagickExceptionHelper_Message(
      exception.value,
    );
    const description = ImageMagick._api._MagickExceptionHelper_Description(
      exception.value,
    );

    let errorMessage = _createString(message, "Unknown error");
    if (description !== 0) {
      errorMessage += `(${ImageMagick._api.UTF8ToString(description)})`;
    }

    return errorMessage;
  }

  private static dispose(exception: Pointer): void {
    ImageMagick._api._MagickExceptionHelper_Dispose(exception.value);
  }
}
