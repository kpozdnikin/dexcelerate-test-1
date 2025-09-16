export class CustomError extends Error {
  code: string | undefined;

  status: number | undefined;

  message: string;

  constructor({
                code,
                status,
                message,
              }: {
    code?: string;
    status?: number;
    message: string;
  }) {
    super(message);

    this.code = code;
    this.status = status;
    this.message = message;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}