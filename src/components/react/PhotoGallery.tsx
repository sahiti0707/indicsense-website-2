import { useEffect, useState } from "react";

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

interface Props {
  images: GalleryImage[];
  initialFilter?: string;
}

const CATEGORIES = ["all", "yatra", "art", "virasat", "performance", "architecture", "samagam", "workshop" ,"sangam"];

export default function PhotoGallery({ images, initialFilter = "all" }: Props) {
  const [filter, setFilter] = useState(initialFilter);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sync filter with URL query param on client-side navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get("filter")?.toLowerCase();
    if (urlFilter && CATEGORIES.includes(urlFilter) && urlFilter !== filter) {
      setFilter(urlFilter);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentFilter = params.get("filter")?.toLowerCase();
    if (filter !== currentFilter) {
      params.set("filter", filter);
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    }
  }, [filter]);

  const filtered =
    filter === "all" ? images : images.filter((img) => img.category === filter);
  const lightbox = lightboxIndex === null ? null : filtered[lightboxIndex];

  const closeLightbox = () => setLightboxIndex(null);

  const showPrevious = () => {
    setLightboxIndex((current) => {
      if (current === null || filtered.length === 0) return current;
      return (current - 1 + filtered.length) % filtered.length;
    });
  };

  const showNext = () => {
    setLightboxIndex((current) => {
      if (current === null || filtered.length === 0) return current;
      return (current + 1) % filtered.length;
    });
  };

  useEffect(() => {
    if (lightboxIndex !== null && !filtered[lightboxIndex]) {
      closeLightbox();
    }
  }, [filtered, lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        showPrevious();
      }

      if (
        event.key === "ArrowRight" ||
        event.key === "PageDown" ||
        event.key === "Next" ||
        event.key === "MediaTrackNext"
      ) {
        event.preventDefault();
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filtered.length, lightboxIndex]);

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
        {filtered.map((img, index) => (
          <button
            key={img.src}
            type="button"
            onClick={() => setLightboxIndex(index)}
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
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl max-h-[90vh] px-14"
            onClick={(e) => e.stopPropagation()}
          >
            {filtered.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-parchment text-ink font-ui text-xs shadow-lg"
                  aria-label="Previous image"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-parchment text-ink font-ui text-xs shadow-lg"
                  aria-label="Next image"
                >
                  Next
                </button>
              </>
            )}
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
              onClick={closeLightbox}
              className="absolute -top-2 -right-2 md:-right-10 flex h-10 w-10 items-center justify-center rounded-full bg-parchment text-ink font-ui"
              aria-label="Close"
            >
              x
            </button>
          </div>
        </div>
      )}
    </>
  );
}
