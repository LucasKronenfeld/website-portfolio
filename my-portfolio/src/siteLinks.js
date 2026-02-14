// Centralized site links so Navbar, Footer, and Home snapshot agree
import { normalizeExternalUrl } from "./utils/normalizeExternalUrl";
export function getSiteLinks() {
  const envGithub = import.meta.env.VITE_GITHUB_URL;
  const envLinkedIn = import.meta.env.VITE_LINKEDIN_URL;
  const envEmail = import.meta.env.VITE_CONTACT_EMAIL;

  // Fallbacks based on current Navbar hardcoded values
  const fallbackGithub = 'https://github.com/LucasKronenfeld';
  const fallbackLinkedIn = 'https://www.linkedin.com/in/lucas-kronenfeld-872040269/';
  const fallbackEmail = 'kronenfeldlucas@gmail.com';

  const github = normalizeExternalUrl(envGithub || fallbackGithub);
  const linkedin = normalizeExternalUrl(envLinkedIn || fallbackLinkedIn);
  const email = envEmail || fallbackEmail;

  return { github, linkedin, email };
}
