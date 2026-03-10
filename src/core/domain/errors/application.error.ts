export abstract class ApplicationError extends Error {
  abstract readonly error: string; // not_found, validation_error, etc.
  abstract readonly code: string; // specific domain code
  public readonly ctx?: unknown;

  constructor(message: string, ctx?: unknown) {
    super(message);
    this.ctx = ctx;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
