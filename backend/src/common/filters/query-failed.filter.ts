import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

interface PostgresDriverError {
  code?: string;
  detail?: string;
  constraint?: string;
  message?: string;
}

/**
 * Maps Postgres/TypeORM driver errors to clean HTTP responses.
 *
 * Without this filter, a `value too long`, missing `NOT NULL`, or unique-violation
 * bubbles up as the default 500 "Internal server error", which is misleading and
 * leaks SQL details to logs. This filter translates the most common ones into
 * 400 / 409 with a stable, user-friendly message; anything unrecognized is left
 * alone (so 500s from real bugs are still surfaced).
 */
@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(QueryFailedExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const driver = (
      exception as unknown as { driverError?: PostgresDriverError }
    ).driverError;
    const code = driver?.code ?? '';

    // 22001 = string_data_right_truncation ("value too long for type character varying(N)")
    // 23502 = not_null_violation ("null value in column ... violates not-null constraint")
    // 23503 = foreign_key_violation
    // 23505 = unique_violation
    // 23514 = check_violation
    if (code === '22001') {
      this.logger.warn(
        `value too long: ${driver?.message ?? exception.message}`,
      );
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: this.translateLengthError(driver) ?? exception.message,
      });
      return;
    }

    if (code === '23502') {
      this.logger.warn(
        `not-null violation: ${driver?.message ?? exception.message}`,
      );
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: 'Falta un campo obligatorio',
      });
      return;
    }

    if (code === '23505') {
      this.logger.warn(
        `unique violation: ${driver?.detail ?? exception.message}`,
      );
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message:
          'Ya existe un registro con los mismos datos únicos (el detalle está en los logs del servidor).',
      });
      return;
    }

    if (code === '23503') {
      this.logger.warn(`fk violation: ${driver?.detail ?? exception.message}`);
      response
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new BadRequestException(
            'Referencia inválida a otro registro',
          ).getResponse(),
        );
      return;
    }

    if (code === '23514') {
      this.logger.warn(
        `check violation: ${driver?.message ?? exception.message}`,
      );
      response
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new BadRequestException(
            'Valor fuera del rango permitido',
          ).getResponse(),
        );
      return;
    }

    // Unknown code — let Nest's default filter produce the 500. We log so it's
    // not silently swallowed by our exception filter.
    this.logger.error(
      `unmapped QueryFailedError code=${code}: ${driver?.message ?? exception.message}`,
    );
    throw exception;
  }

  private translateLengthError(
    driver: PostgresDriverError | undefined,
  ): string {
    const msg = driver?.message ?? '';
    const match = msg.match(
      /value too long for type character varying\((\d+)\)/,
    );
    if (match) {
      const length = match[1];
      return `El valor excede la longitud máxima permitida (${length} caracteres).`;
    }
    return 'El valor excede la longitud máxima permitida.';
  }
}
