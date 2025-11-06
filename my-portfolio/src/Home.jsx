import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { db } from './firebaseConfig';
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import StructuredHero from './components/StructuredHero';
import SectionDivider from './components/ui/SectionDivider';
import DesktopIcon from './components/ui/DesktopIcon';
import { Link } from 'react-router-dom';
import Window from './components/ui/Window';
import PixelProgress from './components/ui/PixelProgress';
import TerminalList from './components/ui/TerminalList';
import StickerGrid from './components/ui/StickerGrid';
import LEDIndicator from './components/ui/LEDIndicator';
import CodeCard from './components/ui/CodeCard';
import RetroBreakout from './components/ui/RetroBreakout';
// import RetroTetris from './components/ui/RetroTetris';
import { getSiteLinks } from './siteLinks';
// import HeroDecorations from './components/ui/HeroDecorations';

// Processes all data and filters for featured items.
const processFetchedData = (portfolioData, projectsData) => {
  let combined = [];

  // Add featured portfolio items
  if (portfolioData) {
    for (const category in portfolioData) {
      if (portfolioData[category]) {
        portfolioData[category].forEach(item => {
          if (item.featured) {
            combined.push({
              id: `portfolio-${category}-${item.title}`,
              title: item.title,
              image: item.imageUrl,
              category: category,
              link: `/portfolio`,
              caption: (item.description || '').slice(0, 80),
            });
          }
        });
      }
    }
  }

  // Add featured project items
  if (projectsData) {
    for (const category in projectsData) {
      if(projectsData[category]) {
        projectsData[category].forEach(item => {
          if (item.featured) {
            combined.push({
              id: `projects-${category}-${item.title}`,
              title: item.title,
              image: item.imageSrc,
              category: category,
              link: item.link || `/projects`,
              caption: (item.description || '').slice(0, 80),
            });
          }
        });
      }
    }
  }

  // Assign size property for the bento grid layout.
  return combined.map((item, index) => ({
    ...item,
    size: index === 0 ? 'large' : 'default',
  }));
};


