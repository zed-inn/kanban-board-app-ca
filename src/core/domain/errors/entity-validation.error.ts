import type { ApplicationError } from "./application.error";

export class EntityValidationError extends Error implements ApplicationError {
  readonly error = "validation_error";
  readonly code: string;
  readonly ctx?: unknown;

  constructor(code: string, message: string, ctx?: unknown) {
    super(message);
    this.code = code;
    this.ctx = ctx;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
