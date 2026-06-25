'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface DailyData {
  painting: {
    id: number;
    title: string;
    artist: string;
    date: string;
    medium: string;
    imageUrl: string;
    imageSmall: string;
    creditLine: string;
    objectURL: string;
  };
  analysis: string;
}

export default function DailyContemplation() {
  const [data, setData] = useState<DailyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch('/api/daily')
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <hr className="ornamental-rule flex-1" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#7a6248] font-[family-name:var(--font-playfair)]">
            Today&apos;s Contemplation
          </span>
          <hr className="ornamental-rule flex-1" />
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="skeleton rounded-sm aspect-[4/5] w-full" />
          <div className="space-y-3 pt-2">
            <div className="skeleton h-7 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="mt-6 space-y-2">
              {[92, 85, 97, 80, 88, 95, 83, 90].map((w, i) => (
                <div key={i} className="skeleton h-4 rounded" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="mb-16 text-center py-12">
        <p className="text-[#7a6248] italic">The gallery is momentarily closed. Please return shortly.</p>
      </section>
    );
  }

  const { painting, analysis } = data;
  const paragraphs = analysis.split('\n\n').filter(Boolean);
  const preview = paragraphs.slice(0, 2).join('\n\n');
  const rest = paragraphs.slice(2).join('\n\n');

  return (
    <section className="mb-16 fade-up">
      <div className="flex items-center gap-3 mb-8">
        <hr className="ornamental-rule flex-1" />
        <span className="text-xs tracking-[0.3em] uppercase text-[#7a6248] font-[family-name:var(--font-playfair)]">
          Today&apos;s Contemplation
        </span>
        <hr className="ornamental-rule flex-1" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Painting */}
        <div className="relative painting-frame rounded-sm overflow-hidden bg-[#e4ddc8]">
          <Image
            src={painting.imageSmall || painting.imageUrl}
            alt={`${painting.title} by ${painting.artist}`}
            width={800}
            height={1000}
            className="w-full h-auto object-contain block"
            unoptimized
          />
          <div className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: 'inset 0 0 80px rgba(44,26,14,0.12)' }} />
        </div>

        {/* Painting details + analysis */}
        <div className="pt-1">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1c0f07] mb-1 leading-tight">
            {painting.title}
          </h2>
          <p className="text-[#5c3d28] text-sm mb-0.5">
            {painting.artist}{painting.date ? ` — ${painting.date}` : ''}
          </p>
          {painting.medium && (
            <p className="text-[#7a6248] text-xs italic mb-6">{painting.medium}</p>
          )}

          <hr className="ornamental-rule mb-6" />

          <div className="wendy-prose text-[#2c1a0e] text-[0.95rem] leading-[1.85]">
            {preview.split('\n\n').map((para, i) => (
              <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
            ))}

            {rest && (
              <>
                {expanded ? (
                  <div className="fade-up">
                    {rest.split('\n\n').map((para, i) => (
                      <p key={i} className="mt-4">{para}</p>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => setExpanded(true)}
                    className="mt-5 text-[#8b6914] text-sm italic hover:text-[#a07820] transition-colors flex items-center gap-2 group"
                  >
                    Continue reading
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">&#8594;</span>
                  </button>
                )}
              </>
            )}
          </div>

          {painting.creditLine && (
            <p className="mt-8 text-[10px] text-[#7a6248] leading-relaxed">
              {painting.creditLine}.{' '}
              {painting.objectURL && (
                <a
                  href={painting.objectURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#8b6914] transition-colors"
                >
                  View at the Met
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
