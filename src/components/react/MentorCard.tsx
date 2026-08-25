import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MentorCardProps {
  id: string;
  name: string;
  image: string | null;
  contribution: string;
  startYear: string | number;
  endYear: string | number;
  bio: string;
  bioUrl: string;
  summary: string;
}

interface CardProps {
  mentor: MentorCardProps;
  index: number;
  onSelect: (mentor: MentorCardProps) => void;
}

function MentorCard({ mentor, index, onSelect }: CardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="relative flex flex-col items-center overflow-hidden rounded-lg border border-gold/20 bg-cream shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Banner */}
      <div className="relative h-20 w-full bg-gradient-to-r from-maroon to-maroon-deep shrink-0" />

      {/* Avatar */}
      <div className="-mt-12 z-10">
        <div className="h-24 w-24 rounded-full border-4 border-cream bg-parchment-dark overflow-hidden shadow-md">
          {mentor.image ? (
            <img
              src={mentor.image}
              alt={mentor.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-maroon/10 to-gold/10">
              <span className="font-sanskrit text-3xl text-maroon/40 iast">गुरु</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center w-full px-5 pb-5 pt-3">
        <h3 className="text-center font-bold text-lg text-ink leading-snug">
          {mentor.name}
        </h3>

        <p className="mt-1 text-center text-xs text-ink/70 leading-snug line-clamp-2">
          {mentor.contribution} | Mentor ({mentor.startYear} – {mentor.endYear})
        </p>

        <p className="mt-3 text-center text-xs text-ink/80 leading-relaxed line-clamp-2">
          {mentor.bio}
        </p>

        <button
          type="button"
          onClick={() => onSelect(mentor)}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-maroon/40 px-5 py-1.5 font-ui text-xs font-medium text-maroon hover:bg-maroon hover:text-parchment transition-colors duration-200"
        >
          Summary
        </button>
      </div>
    </motion.article>
  );
}

interface GridProps {
  mentors: MentorCardProps[];
}

export default function MentorsGrid({ mentors }: GridProps) {
  const [selectedMentor, setSelectedMentor] = useState<MentorCardProps | null>(null);

  return (
    <AnimatePresence mode="wait">
      {selectedMentor ? (
        <motion.div
          key="detail"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {/* Back Button */}
          <button
            type="button"
            onClick={() => setSelectedMentor(null)}
            className="mb-6 inline-flex items-center gap-2 font-ui text-sm text-maroon hover:text-maroon-deep transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Mentors
          </button>

          {/* Profile Panel */}
          <div className="overflow-hidden rounded-lg border border-gold/20 bg-cream shadow-sm">
            {/* Banner */}
            <div className="h-28 w-full bg-gradient-to-r from-maroon to-maroon-deep shrink-0" />

            {/* Avatar — overlaps banner */}
            <div className="flex justify-center -mt-12 relative z-10">
              <div className="h-24 w-24 rounded-full border-4 border-cream bg-parchment-dark overflow-hidden shadow-md">
                {selectedMentor.image ? (
                  <img
                    src={selectedMentor.image}
                    alt={selectedMentor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-maroon/10 to-gold/10">
                    <span className="font-sanskrit text-3xl text-maroon/40 iast">गुरु</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content — cleanly below banner in cream area */}
            <div className="px-6 pt-3 pb-6">
              <h2 className="text-center text-2xl font-bold text-ink leading-snug">
                {selectedMentor.name}
              </h2>
              <p className="mt-1 text-center text-xs font-semibold uppercase tracking-wider text-[#c9933a]">
                {selectedMentor.contribution}
              </p>
              <p className="mt-0.5 text-center text-xs text-ink/70">
                Mentor ({selectedMentor.startYear} – {selectedMentor.endYear})
              </p>

              {/* Summary Highlights */}
              <div className="mt-5 rounded-md border border-[#c9933a]/30 bg-[#f5ede0] p-4">
                <p className="font-ui text-xs font-semibold text-[#7b1d1d] mb-1">
                  Summary Highlights:
                </p>
                <p className="text-sm text-ink/80 leading-relaxed line-clamp-2">
                  {selectedMentor.summary}
                </p>
              </div>

              {/* Full Biography */}
              <div className="mt-6">
                <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-muted-light mb-2">
                  Full Biography
                </p>
                <p className="text-sm text-ink/80 leading-relaxed">
                  {selectedMentor.bio}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {mentors.map((mentor, index) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              index={index}
              onSelect={setSelectedMentor}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
