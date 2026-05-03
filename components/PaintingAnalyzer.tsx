'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import WendyResponse from './WendyResponse';

type State = 'idle' | 'dragging' | 'preview' | 'loading' | 'done' | 'error';

export default function PaintingAnalyzer() {
  const [state, setState] = useState<State>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileRef = useRef<HTMLInputElement>(null);
  const currentFile = useRef<File | null>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image too large. Please use an image under 8MB.');
      setState('error');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    currentFile.current = file;
    setState('preview');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState('idle');
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const submitImage = async () => {
    setState('loading');
    setAnalysis(null);
    setErrorMsg(null);

    try {
      let res: Response;

      if (mode === 'url') {
        res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput }),
        });
      } else {
        if (!currentFile.current) return;
        const fd = new FormData();
        fd.append('image', currentFile.current);
        res = await fetch('/api/analyze', { method: 'POST', body: fd });
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
      setState('done');
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong');
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setPreviewUrl(null);
    setAnalysis(null);
    setErrorMsg(null);
    setUrlInput('');
    currentFile.current = null;
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <section className="fade-up-delay">
      <div className="flex items-center gap-3 mb-8">
        <hr className="ornamental-rule flex-1" />
        <span className="text-xs tracking-[0.3em] uppercase text-[#7a6248] font-[family-name:var(--font-playfair)]">
          Bring Sister Wendy a Painting
        </span>
        <hr className="ornamental-rule flex-1" />
      </div>

      <p className="text-center text-[#5c3d28] text-sm italic mb-8 max-w-lg mx-auto leading-relaxed">
        Upload any painting — or paste an image URL — and Sister Wendy will tell you
        what it is really about.
      </p>

      {/* Mode tabs */}
      <div className="flex justify-center gap-6 mb-6">
        {(['upload', 'url'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); }}
            className={`text-xs tracking-widest uppercase pb-1 transition-colors ${
              mode === m
                ? 'text-[#8b6914] border-b border-[#8b6914]'
                : 'text-[#7a6248] hover:text-[#5c3d28]'
            }`}
          >
            {m === 'upload' ? 'Upload File' : 'Image URL'}
          </button>
        ))}
      </div>

      {mode === 'url' ? (
        /* URL mode */
        <div className="max-w-xl mx-auto space-y-4">
          <input
            type="url"
            placeholder="https://example.com/painting.jpg"
            value={urlInput}
            onChange={e => { setUrlInput(e.target.value); if (e.target.value) setState('preview'); else setState('idle'); }}
            className="w-full px-4 py-3 bg-[#ece8d9] border border-[rgba(139,105,20,0.3)] rounded-sm text-[#2c1a0e] text-sm placeholder:text-[#7a6248] focus:outline-none focus:border-[#8b6914] transition-colors"
          />
          {urlInput && state !== 'loading' && state !== 'done' && (
            <button
              onClick={submitImage}
              className="w-full py-3 bg-[#8b6914] hover:bg-[#a07820] text-[#f7f3e9] text-sm tracking-widest uppercase transition-colors rounded-sm font-[family-name:var(--font-playfair)] font-bold"
            >
              Contemplate
            </button>
          )}
        </div>
      ) : (
        /* Upload mode */
        <div className="max-w-xl mx-auto">
          {state === 'idle' || state === 'dragging' ? (
            <div
              className={`drop-zone rounded-sm p-10 text-center cursor-pointer ${state === 'dragging' ? 'drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setState('dragging'); }}
              onDragLeave={() => setState('idle')}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <div className="text-3xl mb-3 text-[#c9a84c]">&#9670;</div>
              <p className="text-[#5c3d28] text-sm mb-1">Drop a painting here</p>
              <p className="text-[#7a6248] text-xs">or click to browse — JPG, PNG, WebP, up to 8MB</p>
            </div>
          ) : state === 'preview' && previewUrl ? (
            <div className="space-y-4">
              <div className="relative painting-frame rounded-sm overflow-hidden bg-[#e4ddc8] max-h-96">
                <Image
                  src={previewUrl}
                  alt="Your painting"
                  width={600}
                  height={400}
                  className="w-full h-full object-contain block max-h-96"
                  unoptimized
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={submitImage}
                  className="flex-1 py-3 bg-[#8b6914] hover:bg-[#a07820] text-[#f7f3e9] text-sm tracking-widest uppercase transition-colors rounded-sm font-[family-name:var(--font-playfair)] font-bold"
                >
                  Contemplate
                </button>
                <button
                  onClick={reset}
                  className="px-5 py-3 border border-[rgba(139,105,20,0.3)] text-[#7a6248] hover:text-[#5c3d28] text-sm transition-colors rounded-sm"
                >
                  Change
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Loading */}
      {state === 'loading' && (
        <div className="flex flex-col items-center gap-5 py-12 fade-up">
          <div className="spinner" />
          <p className="text-[#7a6248] text-sm italic">
            Sister Wendy is looking at your painting&hellip;
          </p>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div className="max-w-xl mx-auto text-center py-6 space-y-3">
          <p className="text-[#8b1414] text-sm">{errorMsg || 'Something went wrong.'}</p>
          <button onClick={reset} className="text-[#8b6914] text-xs underline hover:text-[#a07820]">
            Try another painting
          </button>
        </div>
      )}

      {/* Result */}
      {state === 'done' && analysis && (
        <div className="max-w-2xl mx-auto mt-8">
          <WendyResponse
            analysis={analysis}
            imageUrl={mode === 'url' ? urlInput : previewUrl || undefined}
          />
          <div className="text-center mt-8">
            <button
              onClick={reset}
              className="text-[#8b6914] text-sm italic hover:text-[#a07820] transition-colors"
            >
              Bring another painting &#8594;
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
