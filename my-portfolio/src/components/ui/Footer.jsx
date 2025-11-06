import React from 'react';
import Icon from './Icon';
import { getSiteLinks } from '../../siteLinks';

export default function Footer() {
  const year = new Date().getFullYear();
  const { github: GITHUB_URL, linkedin: LINKEDIN_URL, email: CONTACT_EMAIL } = getSiteLinks();

  return (
    <footer className="w-full mt-8 border-t-2 border-ink bg-paper">
      <div className="max-w-3xl sm:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-ink">
        <div className="mb-3 flex items-center justify-center gap-3">
          {[
            { label: 'Resume', icon: 'user', href: '/resume', external: false },
            { label: 'GitHub', icon: 'code', href: GITHUB_URL, external: true },
            { label: 'LinkedIn', icon: 'user', href: LINKEDIN_URL, external: true },
            { label: 'Email', icon: 'mail', href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : undefined, external: false },
          ].filter(item => item.href).map((d, i) => (
            <a
              key={i}
              href={d.href}
              target={d.external ? '_blank' : undefined}
              rel={d.external ? 'noreferrer' : undefined}
              className="inline-flex items-center gap-1 border border-ink bg-surface px-2 py-1 hover:underline"
            >
              <Icon name={d.icon} className="h-3 w-3" />
              <span>{d.label}</span>
            </a>
          ))}
        </div>
        <div>© {year} Lucas Kronenfeld</div>
        <div className="mt-1">Retro web vibes • No drop shadows, just pixels</div>
      </div>
    </footer>
  );
}
