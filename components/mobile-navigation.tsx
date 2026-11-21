"use client";

import { useRef } from "react";
import Link from "next/link";

export function MobileNavigation({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const menu = useRef<HTMLDivElement>(null);
  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="mobile-menu-toggle"
        popoverTarget="mobile-navigation"
        aria-label="Open navigation"
      >
        Menu
      </button>
      <div
        id="mobile-navigation"
        className="mobile-menu-links"
        popover="auto"
        ref={menu}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => menu.current?.hidePopover()}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
