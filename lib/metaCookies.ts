export function getMetaCookies() {
  if (typeof document === "undefined") return { fbp: undefined, fbc: undefined };
  const cookies = document.cookie.split("; ").reduce(
    (acc, c) => {
      const [k, v] = c.split("=");
      acc[k] = v;
      return acc;
    },
    {} as Record<string, string>,
  );
  return { fbp: cookies["_fbp"], fbc: cookies["_fbc"] };
}