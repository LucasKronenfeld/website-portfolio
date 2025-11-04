import React from 'react';

// Prefer external SVG assets (Microlink) if available; fallback to inline minimal icons.
import mailIcon from '../../assets/icons/mail.svg';
import userIcon from '../../assets/icons/user.svg';
import codeIcon from '../../assets/icons/code.svg';
import loginIcon from '../../assets/icons/login.svg';
import menuIcon from '../../assets/icons/menu.svg';
import closeIcon from '../../assets/icons/close.svg';

export default function Icon({ name, className = 'w-5 h-5', title }) {
  const props = { className, role: 'img', 'aria-label': title || name };

  const byName = {
    mail: mailIcon,
    user: userIcon,
    code: codeIcon,
    login: loginIcon,
    menu: menuIcon,
    close: closeIcon,
  };

  const src = byName[name];
  if (src) return <img src={src} alt={title || name} {...props} />;

  // Fallback minimal inline rectangle
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="4" y="4" width="16" height="16" />
    </svg>
  );
}
