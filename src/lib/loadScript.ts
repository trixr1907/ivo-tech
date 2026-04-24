type LoadScriptOptions = {
  integrity?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  referrerPolicy?: ReferrerPolicy;
};

const cache = new Map<string, Promise<void>>();

export function loadScript(src: string, opts: LoadScriptOptions = {}): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error(`loadScript(${src}): called on server`));
  }

  const cached = cache.get(src);
  if (cached) return cached;

  const p = new Promise<void>((resolve, reject) => {
    // If the script tag already exists in the document, reuse it.
    const existing = document.querySelector(`script[src="${CSS.escape(src)}"]`);
    if (existing) {
      // If it already loaded, resolve immediately.
      if ((existing as HTMLScriptElement).dataset.loaded === 'true') {
        resolve();
        return;
      }

      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error(`loadScript(${src}): failed to load existing script tag`)),
        { once: true }
      );
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    if (opts.integrity) s.integrity = opts.integrity;
    if (opts.crossOrigin) s.crossOrigin = opts.crossOrigin;
    if (opts.referrerPolicy) s.referrerPolicy = opts.referrerPolicy;

    s.addEventListener('load', () => {
      s.dataset.loaded = 'true';
      resolve();
    });
    s.addEventListener('error', () => reject(new Error(`loadScript(${src}): failed to load`)));

    document.head.appendChild(s);
  });

  cache.set(src, p);
  return p;
}

