import { useEffect, useState } from "react";

/**
 * Devolve o id da seção visível no momento. Usa a linha de 45% da viewport
 * como régua para que a troca aconteça quando a seção realmente domina a tela.
 */
export function useScrollSpy(ids: string[], offset = 0.45) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return;

    let frame = 0;

    const measure = () => {
      const line = window.innerHeight * offset;
      let current = ids[0];

      for (const id of ids) {
        const node = document.getElementById(id);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= line) current = id;
      }

      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids, offset]);

  return active;
}