export default function Home() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [projectsData, setProjectsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [homeSettings, setHomeSettings] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  const escapeStr = (s) => (s || '').replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/'/g, "\\'");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const portfolioRef = doc(db, 'portfolio', 'data');
        const projectsRef = doc(db, 'projects', 'data');
        const homeRef = doc(db, 'site', 'home');
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3));
        
        const [portfolioSnap, projectsSnap, homeSnap, postsSnap] = await Promise.all([
          getDoc(portfolioRef),
          getDoc(projectsRef),
          getDoc(homeRef),
          getDocs(postsQuery)
        ]);

        if (portfolioSnap.exists()) setPortfolioData(portfolioSnap.data());
        if (projectsSnap.exists()) setProjectsData(projectsSnap.data());
        if (homeSnap.exists()) setHomeSettings(homeSnap.data());
        if (!postsSnap.empty) {
          const posts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setRecentPosts(posts);
        }

      } catch (error) {
        console.error("Error fetching homepage data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const featuredContent = useMemo(() => {
    return processFetchedData(portfolioData, projectsData);
  }, [portfolioData, projectsData]);

  const snippetCode = useMemo(() => {
    // Build a snapshot that doesn't duplicate prominently displayed content.
    // We'll show inventory counts and available links instead of hero/projects/posts.
    const portfolioCounts = [];
    if (portfolioData) {
      for (const cat in portfolioData) {
        portfolioCounts.push({ cat, count: (portfolioData[cat] || []).length });
      }
    }
    const projectCounts = [];
    if (projectsData) {
      for (const cat in projectsData) {
        projectCounts.push({ cat, count: (projectsData[cat] || []).length });
      }
    }
    const featuredCount = (portfolioData ? Object.values(portfolioData).flat().filter(i => i.featured).length : 0)
      + (projectsData ? Object.values(projectsData).flat().filter(i => i.featured).length : 0);

    const resolved = getSiteLinks();
    const links = {
      github: !!resolved.github,
      linkedin: !!resolved.linkedin,
      email: !!resolved.email,
    };

    const lines = [];
    lines.push('// site-snapshot.mjs');
    lines.push('export const snapshot = {');
    lines.push('  inventory: {');
    lines.push('    portfolio: [');
    portfolioCounts.forEach(p => lines.push(`      { category: '${escapeStr(p.cat)}', items: ${p.count} },`));
    if (portfolioCounts.length === 0) lines.push('      // No portfolio data yet');
    lines.push('    ],');
    lines.push('    projects: [');
    projectCounts.forEach(p => lines.push(`      { category: '${escapeStr(p.cat)}', items: ${p.count} },`));
    if (projectCounts.length === 0) lines.push('      // No projects yet');
    lines.push('    ]');
    lines.push('  },');
    lines.push(`  featuredCount: ${featuredCount},`);
    lines.push('  links: {');
    lines.push(`    github: ${links.github},`);
    lines.push(`    linkedin: ${links.linkedin},`);
    lines.push(`    email: ${links.email}`);
    lines.push('  },');
    lines.push(`  generatedAt: '${new Date().toISOString()}'`);
    lines.push('};');
    return lines.join('\n');
  }, [portfolioData, projectsData]);

  if (loading) {
    return (
      <div className="bg-background text-text min-h-screen flex items-center justify-center">
        <p className="text-2xl">Loading amazing things...</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-text min-h-screen">
      {/* 1) HERO - simplified hero without window */}
  <div className="container mx-auto px-4 sm:px-6 pt-4 md:pt-6 max-w-4xl">
        <div className="relative flex flex-col items-center text-center gap-3 max-w-[70ch] mx-auto pb-4">
          <StructuredHero 
            role={homeSettings?.featured_role}
            location={homeSettings?.location}
            university={homeSettings?.featured_university}
          />
        </div>
      </div>

  <SectionDivider variant="line" className="my-4 md:my-5" />

  {/* About section removed per request */}

      {/* 4) FEATURED WORK */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-10" id="featured-work">
        <motion.h2 
          className="font-mono text-2xl md:text-3xl leading-100 text-center mb-6 md:mb-8 text-ink"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          Featured Work
        </motion.h2>

        {featuredContent.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {featuredContent.map(item => (
              <motion.div key={item.id} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col items-center">
                <Link to={item.link} className="focus:outline-none">
                  <DesktopIcon label={item.title} src={item.image} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-muted py-6 px-4">
            <p className="text-sm md:text-base">No featured items to display at the moment.</p>
            <p className="text-xs mt-1">You can select items to feature from the Admin Dashboard.</p>
          </div>
        )}
      </div>

      {/* 5) Activity Row */}
      <div className="container mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Currently Building: in-progress projects across all categories */}
          <Window variant="card" className="h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-mono text-sm text-ink">Currently Building</h3>
              <LEDIndicator label="BUILD" color="amber" />
            </div>
            {(() => {
              const inProg = [];
              if (projectsData) {
                for (const cat in projectsData) {
                  (projectsData[cat] || []).forEach(item => {
                    if (item.inProgress) inProg.push({ 
                      title: item.title, 
                      link: item.link || '/projects', 
                      description: item.description || '', 
                      // ensure numeric progress for UI
                      progress: Number.isFinite(Number(item.progress)) ? Number(item.progress) : undefined 
                    });
                  });
                }
              }
              const list = inProg.slice(0, 3);
              return list.length > 0 ? (
                <div>
                  {list.map((p, i) => (
                    <PixelProgress key={i} label={p.title} sublabel={p.description} value={p.progress} to={p.link} />
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No in-progress projects yet.</p>
              );
            })()}
          </Window>

          {/* Recent Blog Posts */}
          <Window variant="card" className="h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-mono text-sm text-ink">Recent Posts</h3>
              <LEDIndicator label="NEW" color="green" />
            </div>
            <TerminalList items={(recentPosts || []).slice(0, 2).map(p => ({
              text: p.title,
              to: `/blog/${p.id}`,
              meta: p.createdAt?.toDate ? new Date(p.createdAt.toDate()).toLocaleDateString() : undefined,
            }))} />
          </Window>

          {/* Interests / Hobbies */}
          <Window variant="card" className="h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-mono text-sm text-ink">Interests</h3>
              <LEDIndicator label="FUN" color="blue" />
            </div>
            <StickerGrid items={homeSettings?.featured_hobbies || []} />
          </Window>
        </div>
      </div>

      <SectionDivider variant="dots" />

      {/* Snapshot + Game row */}
      <div className="container mx-auto px-4 sm:px-6 pb-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <motion.h3 
              className="font-mono text-xl text-ink mb-3 flex items-center gap-3"
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25 }}
            >
              Site Snapshot
              <LEDIndicator label="LIVE" color="green" />
            </motion.h3>
            <CodeCard
              title="Inventory & Links"
              language="JavaScript"
              code={snippetCode}
            />
          </div>
          <div>
            <motion.h3 
              className="font-mono text-xl text-ink mb-3 flex items-center justify-between"
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25 }}
            >
              Play Breakout
              <LEDIndicator label="PLAY" color="amber" />
            </motion.h3>
            <Window variant="card" className="p-3">
              <RetroBreakout />
            </Window>
          </div>
        </div>
      </div>

      {/* Quick Links Dock removed per request */}
    </div>
  );
}
