import { useEffect, useRef, useState } from "react";

/* ─── Custom Cursor ─── */
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const addHover = () => cursor.classList.add("hovering");
    const removeHover = () => cursor.classList.remove("hovering");

    document.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, .service-card, .project-card, .btn-magnetic, .btn-magnetic-outline, .trust-badge").forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      document.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={dotRef} className="custom-cursor-dot hidden md:block" />
    </>
  );
};

/* ─── Scroll Reveal Hook ─── */
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );
    const selectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-clip, .split-line";
    const elements = ref.current?.querySelectorAll(selectors);
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
};

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ─── Ticker ─── */
const Ticker = () => {
  const words = [
    "NIEUWBOUW", "VERBOUW", "RENOVATIE", "VERDUURZAMING",
    "VAKMANSCHAP", "HOFLEVERANCIER", "MAATWERK", "DUURZAAM",
    "NOORD-BRABANT", "PARTICULIER", "ZAKELIJK", "BOUWGARANT",
  ];
  const doubled = [...words, ...words];

  return (
    <div className="overflow-hidden border-y border-border/50 py-6 bg-secondary/30">
      <div className="ticker-track flex whitespace-nowrap">
        {doubled.map((word, i) => (
          <span key={i} className="mx-10 label-caps text-muted-foreground/60 hover:text-gold transition-colors duration-300">
            {word}
            <span className="ml-10 geo-diamond opacity-40" />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Stat Block ─── */
const StatBlock = ({
  value,
  label,
  description,
  delay,
  useCounter,
  counterEnd,
  counterSuffix,
}: {
  value: string;
  label: string;
  description: string;
  delay: string;
  useCounter?: boolean;
  counterEnd?: number;
  counterSuffix?: string;
}) => (
  <div className={`reveal ${delay} group`}>
    <div className="border-l-2 border-gold/30 group-hover:border-gold pl-8 transition-colors duration-500">
      <div className="display-large text-cream">
        {useCounter && counterEnd ? (
          <AnimatedCounter end={counterEnd} suffix={counterSuffix || ""} />
        ) : (
          value
        )}
      </div>
      <div className="mt-3 label-caps text-gold/70">{label}</div>
      <p className="mt-3 text-sm font-sans text-muted-foreground/70 leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  </div>
);

/* ─── Service Card Component ─── */
const ServiceCard = ({
  num,
  title,
  desc,
  features,
  index,
}: {
  num: string;
  title: string;
  desc: string;
  features: string[];
  index: number;
}) => (
  <div className={`reveal stagger-${index + 1} service-card group`}>
    <div className="label-caps text-brick mb-8 flex items-center gap-3">
      <span>{num}</span>
      <span className="w-8 h-px bg-brick/40 group-hover:w-16 transition-all duration-500" />
    </div>
    <h3 className="font-display text-3xl text-cream mb-4 group-hover:text-gold transition-colors duration-500">
      {title}
    </h3>
    <p className="text-sm font-sans text-muted-foreground leading-relaxed mb-6">{desc}</p>
    <ul className="space-y-2">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-xs font-sans text-muted-foreground/60">
          <span className="w-1 h-1 bg-gold/60 rotate-45" />
          {f}
        </li>
      ))}
    </ul>
    <div className="mt-8 flex items-center gap-3 text-xs font-sans font-medium text-brick/0 group-hover:text-brick transition-all duration-500">
      Meer informatie <span className="text-lg">→</span>
    </div>
  </div>
);

/* ─── Project Card ─── */
const ProjectCard = ({
  title,
  location,
  type,
  index,
}: {
  title: string;
  location: string;
  type: string;
  index: number;
}) => (
  <div className="project-card group">
    <div className="project-card-inner">
      {/* Abstract architectural pattern as placeholder */}
      <div className="absolute inset-0 bg-secondary">
        <div className="absolute inset-0 opacity-10">
          {/* Geometric pattern simulating architecture */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[20%] left-[10%] w-[40%] h-[60%] border border-cream/20" />
            <div className="absolute top-[30%] left-[30%] w-[50%] h-[40%] border border-cream/10" />
            <div className="absolute top-[10%] right-[15%] w-[25%] h-[80%] bg-cream/5" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8rem] font-display text-cream/[0.03] select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="project-card-gradient" />
      <div className="project-card-content">
        <div className="label-caps text-gold/60 mb-3">{type}</div>
        <h3 className="font-display text-2xl text-cream mb-2">{title}</h3>
        <p className="text-sm font-sans text-muted-foreground/60">{location}</p>
        <div className="mt-4 flex items-center gap-2 text-xs font-sans text-brick opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Bekijk project <span>→</span>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Trust Badge ─── */
const TrustBadge = ({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) => (
  <div className="trust-badge group">
    <span className="text-2xl">{icon}</span>
    <div>
      <div className="text-xs font-sans font-semibold text-cream tracking-wide">{title}</div>
      <div className="text-[0.65rem] font-sans text-muted-foreground">{subtitle}</div>
    </div>
  </div>
);

/* ─── Testimonial ─── */
const Testimonial = ({ quote, author }: { quote: string; author: string }) => (
  <div className="flex flex-col items-center text-center px-6">
    <div className="text-4xl text-gold/30 font-display mb-4">"</div>
    <p className="body-elegant text-cream/80 italic max-w-lg">{quote}</p>
    <div className="mt-6 label-caps text-muted-foreground/50">— {author}</div>
  </div>
);

/* ═══════════════════════════════════════ */
/* ─── MAIN PAGE ─── */
/* ═══════════════════════════════════════ */
const Index = () => {
  const containerRef = useScrollReveal();
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Testimonial rotation
  const testimonials = [
    { quote: "Ik heb veel geleerd bij Bouwbedrijf van Boxmeer. De sfeer en begeleiding zijn fantastisch.", author: "Stagiair" },
    { quote: "Mocht ik nog maar wat langer blijven. Een geweldig leerbedrijf met echte vakmensen.", author: "Leerling" },
    { quote: "Al snel gaven ze mij het vertrouwen dat ik nodig had om zelfstandig te werken.", author: "Medewerker" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      num: "01",
      title: "Particuliere Nieuwbouw",
      desc: "Van eerste schets tot sleuteloverdracht. Complete nieuwbouwwoningen met oog voor kwaliteit, comfort en duurzaamheid.",
      features: ["Architectuurcoördinatie", "Vergunningsaanvraag", "Materiaaladvies", "Volledige begeleiding"],
    },
    {
      num: "02",
      title: "Bedrijfsmatige Bouw",
      desc: "Professionele bedrijfspanden die voldoen aan de hoogste eisen. Van ontwerp tot oplevering.",
      features: ["Bedrijfshallen", "Kantoorpanden", "Commercieel vastgoed", "Projectmanagement"],
    },
    {
      num: "03",
      title: "Verbouwen & Renovatie",
      desc: "Transformatie van bestaande ruimtes met respect voor de oorspronkelijke structuur en karakter.",
      features: ["Aanbouw & opbouw", "Interieurverbouwing", "Monumentenzorg", "Herstelwerk"],
    },
    {
      num: "04",
      title: "Verduurzaming",
      desc: "Energiezuinig en toekomstbestendig maken van uw pand. Investeer in comfort én waarde.",
      features: ["Isolatie", "Warmtepompen", "Zonnepanelen", "Energielabel verbetering"],
    },
  ];

  const projects = [
    { title: "Moderne Villa", location: "Eindhoven", type: "Particuliere nieuwbouw" },
    { title: "Villa met Slimme Technologie", location: "Venray", type: "Nieuwbouw & techniek" },
    { title: "Moderne Schuurwoning", location: "Eindhoven", type: "Particuliere nieuwbouw" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground relative">
      <CustomCursor />
      <div className="noise-overlay" />
      <div className="vignette" />

      {/* ─── Navigation ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-700 ${
          navScrolled
            ? "py-4 bg-background/90 backdrop-blur-xl border-b border-gold/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 lg:px-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border border-gold/40 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-all duration-500">
              <span className="font-display text-lg text-gold font-bold">VB</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-lg text-cream tracking-tight leading-none">Van Boxmeer</div>
              <div className="text-[0.55rem] font-sans font-medium tracking-[0.25em] text-gold/50 uppercase">Bouwbedrijf · Est. 1920</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {[
              { label: "Diensten", href: "#diensten" },
              { label: "Projecten", href: "#projecten" },
              { label: "Over ons", href: "#over-ons" },
              { label: "Werkwijze", href: "#werkwijze" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="label-caps text-muted-foreground hover:text-cream transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA + Phone */}
          <div className="flex items-center gap-6">
            <a
              href="tel:0413363479"
              className="hidden md:flex items-center gap-2 label-caps text-gold/70 hover:text-gold transition-colors"
            >
              <span className="text-base">✆</span>
              (0413) 36 34 79
            </a>
            <a href="#contact" className="hidden md:block btn-magnetic text-[0.6rem] py-3 px-5">
              Offerte aanvragen
            </a>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2"
            >
              <span className={`w-6 h-px bg-cream transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
              <span className={`w-6 h-px bg-cream transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-6 h-px bg-cream transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-8 bg-background/95 backdrop-blur-xl border-t border-border/50 flex flex-col gap-6">
            {["Diensten", "Projecten", "Over ons", "Werkwijze", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-2xl text-cream hover:text-gold transition-colors"
              >
                {item}
              </a>
            ))}
            <a href="tel:0413363479" className="label-caps text-gold mt-4">
              (0413) 36 34 79
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="min-h-screen flex flex-col justify-end relative pt-32 pb-16 px-6 md:px-12 lg:px-16 overflow-hidden">
        {/* Floating geometric elements */}
        <div className="absolute top-20 right-[10%] w-72 h-72 border border-gold/10 rotate-45 hidden lg:block float-slow" />
        <div className="absolute top-40 right-[20%] w-40 h-40 bg-brick/5 rotate-12 hidden lg:block float-reverse" />
        <div className="absolute top-60 left-[5%] w-24 h-24 border border-brick/10 hidden lg:block float" />
        <div className="absolute bottom-40 left-0 w-1 h-64 geo-line-gold hidden md:block" />
        <div className="absolute top-1/3 right-0 w-1 h-48 geo-line hidden md:block" />

        {/* Large background watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] select-none pointer-events-none">
          <div className="text-[40vw] font-display font-bold text-cream leading-none">VB</div>
        </div>

        {/* Royal Warrant Badge - Top */}
        <div className="reveal stagger-1 absolute top-28 md:top-32 right-6 md:right-12 lg:right-16">
          <div className="flex flex-col items-center p-4 md:p-6 border border-gold/20 bg-background/40 backdrop-blur-sm pulse-glow">
            <span className="text-3xl md:text-4xl royal-crown">👑</span>
            <div className="mt-2 text-[0.5rem] md:text-[0.55rem] font-sans font-bold tracking-[0.3em] text-gold uppercase text-center leading-relaxed">
              Koninklijk<br />Hofleverancier
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="reveal">
          <div className="label-caps text-brick mb-6 flex items-center gap-4">
            <span className="w-12 h-px bg-brick" />
            Bouwbedrijf — Sinds 1920
          </div>
        </div>

        <h1 className="display-hero text-cream reveal stagger-1 max-w-[95vw]">
          Bouwen op<br />
          <span className="italic text-shimmer">vakmanschap</span>
        </h1>

        <div className="mt-16 flex flex-col md:flex-row md:items-end gap-12 reveal stagger-2">
          <p className="max-w-lg body-elegant text-muted-foreground">
            Al meer dan een eeuw het vertrouwde bouwbedrijf van Noord-Brabant.
            Van nieuwbouw tot verduurzaming — met scherp oog voor kwaliteit,
            uitstraling en klantgerichtheid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#contact" className="btn-magnetic">
              Neem contact op
              <span className="text-lg">→</span>
            </a>
            <a href="#projecten" className="btn-magnetic-outline">
              Onze projecten
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 reveal stagger-4 flex flex-col items-center gap-3">
          <div className="label-caps text-muted-foreground/30 text-[0.55rem]">Scroll</div>
          <div className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ─── Ticker ─── */}
      <Ticker />

      {/* ─── Royal Warrant & Trust Section ─── */}
      <section className="py-20 px-6 md:px-12 lg:px-16 border-b border-border/30">
        <div className="reveal flex flex-col items-center text-center mb-12">
          <span className="text-5xl royal-crown mb-4">👑</span>
          <h2 className="font-display text-2xl md:text-3xl text-cream mb-3">
            Bij Koninklijke Beschikking Hofleverancier
          </h2>
          <p className="text-sm font-sans text-muted-foreground max-w-xl">
            Een bijzondere erkenning die staat voor uitzonderlijke kwaliteit, betrouwbaarheid
            en een langdurige staat van dienst.
          </p>
        </div>
        <div className="reveal stagger-2 flex flex-wrap justify-center gap-4">
          <TrustBadge icon="🛡️" title="Bouwgarant" subtitle="Gecertificeerd" />
          <TrustBadge icon="⭐" title="VCA**" subtitle="Veiligheidscertificaat" />
          <TrustBadge icon="🏗️" title="Bouwend Nederland" subtitle="Aangesloten lid" />
          <TrustBadge icon="📋" title="BouwNu" subtitle="Lid" />
          <TrustBadge icon="🎓" title="Erkend Leerbedrijf" subtitle="SBB Gecertificeerd" />
        </div>
      </section>

      {/* ─── Statistics ─── */}
      <section className="py-28 px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl">
          <StatBlock
            value="100+"
            label="Jaar ervaring"
            description="Meer dan een eeuw bouwen aan vertrouwen, kwaliteit en vakmanschap in Noord-Brabant."
            delay="stagger-1"
            useCounter
            counterEnd={100}
            counterSuffix="+"
          />
          <StatBlock
            value="3"
            label="Generaties vakmanschap"
            description="Een familiebedrijf dat kennis en passie van generatie op generatie doorgeeft."
            delay="stagger-2"
            useCounter
            counterEnd={3}
          />
          <StatBlock
            value="2×"
            label="Particulier & Zakelijk"
            description="Zowel droomhuizen voor particulieren als professionele bedrijfspanden — altijd op maat."
            delay="stagger-3"
          />
        </div>
      </section>

      {/* ─── Decorative Divider ─── */}
      <div className="flex justify-center">
        <div className="split-line" />
      </div>

      {/* ─── Services ─── */}
      <section id="diensten" className="py-28 px-6 md:px-12 lg:px-16">
        <div className="reveal mb-20">
          <div className="label-caps text-brick mb-4 flex items-center gap-4">
            <span className="w-12 h-px bg-brick" />
            Wat wij doen
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2 className="display-large text-cream">
              Onze <span className="italic text-brick">diensten</span>
            </h2>
            <p className="max-w-md text-sm font-sans text-muted-foreground leading-relaxed">
              Van het eerste ontwerp tot de sleuteloverdracht — wij begeleiden u persoonlijk
              door elke fase van het bouwproces.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {services.map((service, i) => (
            <ServiceCard key={service.num} {...service} index={i} />
          ))}
        </div>

        <div className="reveal stagger-5 mt-16 flex justify-center">
          <a href="#contact" className="btn-magnetic-outline">
            Bespreek uw project
            <span className="text-lg">→</span>
          </a>
        </div>
      </section>

      {/* ─── Slogan / Quote Section ─── */}
      <section className="py-36 px-6 md:px-12 lg:px-16 border-y border-border/30 relative overflow-hidden">
        {/* Background VB watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
          <div className="text-[30vw] font-display font-bold text-cream">VB</div>
        </div>
        {/* Gold accent lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />

        <div className="reveal-scale text-center relative z-10">
          <div className="text-6xl text-gold/20 font-display mb-6">"</div>
          <blockquote className="display-large text-cream italic max-w-5xl mx-auto">
            Bouwen op vakmanschap,<br />
            bouwen met <span className="text-shimmer">vakmanschap.</span>
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="w-16 h-px bg-gold/30" />
            <span className="geo-diamond opacity-40" />
            <span className="w-16 h-px bg-gold/30" />
          </div>
        </div>
      </section>

      {/* ─── Projects Showcase ─── */}
      <section id="projecten" className="py-28 overflow-hidden">
        <div className="px-6 md:px-12 lg:px-16 mb-16">
          <div className="reveal">
            <div className="label-caps text-brick mb-4 flex items-center gap-4">
              <span className="w-12 h-px bg-brick" />
              Portfolio
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <h2 className="display-large text-cream">
                Recente <span className="italic text-brick">projecten</span>
              </h2>
              <a href="https://bouwbedrijfvanboxmeer.nl/projecten/" className="btn-magnetic-outline py-3 px-5 text-[0.6rem]">
                Alle projecten bekijken
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="reveal stagger-2 horizontal-scroll pb-8">
          {projects.map((project, i) => (
            <ProjectCard key={i} {...project} index={i} />
          ))}
          {/* CTA card */}
          <div className="project-card flex items-center justify-center">
            <div className="project-card-inner flex flex-col items-center justify-center text-center p-10 bg-secondary border border-border/30">
              <div className="text-5xl mb-6 text-gold/30">+</div>
              <h3 className="font-display text-xl text-cream mb-3">Meer projecten</h3>
              <p className="text-xs font-sans text-muted-foreground mb-6">
                Bekijk al onze gerealiseerde projecten
              </p>
              <a href="https://bouwbedrijfvanboxmeer.nl/projecten/" className="label-caps text-brick hover:text-gold transition-colors">
                Bekijk alles →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Werkwijze (Working Method) ─── */}
      <section id="werkwijze" className="py-28 px-6 md:px-12 lg:px-16 border-t border-border/30">
        <div className="reveal mb-20">
          <div className="label-caps text-brick mb-4 flex items-center gap-4">
            <span className="w-12 h-px bg-brick" />
            Werkwijze
          </div>
          <h2 className="display-large text-cream">
            Van plan tot <span className="italic text-brick">realisatie</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {[
            { step: "01", title: "Kennismaking", desc: "Persoonlijk gesprek over uw wensen, ideeën en budget. Wij luisteren en denken actief mee.", icon: "💬" },
            { step: "02", title: "Ontwerp & Advies", desc: "Architectuurcoördinatie, vergunningsaanvraag en materiaaladvies. Alles tot in detail uitgewerkt.", icon: "📐" },
            { step: "03", title: "Uitvoering", desc: "Vakkundige realisatie met onze eigen vakmensen. Continue kwaliteitscontrole op de bouwplaats.", icon: "🏗️" },
            { step: "04", title: "Oplevering", desc: "Grondige eindcontrole en persoonlijke overdracht. Wij staan ook na oplevering voor u klaar.", icon: "🔑" },
          ].map((item, i) => (
            <div key={item.step} className={`reveal stagger-${i + 1} relative group`}>
              {/* Connector line */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
              )}
              <div className="relative z-10">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="label-caps text-gold/50">{item.step}</span>
                  <span className="w-8 h-px bg-gold/20 group-hover:w-16 group-hover:bg-gold/40 transition-all duration-500" />
                </div>
                <h3 className="font-display text-xl text-cream mb-3 group-hover:text-gold transition-colors duration-500">
                  {item.title}
                </h3>
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Decorative Divider ─── */}
      <div className="flex justify-center">
        <div className="split-line" />
      </div>

      {/* ─── Testimonials ─── */}
      <section className="py-28 px-6 md:px-12 lg:px-16 border-t border-border/30">
        <div className="reveal flex flex-col items-center text-center mb-16">
          <div className="label-caps text-brick mb-4">Ervaringen</div>
          <h2 className="display-medium text-cream">
            Wat men zegt over <span className="italic text-brick">ons</span>
          </h2>
        </div>

        <div className="reveal stagger-2 relative min-h-[200px] flex items-center justify-center">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                i === activeTestimonial
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <Testimonial quote={t.quote} author={t.author} />
            </div>
          ))}
        </div>

        {/* Testimonial dots */}
        <div className="flex justify-center gap-3 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`w-2 h-2 rotate-45 transition-all duration-300 ${
                i === activeTestimonial ? "bg-gold scale-125" : "bg-border hover:bg-gold/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─── Over Ons (About) ─── */}
      <section id="over-ons" className="py-28 px-6 md:px-12 lg:px-16 border-t border-border/30 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/50 to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
          <div className="reveal-left">
            <div className="label-caps text-brick mb-4 flex items-center gap-4">
              <span className="w-12 h-px bg-brick" />
              Over ons
            </div>
            <h2 className="display-large text-cream mb-10">
              Meer dan een<br />
              eeuw <span className="italic text-shimmer">ervaring</span>
            </h2>
            <div className="w-48 h-48 border border-gold/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl royal-crown mb-2">👑</div>
                <div className="text-[0.5rem] font-sans font-bold tracking-[0.25em] text-gold/60 uppercase">
                  Hofleverancier
                </div>
              </div>
            </div>
          </div>

          <div className="reveal-right flex flex-col justify-center">
            <p className="body-elegant text-muted-foreground mb-8">
              Bouwbedrijf Van Boxmeer is een all-round bouwbedrijf gevestigd in Veghel,
              in het hart van Noord-Brabant. Al meer dan honderd jaar staan wij voor
              degelijk vakmanschap en persoonlijke service.
            </p>
            <p className="body-elegant text-muted-foreground mb-8">
              Of het nu gaat om een complete nieuwbouwwoning, een ingrijpende verbouwing,
              een zorgvuldige renovatie of het verduurzamen van uw pand — wij leveren maatwerk
              voor zowel particuliere als zakelijke opdrachtgevers.
            </p>
            <p className="body-elegant text-muted-foreground mb-10">
              Met een scherp oog voor kwaliteit, uitstraling en klantgerichtheid begeleiden
              wij u persoonlijk bij elk project. Van de ontwerpfase tot en met de oplevering.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-px bg-gold/30" />
                <span className="label-caps text-muted-foreground/60">
                  Gevestigd in Veghel sinds 1920
                </span>
              </div>
            </div>

            <a href="#contact" className="btn-magnetic mt-10 self-start">
              Meer over ons
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 px-6 md:px-12 lg:px-16 bg-brick relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 41px)`,
          }} />
        </div>

        <div className="reveal relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">
              Klaar om te <span className="italic">bouwen</span>?
            </h2>
            <p className="text-sm font-sans text-cream/70 max-w-lg">
              Plan een vrijblijvend gesprek en ontdek wat Bouwbedrijf Van Boxmeer voor u kan betekenen.
              Meer dan 100 jaar ervaring staat voor u klaar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="tel:0413363479" className="btn-magnetic bg-cream text-charcoal hover:bg-gold hover:text-charcoal">
              Bel direct
              <span className="text-lg">✆</span>
            </a>
            <a href="mailto:info@bouwbedrijfvanboxmeer.nl" className="btn-magnetic-outline border-cream/30 text-cream hover:border-cream hover:text-cream">
              Stuur een e-mail
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section id="contact" className="py-28 px-6 md:px-12 lg:px-16 bg-secondary relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="reveal-left">
            <div className="label-caps text-brick mb-4 flex items-center gap-4">
              <span className="w-12 h-px bg-brick" />
              Contact
            </div>
            <h2 className="display-large text-cream mb-8">
              Laten we<br />
              <span className="italic text-shimmer">bouwen</span>
            </h2>
            <p className="body-elegant text-muted-foreground max-w-md">
              Neem vrijblijvend contact met ons op. Wij bespreken graag
              uw plannen en ideeën — persoonlijk en zonder verplichtingen.
            </p>
          </div>

          <div className="reveal-right flex flex-col justify-end gap-10">
            <div className="group">
              <div className="label-caps text-gold/50 mb-3">Adres</div>
              <div className="font-serif text-xl text-cream leading-relaxed">
                Pastoor Clercxstraat 45<br />
                5465 RE Veghel<br />
                Noord-Brabant
              </div>
            </div>

            <div className="group">
              <div className="label-caps text-gold/50 mb-3">Telefoon</div>
              <a
                href="tel:0413363479"
                className="font-display text-3xl md:text-4xl text-brick hover:text-gold transition-colors duration-500"
              >
                (0413) 36 34 79
              </a>
            </div>

            <div className="group">
              <div className="label-caps text-gold/50 mb-3">E-mail</div>
              <a
                href="mailto:info@bouwbedrijfvanboxmeer.nl"
                className="font-serif text-xl text-cream hover:text-gold underline underline-offset-8 decoration-gold/30 hover:decoration-gold transition-all duration-500"
              >
                info@bouwbedrijfvanboxmeer.nl
              </a>
            </div>

            <div className="group">
              <div className="label-caps text-gold/50 mb-3">Social</div>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/bouwbedrijfvanboxmeer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps text-cream hover:text-gold transition-colors"
                >
                  Facebook
                </a>
                <span className="text-border">·</span>
                <a
                  href="https://www.instagram.com/bouwbedrijfvanboxmeer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps text-cream hover:text-gold transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12 px-6 md:px-12 lg:px-16 border-t border-border/30 bg-background">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-gold/30 flex items-center justify-center">
              <span className="font-display text-sm text-gold font-bold">VB</span>
            </div>
            <div>
              <div className="font-display text-cream">Van Boxmeer</div>
              <div className="text-[0.5rem] font-sans tracking-[0.2em] text-gold/40 uppercase">
                Koninklijk Hofleverancier
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {["Diensten", "Projecten", "Over ons", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-xs font-sans text-muted-foreground/50 hover:text-cream transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href="https://bouwbedrijfvanboxmeer.nl"
              className="text-xs font-sans text-muted-foreground/50 hover:text-cream transition-colors"
            >
              bouwbedrijfvanboxmeer.nl
            </a>
          </div>

          {/* Copyright */}
          <div className="text-[0.6rem] font-sans text-muted-foreground/30 tracking-[0.1em] text-center">
            © {new Date().getFullYear()} Bouwbedrijf Van Boxmeer — Alle rechten voorbehouden
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </footer>
    </div>
  );
};

export default Index;
