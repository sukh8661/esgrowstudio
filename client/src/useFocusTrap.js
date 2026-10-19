import { useEffect, useRef } from "react";
export default function useFocusTrap(ref, enabled, onClose) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const previous = document.activeElement;
    const root = ref.current;
    const focusable = () =>
      [
        ...root.querySelectorAll(
          'a[href],button:not(:disabled),input,textarea,select,[tabindex="0"]',
        ),
      ].filter((el) => el.getClientRects().length);
    focusable()[0]?.focus();
    const key = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = focusable(),
        first = nodes[0],
        last = nodes.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    root.addEventListener("keydown", key);
    return () => {
      root.removeEventListener("keydown", key);
      if (previous?.isConnected) previous.focus();
    };
  }, [enabled, ref]);
}
