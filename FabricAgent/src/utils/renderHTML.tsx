import DOMPurify from "dompurify";
import parse from "html-react-parser";

export function renderHTML(input?: string | null) {
  if (!input) return null;
  const clean = DOMPurify.sanitize(input, { USE_PROFILES: { html: true } });
  return parse(clean);
}
