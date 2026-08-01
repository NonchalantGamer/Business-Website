import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

const ANIM = {
  entry: {
    initial: { opacity: 0, y: -18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  activeSpring: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  },
  linkHover: {
    rest: { y: 0 },
    hover: { y: -2 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  mobileMenu: {
    initial: { opacity: 0, y: -14, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
        when: 'beforeChildren',
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -12,
      scale: 0.98,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
  },
  mobileItem: {
    initial: { opacity: 0, y: -8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
    },
  },
  microScale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 380, damping: 24 },
  },
};

function cn(...classNames) {
  return classNames.filter(Boolean).join(' ');
}

export default function AnimatedNavbar({
  logo = 'Nebula',
  activePath = '/',
  onNavigate,
  ctaLabel = 'Start Free',
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  const resolvedActive = useMemo(() => {
    const fromPath = NAV_ITEMS.find((item) => item.href === activePath);
    return fromPath?.label || activeItem;
  }, [activeItem, activePath]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [isMobileOpen]);

  const handleLinkClick = (item) => {
    setActiveItem(item.label);
    setIsMobileOpen(false);
    if (typeof onNavigate === 'function') {
      onNavigate(item);
    }
  };

  return (
    <motion.header
      initial={ANIM.entry.initial}
      animate={ANIM.entry.animate}
      transition={ANIM.entry.transition}
      className="fixed inset-x-0 top-0 z-50"
    >
      <motion.nav
        animate={{
          paddingTop: isScrolled ? '0.6rem' : '0.95rem',
          paddingBottom: isScrolled ? '0.6rem' : '0.95rem',
          boxShadow: isScrolled
            ? '0 12px 36px rgba(2, 8, 23, 0.35)'
            : '0 0 0 rgba(0, 0, 0, 0)',
          backgroundColor: isScrolled
            ? 'rgba(2, 6, 23, 0.62)'
            : 'rgba(2, 6, 23, 0.08)',
          borderColor: isScrolled
            ? 'rgba(148, 163, 184, 0.22)'
            : 'rgba(148, 163, 184, 0.08)',
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto mt-3 w-[min(1120px,calc(100%-1.5rem))] rounded-2xl border backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-4 md:px-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-50"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-900">
              N
            </span>
            <span>{logo}</span>
          </a>

          <ul className="relative hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = resolvedActive === item.label;

              return (
                <li key={item.label} className="relative">
                  <motion.a
                    href={item.href}
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                    variants={ANIM.linkHover}
                    transition={ANIM.linkHover.transition}
                    onClick={(event) => {
                      if (typeof onNavigate === 'function') {
                        event.preventDefault();
                      }
                      handleLinkClick(item);
                    }}
                    className={cn(
                      'relative inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium',
                      isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                    )}
                  >
                    <span className="relative z-20">{item.label}</span>

                    {isActive ? (
                      <motion.span
                        layoutId="active-nav-pill"
                        transition={ANIM.activeSpring}
                        className="absolute inset-0 z-10 rounded-full bg-white/10"
                      />
                    ) : null}

                    <motion.span
                      className="absolute bottom-1 left-1/2 h-[2px] w-[70%] -translate-x-1/2 origin-center rounded-full bg-cyan-300"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </motion.a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <motion.button
              type="button"
              {...ANIM.microScale}
              className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              {ctaLabel}
            </motion.button>

            <motion.button
              type="button"
              aria-label="Open profile"
              {...ANIM.microScale}
              className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white"
            >
              JD
            </motion.button>
          </div>

          <motion.button
            type="button"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((value) => !value)}
            className="relative inline-flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 md:hidden"
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={isMobileOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute h-0.5 w-5 rounded-full bg-white"
            />
            <motion.span
              animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="absolute h-0.5 w-5 rounded-full bg-white"
            />
            <motion.span
              animate={isMobileOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute h-0.5 w-5 rounded-full bg-white"
            />
          </motion.button>
        </div>

        <AnimatePresence>
          {isMobileOpen ? (
            <motion.div
              key="mobile-menu"
              variants={ANIM.mobileMenu}
              initial="initial"
              animate="animate"
              exit="exit"
              className="overflow-hidden border-t border-white/10 px-4 pb-4 pt-3 md:hidden"
            >
              <ul className="grid gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = resolvedActive === item.label;

                  return (
                    <motion.li key={item.label} variants={ANIM.mobileItem}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          if (typeof onNavigate === 'function') {
                            event.preventDefault();
                          }
                          handleLinkClick(item);
                        }}
                        className={cn(
                          'relative block rounded-xl px-3 py-2.5 text-sm font-medium',
                          isActive ? 'text-white' : 'text-slate-300'
                        )}
                      >
                        {isActive ? (
                          <motion.span
                            layoutId="active-nav-pill"
                            transition={ANIM.activeSpring}
                            className="absolute inset-0 rounded-xl bg-white/10"
                          />
                        ) : null}
                        <span className="relative z-10">{item.label}</span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                variants={ANIM.mobileItem}
                className="mt-3 flex items-center gap-2"
              >
                <motion.button
                  type="button"
                  {...ANIM.microScale}
                  className="flex-1 rounded-full bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950"
                >
                  {ctaLabel}
                </motion.button>
                <motion.button
                  type="button"
                  aria-label="Open profile"
                  {...ANIM.microScale}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white"
                >
                  JD
                </motion.button>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
