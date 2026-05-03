'use client';

import Image from 'next/image';

interface Props {
  analysis: string;
  imageUrl?: string;
}

export default function WendyResponse({ analysis, imageUrl }: Props) {
  const paragraphs = analysis.split('\n\n').filter(Boolean);

  return (
    <div className="parchment-card rounded-sm p-7 md:p-10 fade-up">
      {imageUrl && (
        <div className="float-right ml-6 mb-4 w-32 md:w-40">
          <div className="painting-frame rounded-sm overflow-hidden bg-[#e4ddc8]">
            <Image
              src={imageUrl}
              alt="The painting"
              width={200}
              height={260}
              className="w-full h-auto object-contain block"
              unoptimized
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-5">
        <span className="text-[#8b6914] text-xs tracking-[0.25em] uppercase font-[family-name:var(--font-playfair)]">
          Sister Wendy
        </span>
        <span className="text-[#c9a84c] text-xs">&#9670;</span>
      </div>

      <div className="wendy-prose text-[#2c1a0e] text-[0.95rem] leading-[1.9] clear-both">
        {paragraphs.map((para, i) => (
          <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-[rgba(139,105,20,0.15)] text-center">
        <span className="text-[#c9a84c] text-sm tracking-[0.4em]">&#9670; &#9670; &#9670;</span>
      </div>
    </div>
  );
}
