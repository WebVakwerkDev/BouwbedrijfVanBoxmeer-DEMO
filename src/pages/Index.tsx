import { useEffect, useRef, useState } from "react";

/* ─── Scroll Reveal Hook ─── */
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const els = ref.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
};

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 50;
    const inc = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 30);
    return () => clearInterval(timer);
  }, [started, end]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ─── Parallax Hook ─── */
const useParallax = (speed = 0.3) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const y = window.scrollY;
      ref.current.style.transform = `translateY(${y * speed}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return ref;
};

/* ─── Ticker ─── */
const Ticker = () => {
  const words = ["NIEUWBOUW", "VERBOUW", "RENOVATIE", "VERDUURZAMING", "VAKMANSCHAP", "NOORD-BRABANT", "MAATWERK", "DUURZAAM"];
  const doubled = [...words, ...words];
  return (
    <div className="overflow-hidden border-y border-border py-5 bg-cream-dark/50">
      <div className="ticker-track flex whitespace-nowrap">
        {doubled.map((word, i) => (
          <span key={i} className="mx-10 label-caps text-muted-foreground/80">
            {word}
            <span className="ml-10 inline-block w-1.5 h-1.5 bg-brick/60 rotate-45" />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════ */
/*               MAIN PAGE                */
/* ═══════════════════════════════════════ */
const Index = () => {
  const containerRef = useScrollReveal();
  const parallaxRef = useParallax(0.25);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ naam: "", email: "", telefoon: "", bericht: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const projects = [
    { title: "Moderne Villa", location: "Eindhoven", type: "Particuliere nieuwbouw", img: "/images/villa-eindhoven.jpg" },
    { title: "Villa met Slimme Technologie", location: "Venray", type: "Nieuwbouw", img: "/images/villa-venray.jpg" },
    { title: "Moderne Schuurwoning", location: "Eindhoven", type: "Nieuwbouw", img: "/images/schuurwoning-eindhoven.jpg" },
    { title: "Authentieke Langgevelboerderij", location: "Veghel", type: "Nieuwbouw", img: "/images/langgevelboerderij-veghel.jpg" },
    { title: "Schuurwoning", location: "Sint-Oedenrode", type: "Nieuwbouw", img: "/images/schuurwoning-roede.jpg" },
    { title: "Modern Woonhuis", location: "Venray", type: "Nieuwbouw", img: "/images/woonhuis-venray.jpg" },
    { title: "Herenhuis", location: "Drunen", type: "Nieuwbouw", img: "/images/herenhuis-drunen.jpg" },
    { title: "Woonhuis met Rieten Kap", location: "Mierlo", type: "Nieuwbouw", img: "/images/rieten-kap-mierlo.jpg" },
    { title: "Verbouwing Woonboerderij", location: "Zijtaart", type: "Verbouw & Verduurzaming", img: "/images/woonboerderij-zijtaart.jpg" },
    { title: "Landelijke Woonboerderij", location: "Sint-Oedenrode", type: "Nieuwbouw", img: "/images/woonboerderij-roede.jpg" },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground">

      {/* ─── Navigation ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        navScrolled
          ? "py-3 bg-warm-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "py-5 bg-transparent"
      }`}>
        <div className="flex items-center justify-between px-6 md:px-12 lg:px-20">
          <a href="#" className="flex items-center gap-3 group">
            <img
              src="/images/logo.png"
              alt="Bouwbedrijf Van Boxmeer"
              className={`h-9 w-auto rounded-sm transition-all duration-300 group-hover:scale-105 ${
                navScrolled ? "nav-logo-light" : ""
              }`}
            />
            <div className="hidden sm:block">
              <div className={`font-brand italic font-bold text-xl tracking-wide leading-none transition-colors ${navScrolled ? "text-charcoal" : "text-white"}`}>
                VAN BOXMEER
              </div>
              <div className={`text-[0.5rem] font-sans font-medium tracking-[0.25em] uppercase mt-0.5 transition-colors ${navScrolled ? "text-muted-foreground" : "text-white/80"}`}>
                Bouwbedrijf · Veghel
              </div>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-10">
            {[
              { label: "Over ons", href: "#over-ons" },
              { label: "Diensten", href: "#diensten" },
              { label: "Projecten", href: "#projecten" },
              { label: "Werkwijze", href: "#werkwijze" },
              { label: "Contact", href: "#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`nav-link label-caps transition-colors ${navScrolled ? "text-muted-foreground hover:text-brick" : "text-white/85 hover:text-white"}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <a href="tel:0413363479" className={`hidden md:flex items-center gap-2 label-caps transition-colors ${navScrolled ? "text-brick" : "text-white/90"}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (0413) 36 34 79
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2"
              aria-label="Menu"
            >
              <span className={`w-6 h-px transition-all duration-300 ${navScrolled ? "bg-charcoal" : "bg-white"} ${mobileMenuOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
              <span className={`w-6 h-px transition-all duration-300 ${navScrolled ? "bg-charcoal" : "bg-white"} ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-6 h-px transition-all duration-300 ${navScrolled ? "bg-charcoal" : "bg-white"} ${mobileMenuOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-6 py-8 bg-warm-white border-t border-border flex flex-col gap-5">
            {["Over ons", "Diensten", "Projecten", "Werkwijze", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMobileMenuOpen(false)}
                className="font-display text-xl text-charcoal hover:text-brick transition-colors">{item}</a>
            ))}
            <a href="tel:0413363479" className="label-caps text-brick mt-2">(0413) 36 34 79</a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-0 scale-110">
          <img
            src="/images/hero-home.jpg"
            alt="Bouwbedrijf Van Boxmeer project"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-20 pt-32">
          <div className="reveal">
            <div className="label-caps text-white/80 mb-6 flex items-center gap-3">
              <span className="w-10 h-px bg-white/60" />
              Al meer dan 100 jaar
            </div>
          </div>

          <h1 className="display-hero text-white reveal stagger-1 max-w-5xl">
            Bouwen op<br />
            <span className="italic hero-accent">vakmanschap</span>
          </h1>

          <div className="mt-12 flex flex-col md:flex-row md:items-end gap-10 reveal stagger-2">
            <p className="max-w-lg body-elegant text-white/85">
              Bouwbedrijf Van Boxmeer is een allround bouwbedrijf. Al meer dan een eeuw lang.
              Met onze persoonlijke aanpak werken wij dagelijks aan gevarieerde bouwprojecten
              in Noord-Brabant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-primary">
                Neem contact op <span className="text-lg">&#8594;</span>
              </a>
              <a href="#projecten" className="btn-outline-light">
                Onze projecten
              </a>
            </div>
          </div>

          {/* Hofleverancier badge */}
          <div className="reveal stagger-3 mt-14 flex items-center gap-4 py-4 px-6 hofleverancier-badge w-fit">
            <img
              src="/images/wapen.png"
              alt="Koninklijk Hofleverancier"
              className="h-11 w-auto"
            />
            <div>
              <div className="text-xs font-sans font-semibold text-white tracking-wide">Bij Koninklijke Beschikking</div>
              <div className="text-[0.6rem] font-sans text-white/80 tracking-wider">Hofleverancier sinds 2022</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-gentle-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/40" />
          <div className="w-1.5 h-1.5 bg-white/50 rotate-45" />
        </div>
      </section>

      {/* ─── Ticker ─── */}
      <Ticker />

      {/* ─── Kerncijfers ─── */}
      <section className="py-28 px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {[
            { value: "100+", animated: true, end: 100, suffix: "+", label: "Jaar ervaring", desc: "Opgericht in 1922 door Hein van Boxmeer" },
            { value: "3", animated: false, end: 3, suffix: "", label: "Generaties vakmanschap", desc: "Van Opa Hein tot Willy van Boxmeer" },
            { value: "4", animated: false, end: 4, suffix: "", label: "Vakgebieden", desc: "Nieuwbouw, verbouw, renovatie & verduurzaming" },
            { value: "1922", animated: false, end: 0, suffix: "", label: "Sinds", desc: "Koninklijk Hofleverancier sinds 2022" },
          ].map((stat, i) => (
            <div key={stat.label} className={`reveal stagger-${i + 1}`}>
              <div className="stat-card border-l-2 border-brick/30 pl-6 hover:border-brick transition-colors duration-500">
                <div className="display-large text-charcoal">
                  {stat.animated ? <AnimatedCounter end={stat.end} suffix={stat.suffix} /> : stat.value}
                </div>
                <div className="mt-2 label-caps text-brick">{stat.label}</div>
                <p className="mt-2 text-sm font-sans text-muted-foreground">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Over Ons ─── */}
      <section id="over-ons" className="py-28 px-6 md:px-12 lg:px-20 bg-cream-dark/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          <div className="reveal-left relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-brick/20" />
            <img
              src="/images/100-jaar.jpg"
              alt="Bouwbedrijf Van Boxmeer 100 jaar"
              className="w-full h-auto object-cover relative z-10"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-brick/20" />
          </div>
          <div className="reveal-right">
            <div className="label-caps text-brick mb-4 flex items-center gap-3">
              <span className="section-divider" />
              Over ons
            </div>
            <h2 className="display-large text-charcoal mb-8">
              Meer dan een eeuw <span className="italic">vakmanschap</span>
            </h2>
            <p className="body-elegant text-muted-foreground mb-6">
              Of het nu gaat om particuliere of bedrijfsmatige bouw. Om complete nieuwbouw-
              of kleinere verbouw- en renovatieprojecten. Ons professionele en veelzijdige
              team zet zich voor elke klus vol in.
            </p>
            <p className="body-elegant text-muted-foreground mb-6">
              In 1908 begon Hein van Boxmeer op twaalfjarige leeftijd in de
              timmerwerkplaats van zijn vader in Uden. In 1922 nam hij het bedrijf
              van zijn werkgever Gerard Willems over. Sindsdien is het bedrijf
              binnen de familie gebleven. Van Opa Hein, via Papa Theo en Oom Jo,
              tot de broers Toine en Willy.
            </p>
            <p className="body-elegant text-muted-foreground mb-8">
              Op 1 juli 2022 vierden we ons 100-jarig bestaan. Op deze feestelijke
              dag nam Willy ook het Predikaat Hofleverancier in ontvangst van de
              burgemeester. Een erkenning voor uitzonderlijke kwaliteit en een
              langdurige staat van dienst.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-border">
              {[
                { value: "Vakmanschap", icon: "M11.42 15.17l-1.56-2.62a1 1 0 00-.85-.5H5.42a1 1 0 00-.85.5L3 15.17" },
                { value: "Vertrouwen", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                { value: "Toegankelijkheid", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
                { value: "Ontzorging", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              ].map((item) => (
                <div key={item.value} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-brick flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <span className="text-sm font-sans font-medium text-charcoal">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="section-divider" />
              <span className="label-caps text-muted-foreground">Gevestigd in Veghel</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Diensten ─── */}
      <section id="diensten" className="py-28 px-6 md:px-12 lg:px-20">
        <div className="reveal mb-16 max-w-7xl mx-auto">
          <div className="label-caps text-brick mb-4 flex items-center gap-3">
            <span className="section-divider" />
            Wat wij doen
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="display-large text-charcoal">Onze <span className="italic">diensten</span></h2>
            <p className="max-w-md text-sm font-sans text-muted-foreground leading-relaxed">
              Hoe groot of klein uw project ook is: met Bouwbedrijf Van Boxmeer
              kiest u voor het beste in bouwtechniek, materialen en afwerking.
              Voor een resultaat dat staat als een huis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-7xl mx-auto">
          {[
            {
              title: "Nieuwbouw Particulier",
              desc: "Complete nieuwbouwwoningen van ontwerp tot sleuteloverdracht. Wij denken al in de ontwerpfase mee: van architect tot vergunning, van materialen tot ruimte-indeling.",
              img: "/images/villa-eindhoven.jpg",
            },
            {
              title: "Bedrijfsmatige Bouw",
              desc: "Professionele bedrijfspanden die voldoen aan de hoogste eisen. Van bedrijfshallen tot kantoorpanden, altijd op maat en binnen budget.",
              img: "/images/team-foto.jpg",
            },
            {
              title: "Verbouwen & Renovatie",
              desc: "Van kleinere verbouwprojecten tot complete renovaties. Met respect voor het oorspronkelijke karakter en oog voor de details.",
              img: "/images/woonboerderij-zijtaart.jpg",
            },
            {
              title: "Verduurzaming",
              desc: "Energiezuinig en toekomstbestendig maken van uw pand. Wij adviseren over isolatie, warmtepompen en zonnepanelen.",
              img: "/images/verduurzaming.jpg",
            },
          ].map((service, i) => (
            <div key={service.title} className={`reveal stagger-${(i % 2) + 1} service-card group`}>
              <div className="relative h-72 overflow-hidden">
                <img src={service.img} alt={service.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="service-card-overlay absolute inset-0" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-xl text-white">{service.title}</h3>
                </div>
              </div>
              <div className="p-6 bg-white border border-border border-t-0 group-hover:border-brick/20 transition-colors duration-500">
                <p className="text-sm font-sans text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Quote / Slogan ─── */}
      <section className="py-32 px-6 md:px-12 lg:px-20 bg-charcoal text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <img src="/images/hero-home.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brick/30 to-transparent" />
        <div className="reveal-scale relative z-10">
          <div className="mb-8">
            <svg className="w-10 h-10 mx-auto text-brick/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          <blockquote className="font-brand italic font-bold text-white max-w-4xl mx-auto leading-tight text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase">
            Bouwen op vakmanschap,<br />
            bouwen met <span className="hero-accent">vakmanschap.</span>
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-white/40" />
            <span className="label-caps text-white/70">Bouwbedrijf Van Boxmeer</span>
            <span className="w-12 h-px bg-white/40" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brick/30 to-transparent" />
      </section>

      {/* ─── Projecten ─── */}
      <section id="projecten" className="py-28">
        <div className="px-6 md:px-12 lg:px-20 mb-14">
          <div className="reveal max-w-7xl mx-auto">
            <div className="label-caps text-brick mb-4 flex items-center gap-3">
              <span className="section-divider" />
              Portfolio
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="display-large text-charcoal">Recente <span className="italic">projecten</span></h2>
              <a href="https://bouwbedrijfvanboxmeer.nl/projecten/" target="_blank" rel="noopener noreferrer" className="btn-outline group">
                Alle projecten bekijken <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&#8594;</span>
              </a>
            </div>
          </div>
        </div>

        <div className="reveal stagger-2 horizontal-scroll pb-6 pl-6 md:pl-12 lg:pl-20">
          {projects.map((project, i) => (
            <div key={i} className="project-card flex-shrink-0 w-[340px] md:w-[420px] group">
              <div className="relative h-[300px] md:h-[350px] overflow-hidden">
                <img src={project.img} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 text-[0.6rem] font-sans font-semibold tracking-widest uppercase bg-white/15 backdrop-blur-sm border border-white/20 text-white">
                    {project.type}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-xl text-white mb-1">{project.title}</h3>
                  <div className="flex items-center gap-2 text-white/80">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs font-sans">{project.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Werkwijze ─── */}
      <section id="werkwijze" className="py-28 px-6 md:px-12 lg:px-20 bg-cream-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-16">
            <div className="label-caps text-brick mb-4 flex items-center gap-3">
              <span className="section-divider" />
              Onze werkwijze
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="display-large text-charcoal">
                Van idee tot <span className="italic">realisatie</span>
              </h2>
              <p className="max-w-md text-sm font-sans text-muted-foreground leading-relaxed">
                Al in de ontwerpfase leveren wij een belangrijke bijdrage. Wij lopen
                samen met u het hele project van voor naar achter door, zodat wij tijdens
                de bouw niets over het hoofd zien.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Timeline connector line */}
            <div className="hidden lg:block absolute top-[42px] left-0 right-0 h-px bg-gradient-to-r from-brick/5 via-brick/20 to-brick/5" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { step: "01", title: "Kennismaking", desc: "Een persoonlijk gesprek over uw wensen, ideeën en budget. Wij luisteren en denken actief mee over de mogelijkheden." },
                { step: "02", title: "Ontwerp & Advies", desc: "Architectuurcoördinatie, vergunningsaanvraag en materiaaladvies. Alles wordt tot in detail uitgewerkt." },
                { step: "03", title: "Uitvoering", desc: "Vakkundige realisatie met onze eigen vakmensen. Continue kwaliteitscontrole gedurende het hele bouwproces." },
                { step: "04", title: "Oplevering", desc: "Grondige eindcontrole en persoonlijke overdracht. Ook na oplevering staan wij voor u klaar." },
              ].map((item, i) => (
                <div key={item.step} className={`reveal stagger-${i + 1} group relative`}>
                  {/* Timeline dot */}
                  <div className="hidden lg:flex absolute -top-0 left-6 w-5 h-5 items-center justify-center">
                    <div className="w-3 h-3 bg-cream-dark border-2 border-brick/30 rotate-45 group-hover:border-brick group-hover:bg-brick/10 transition-all duration-500" />
                  </div>
                  <div className="pt-10 lg:pt-12">
                    <div className="text-5xl font-display text-brick/10 font-bold mb-3 group-hover:text-brick/20 transition-colors duration-500">{item.step}</div>
                    <h3 className="font-display text-xl text-charcoal mb-3 group-hover:text-brick transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm font-sans text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Voordelen ─── */}
      <section className="py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="reveal-left">
            <div className="label-caps text-brick mb-4 flex items-center gap-3">
              <span className="section-divider" />
              Waarom Van Boxmeer
            </div>
            <h2 className="display-large text-charcoal mb-10">
              De voordelen van <span className="italic">ons bouwteam</span>
            </h2>

            <div className="space-y-6">
              {[
                { title: "Persoonlijke aanpak", desc: "Eén vast aanspreekpunt dat u door het gehele bouwproces begeleidt." },
                { title: "Heldere planning", desc: "Transparante tijdlijnen en duidelijke communicatie bij elke fase." },
                { title: "Kwaliteitsmaterialen", desc: "Wij werken uitsluitend met de beste materialen en technieken." },
                { title: "Efficiënt bouwteam", desc: "Alle disciplines samengebracht voor een soepel verlopend project." },
                { title: "Professionele afwerking", desc: "Vakmanschap tot in het kleinste detail, zoals u mag verwachten." },
                { title: "Realistische prijzen", desc: "Passende en eerlijke prijzen, zonder verrassingen achteraf." },
              ].map((item, i) => (
                <div key={item.title} className={`reveal stagger-${Math.min(i + 1, 6)} flex gap-4 group`}>
                  <div className="mt-1 flex-shrink-0 w-6 h-6 flex items-center justify-center border border-brick/20 group-hover:border-brick group-hover:bg-brick/5 transition-all duration-300">
                    <svg className="w-3 h-3 text-brick" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-charcoal group-hover:text-brick transition-colors duration-300">{item.title}</h4>
                    <p className="text-sm font-sans text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-right relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="/images/vakman-stock.jpg" alt="Vakman aan het werk" className="w-full h-48 object-cover" loading="lazy" />
                <img src="/images/villa-venray.jpg" alt="Villa project" className="w-full h-64 object-cover" loading="lazy" />
              </div>
              <div className="space-y-4 pt-8">
                <img src="/images/woonboerderij-roede.jpg" alt="Woonboerderij project" className="w-full h-64 object-cover" loading="lazy" />
                <img src="/images/herenhuis-drunen.jpg" alt="Herenhuis project" className="w-full h-48 object-cover" loading="lazy" />
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-b-2 border-l-2 border-brick/15" />
          </div>
        </div>
      </section>

      {/* ─── Certificeringen ─── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-y border-border bg-white">
        <div className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="label-caps text-muted-foreground mb-2">Gecertificeerd & Erkend</div>
            <p className="text-sm font-sans text-muted-foreground">Kwaliteit waar u op kunt vertrouwen</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            <img src="/images/cert-bouwgarant.png" alt="Bouwgarant" className="cert-logo" />
            <img src="/images/cert-vca.png" alt="VCA 2 ster" className="cert-logo h-14" />
            <img src="/images/cert-bouwendnl.png" alt="Bouwend Nederland" className="cert-logo" />
            <img src="/images/cert-bouwnu.png" alt="BouwNu" className="cert-logo" />
            <img src="/images/cert-sbb.png" alt="SBB Erkend Leerbedrijf" className="cert-logo" />
            <img src="/images/cert-ondernemers.png" alt="Ondernemersvereniging" className="cert-logo" />
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/team-foto.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/85" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brick/30 to-transparent" />
        <div className="reveal relative z-10 max-w-4xl mx-auto text-center">
          <div className="label-caps text-white/70 mb-6">(Ver)bouwplannen?</div>
          <h2 className="display-large text-white mb-6">
            Klaar om te <span className="italic hero-accent">bouwen</span>?
          </h2>
          <p className="body-elegant text-white/85 max-w-xl mx-auto mb-10">
            Overweegt u een nieuwbouwproject, verbouwing of renovatie? Het liefst
            denken wij in een vroeg stadium met u mee. Neem vrijblijvend contact op.
            Meer dan 100 jaar ervaring staat voor u klaar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0413363479" className="btn-primary bg-white text-charcoal hover:bg-cream hover:shadow-lg">
              Bel ons direct
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <a href="#contact" className="btn-outline-light">
              Stuur een bericht <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&#8594;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section id="contact" className="py-28 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="reveal-left">
            <div className="label-caps text-brick mb-4 flex items-center gap-3">
              <span className="section-divider" />
              Contact
            </div>
            <h2 className="display-large text-charcoal mb-6">
              Laten we <span className="italic">bouwen</span>
            </h2>
            <p className="body-elegant text-muted-foreground max-w-md mb-10">
              Neem vrijblijvend contact met ons op. Wij bespreken graag
              uw plannen en ideeën, persoonlijk en zonder verplichtingen.
            </p>

            <div className="space-y-8">
              <div className="group">
                <div className="label-caps text-muted-foreground mb-2">Adres</div>
                <div className="font-sans text-lg text-charcoal leading-relaxed">
                  Pastoor Clercxstraat 45<br />5465 RE Veghel, Noord-Brabant
                </div>
              </div>
              <div className="group">
                <div className="label-caps text-muted-foreground mb-2">Telefoon</div>
                <a href="tel:0413363479" className="font-display text-2xl md:text-3xl text-brick hover:text-brick-dark transition-colors">
                  (0413) 36 34 79
                </a>
              </div>
              <div className="group">
                <div className="label-caps text-muted-foreground mb-2">E-mail</div>
                <a href="mailto:info@bouwbedrijfvanboxmeer.nl"
                  className="font-sans text-lg text-charcoal underline underline-offset-4 decoration-brick/30 hover:decoration-brick transition-all">
                  info@bouwbedrijfvanboxmeer.nl
                </a>
              </div>
              <div>
                <div className="label-caps text-muted-foreground mb-3">Volg ons</div>
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/bouwbedrijfvanboxmeer" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-brick hover:bg-brick/5 transition-all duration-300">
                    <svg className="w-4 h-4 text-charcoal" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/bouwbedrijfvanboxmeer/" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-brick hover:bg-brick/5 transition-all duration-300">
                    <svg className="w-4 h-4 text-charcoal" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal-right">
            <div className="bg-white border border-border p-8 md:p-10">
              <h3 className="font-display text-2xl text-charcoal mb-2">Stuur ons een bericht</h3>
              <p className="text-sm font-sans text-muted-foreground mb-8">Wij nemen zo snel mogelijk contact met u op.</p>

              {formSubmitted ? (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-brick/10 border border-brick/20">
                    <svg className="w-6 h-6 text-brick" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-display text-xl text-charcoal mb-2">Bericht verzonden</h4>
                  <p className="text-sm font-sans text-muted-foreground">Wij nemen zo snel mogelijk contact met u op.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div>
                    <label className="label-caps text-muted-foreground mb-2 block text-[0.6rem]">Naam *</label>
                    <input
                      type="text"
                      required
                      value={formData.naam}
                      onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                      className="w-full px-4 py-3 bg-cream/50 border border-border text-charcoal font-sans text-sm focus:outline-none focus:border-brick transition-colors"
                      placeholder="Uw volledige naam"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label-caps text-muted-foreground mb-2 block text-[0.6rem]">E-mail *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-cream/50 border border-border text-charcoal font-sans text-sm focus:outline-none focus:border-brick transition-colors"
                        placeholder="uw@email.nl"
                      />
                    </div>
                    <div>
                      <label className="label-caps text-muted-foreground mb-2 block text-[0.6rem]">Telefoon</label>
                      <input
                        type="tel"
                        value={formData.telefoon}
                        onChange={(e) => setFormData({ ...formData, telefoon: e.target.value })}
                        className="w-full px-4 py-3 bg-cream/50 border border-border text-charcoal font-sans text-sm focus:outline-none focus:border-brick transition-colors"
                        placeholder="06 - 1234 5678"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-caps text-muted-foreground mb-2 block text-[0.6rem]">Bericht *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.bericht}
                      onChange={(e) => setFormData({ ...formData, bericht: e.target.value })}
                      className="w-full px-4 py-3 bg-cream/50 border border-border text-charcoal font-sans text-sm focus:outline-none focus:border-brick transition-colors resize-none"
                      placeholder="Vertel ons over uw project of vraag..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">
                    Verstuur bericht
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Map ─── */}
      <section className="h-[350px] relative border-t border-border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.5!2d5.5363!3d51.6105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c6e9a8f1a8c5e7%3A0x4c0a5f0c8c5b4a0!2sPastoor%20Clercxstraat%2045%2C%205465%20RE%20Veghel!5e0!3m2!1snl!2snl!4v1712700000000"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(30%) contrast(1.05)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bouwbedrijf Van Boxmeer locatie"
        />
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm border border-border px-5 py-4 shadow-sm">
          <div className="font-display text-charcoal text-sm">Bouwbedrijf Van Boxmeer</div>
          <div className="text-xs font-sans text-muted-foreground mt-1">Pastoor Clercxstraat 45, Veghel</div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-16 px-6 md:px-12 lg:px-20 bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src="/images/logo.png" alt="Bouwbedrijf Van Boxmeer" className="h-9 w-auto rounded-sm" />
                <div>
                  <div className="font-brand italic font-bold text-white text-lg tracking-wide">VAN BOXMEER</div>
                  <div className="text-[0.5rem] font-sans text-white/70 tracking-[0.15em] uppercase">Koninklijk Hofleverancier</div>
                </div>
              </div>
              <p className="text-sm font-sans text-white/70 leading-relaxed">
                Al meer dan een eeuw uw allround bouwbedrijf in het hart van Noord-Brabant.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <div className="label-caps text-white/60 mb-5 text-[0.6rem]">Navigatie</div>
              <div className="space-y-3">
                {["Over ons", "Diensten", "Projecten", "Werkwijze", "Contact"].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="block text-sm font-sans text-white/70 hover:text-white transition-colors">{item}</a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <div className="label-caps text-white/60 mb-5 text-[0.6rem]">Diensten</div>
              <div className="space-y-3">
                {["Nieuwbouw Particulier", "Bedrijfsmatige Bouw", "Verbouwen & Renovatie", "Verduurzaming"].map((item) => (
                  <span key={item} className="block text-sm font-sans text-white/70">{item}</span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="label-caps text-white/60 mb-5 text-[0.6rem]">Contact</div>
              <div className="space-y-3 text-sm font-sans text-white/70">
                <div>Pastoor Clercxstraat 45<br />5465 RE Veghel</div>
                <a href="tel:0413363479" className="block hover:text-white transition-colors">(0413) 36 34 79</a>
                <a href="mailto:info@bouwbedrijfvanboxmeer.nl" className="block hover:text-white transition-colors">info@bouwbedrijfvanboxmeer.nl</a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[0.6rem] font-sans text-white/60 tracking-[0.1em]">
              &copy; {new Date().getFullYear()} Bouwbedrijf Van Boxmeer. Alle rechten voorbehouden.
            </div>
            <div className="flex gap-6">
              <a href="https://www.facebook.com/bouwbedrijfvanboxmeer" target="_blank" rel="noopener noreferrer"
                className="text-xs font-sans text-white/60 hover:text-white transition-colors">Facebook</a>
              <a href="https://www.instagram.com/bouwbedrijfvanboxmeer/" target="_blank" rel="noopener noreferrer"
                className="text-xs font-sans text-white/60 hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
