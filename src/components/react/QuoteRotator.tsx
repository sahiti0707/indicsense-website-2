import { useEffect, useState } from "react";

interface Quote {
  text: string;
  translation: string;
  source: string;
  author: string;
}

interface Props {
  quotes: Quote[];
}

export default function QuoteRotator({ quotes }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % quotes.length);
        setVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const quote = quotes[index];
  if (!quote) return null;

  return (
    <div
      className={`text-center transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <p className="font-sanskrit text-3xl md:text-4xl lg:text-5xl text-maroon-deep leading-relaxed iast">
        {quote.text}
      </p>
      <p className="mt-6 font-body text-lg md:text-xl text-stone italic max-w-2xl mx-auto">
        {quote.translation}
      </p>
      <p className="mt-4 font-ui text-xs tracking-[0.2em] text-stone-light uppercase">
        {quote.source}
        {quote.author && ` · ${quote.author}`}
      </p>
    </div>
  );
}
