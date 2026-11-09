/** Marks content the client still has to supply, written like {{SAQCC_NUMBER}}. */
const PLACEHOLDER = /\{\{[A-Z0-9_]+\}\}/;

export const isPlaceholder = (text: string) => PLACEHOLDER.test(text);

/**
 * Unfilled placeholders must never reach visitors on a live ad page. They only
 * render in development, or in a preview build with VITE_SHOW_PLACEHOLDERS=true.
 */
export const shouldShowPlaceholders = () =>
  import.meta.env.DEV || import.meta.env.VITE_SHOW_PLACEHOLDERS === "true";
