export const ABCJS_SOUNDFONT_ORIGIN = "https://paulrosen.github.io";
export const ABCJS_SOUNDFONT_URL =
  ABCJS_SOUNDFONT_ORIGIN + "/midi-js-soundfonts/FluidR3_GM/";

export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self' " + ABCJS_SOUNDFONT_ORIGIN,
  "media-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");
