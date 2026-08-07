import { useEffect, useState } from "react";

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
  year: number;
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

  // Group filtered images by year (newest first), then by category within
  // each year, so the "all" tab is organized by both dimensions.
  const groupedByYear = filtered.reduce<Record<number, GalleryImage[]>>(
    (acc, img) => {
      (acc[img.year] ??= []).push(img);
      return acc;
    },
    {}
  );
  const yearGroups = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a)
    .map((year) => {
      const images = groupedByYear[year];
      const byCategory = images.reduce<Record<string, GalleryImage[]>>(
        (acc, img) => {
          (acc[img.category] ??= []).push(img);
          return acc;
        },
        {}
      );
      const categories = Object.keys(byCategory)
        .sort(
          (a, b) =>
            (CATEGORIES.indexOf(a) === -1 ? Number.MAX_SAFE_INTEGER : CATEGORIES.indexOf(a)) -
            (CATEGORIES.indexOf(b) === -1 ? Number.MAX_SAFE_INTEGER : CATEGORIES.indexOf(b))
        )
        .map((category) => ({ category, images: byCategory[category] }));
      return { year, categories };
    });
  const ordered = yearGroups.flatMap((group) =>
    group.categories.flatMap((cat) => cat.images)
  );

  const lightbox = lightboxIndex === null ? null : ordered[lightboxIndex];

  const closeLightbox = () => setLightboxIndex(null);

  const showPrevious = () => {
    setLightboxIndex((current) => {
      if (current === null || ordered.length === 0) return current;
      return (current - 1 + ordered.length) % ordered.length;
    });
  };

  const showNext = () => {
    setLightboxIndex((current) => {
      if (current === null || ordered.length === 0) return current;
      return (current + 1) % ordered.length;
    });
  };

  useEffect(() => {
    if (lightboxIndex !== null && !ordered[lightboxIndex]) {
      closeLightbox();
    }
  }, [ordered, lightboxIndex]);

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
  }, [ordered.length, lightboxIndex]);

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

      <div>
        {yearGroups.map((group, groupIndex) => {
          let runningIndex = yearGroups
            .slice(0, groupIndex)
            .reduce(
              (acc, g) =>
                acc + g.categories.reduce((a, c) => a + c.images.length, 0),
              0
            );
          return (
            <div key={group.year} className="mb-12">
              <h3 className="font-display text-4xl text-maroon-deep mb-6">
                {group.year}
              </h3>
              {group.categories.map((cat) => {
                const baseIndex = runningIndex;
                runningIndex += cat.images.length;
                return (
                  <div key={cat.category} className="mb-10">
                    {group.categories.length > 1 && (
                      <h4 className="font-display text-2xl text-maroon capitalize mb-4">
                        {cat.category}
                      </h4>
                    )}
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
                      {cat.images.map((img, imageIndex) => {
                        const index = baseIndex + imageIndex;
                        return (
                          <button
                            key={img.src}
                            type="button"
                            onClick={() => setLightboxIndex(index)}
                            className="block w-full break-inside-avoid group cursor-pointer text-left"
                          >
                            <div className="manuscript-card overflow-hidden aspect-square bg-parchment/10">
                              <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-contain transition-all duration-500 group-hover:scale-[1.02] grayscale group-hover:grayscale-0"
                                loading="lazy"
                              />
                              <p className="px-3 py-2 font-ui text-xs text-stone-light capitalize">
                                {img.category}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
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
