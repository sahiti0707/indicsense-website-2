import { useState } from "react";

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

interface Props {
  images: GalleryImage[];
}

const CATEGORIES = ["all", "yatra", "art", "virasat", "performance", "architecture", "samagam", "workshop"];

export default function PhotoGallery({ images }: Props) {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered =
    filter === "all" ? images : images.filter((img) => img.category === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`font-ui text-xs uppercase tracking-wider px-4 py-2 rounded-sm border transition-all ${
              filter === cat
                ? "border-maroon bg-maroon text-parchment"
                : "border-stone/20 text-stone hover:border-maroon/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((img) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setLightbox(img)}
            className="block w-full break-inside-avoid group cursor-pointer text-left"
          >
            <div className="manuscript-card overflow-hidden">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-all duration-500 group-hover:scale-[1.02] grayscale group-hover:grayscale-0"
                loading="lazy"
              />
              <p className="px-3 py-2 font-ui text-xs text-stone-light capitalize">
                {img.category}
              </p>
            </div>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[85vh] w-auto mx-auto rounded-sm"
            />
            <p className="mt-3 text-center text-parchment font-ui text-sm">
              {lightbox.alt}
            </p>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-2 -right-2 md:-right-10 w-10 h-10 rounded-full bg-parchment text-ink font-ui"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
