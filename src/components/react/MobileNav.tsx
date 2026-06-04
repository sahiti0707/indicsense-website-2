import { useState } from "react";

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  links: NavLink[];
}

export default function MobileNav({ links }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="font-ui text-sm tracking-wider text-stone p-2"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <nav className="absolute top-full left-0 right-0 bg-cream/98 border-b border-stone/10 shadow-lg py-4 px-6 z-50">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block font-ui text-sm tracking-wide text-stone hover:text-maroon py-1"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
