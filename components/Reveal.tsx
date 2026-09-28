'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Glider in innehållet när det scrollas fram. Innehållet är synligt från start
 * (server-renderat) och göms bara om det ligger under skärmkanten när sidan laddas.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section';
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setState('hidden');
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState('shown');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = state === 'hidden' ? 'reveal-hidden' : state === 'shown' ? 'reveal-shown' : '';
  return (
    // @ts-expect-error – polymorf tagg
    <Tag ref={ref} className={`${className} ${cls}`} style={state === 'shown' ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
