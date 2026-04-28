declare const trustedHtmlBrand: unique symbol;

/**
 * HTML that has been reviewed, sanitized, or defined statically at the call site.
 * This brand prevents plain strings from being passed into set:html-based APIs by
 * accident.
 */
export type TrustedHtml = string & {
  readonly [trustedHtmlBrand]: true;
};

export const trustedHtml = (value: string): TrustedHtml => value as TrustedHtml;

export const trustedHtmlList = <const Values extends readonly string[]>(
  values: Values
): ReadonlyArray<TrustedHtml> => values.map((value) => trustedHtml(value));
