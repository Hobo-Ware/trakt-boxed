import type { Action } from 'svelte/action';

export const whileVisible: Action<HTMLElement, () => void> = (
  node,
  onVisible,
) => {
  let callback = onVisible;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) callback?.();
    },
    { rootMargin: '0px 0px 600px 0px' },
  );
  observer.observe(node);

  return {
    update: (next) => (callback = next),
    destroy: () => observer.disconnect(),
  };
};
