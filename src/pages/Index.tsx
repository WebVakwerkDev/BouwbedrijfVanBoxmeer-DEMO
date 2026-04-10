import { useEffect, useRef } from "react";

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
      { threshold: 0.1 }
    );
    const elements = ref.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
};

const Ticker = () => {
  const words = [
    "NIEUWBOUW",
    "VERBOUW",
    "RENOVATIE",
    "VERDUURZAMING",
    "VAKMANSCHAP",
    "NOORD-BRABANT",
    "PARTICULIER",
    "ZAKELIJK",
  ];
  const doubled = [...words, ...words];

  return (
    <div className="overflow-hidden border-y border-border py-5">
      <div className="ticker-track flex whitespace-nowrap">
        {doubled.map((word, i) => (
          <span key={i} className="mx-8 text-sm font-sans font-semibold tracking-[0.3em] text-muted-foreground">
            {word}
            <span className="ml-8 text-brick">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const StatBlock = ({ value, label, delay }: { value: string; label: string; delay: string }) => (
  <div className={`reveal ${delay} border-l border-border pl-6`}>
    <div className="display-large text-cream">{value}</div>
    <div className="mt-2 text-xs font-sans font-medium tracking-[0.25em] uppercase text-muted-foreground">
      {label}
    </div>
  </div>
);

const Index = () => {
  const containerRef = useScrollReveal();

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground relative">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="font-serif text-xl text-cream tracking-tight">
          Van Boxmeer
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground">
          <a href="#diensten" className="hover:text-cream transition-colors">Diensten</a>
          <a href="#over-ons" className="hover:text-cream transition-colors">Over ons</a>
          <a href="#contact" className="hover:text-cream transition-colors">Contact</a>
        </div>
        <a href="tel:0413363479" className="text-xs font-sans font-medium tracking-[0.15em] text-brick hover:text-cream transition-colors">
          (0413) 36 34 79
        </a>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-end relative pt-32 pb-16 px-6 md:px-12">
        {/* Geometric background elements */}
        <div className="absolute top-24 right-12 w-64 h-64 border border-border/30 rotate-45 hidden lg:block" />
        <div className="absolute top-48 right-32 w-32 h-32 bg-brick/10 rotate-12 hidden lg:block" />
        <div className="absolute bottom-32 left-0 w-1 h-48 geo-line hidden md:block" />

        <div className="reveal">
          <div className="text-xs font-sans font-medium tracking-[0.4em] uppercase text-brick mb-6">
            Bouwbedrijf — Sinds 1920
          </div>
        </div>

        <h1 className="display-massive text-cream reveal stagger-1 max-w-[95vw]">
          Bouwen op<br />
          <span className="italic text-brick">vakmanschap</span>
        </h1>

        <div className="mt-12 flex flex-col md:flex-row md:items-end gap-12 reveal stagger-2">
          <p className="max-w-md text-muted-foreground font-sans text-base leading-relaxed">
            Al meer dan een eeuw het vertrouwde bouwbedrijf van Noord-Brabant. 
            Van nieuwbouw tot verduurzaming — met oog voor detail en respect voor het vak.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-brick text-primary-foreground text-xs font-sans font-semibold tracking-[0.2em] uppercase hover:bg-brick-dark transition-colors"
          >
            Neem contact op
            <span className="text-lg">→</span>
          </a>
        </div>
      </section>

      {/* Ticker */}
      <Ticker />

      {/* Statistics */}
      <section className="py-24 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
          <StatBlock value="100+" label="Jaar ervaring" delay="stagger-1" />
          <StatBlock value="N-BR" label="Noord-Brabant" delay="stagger-2" />
          <StatBlock value="2×" label="Particulier & Zakelijk" delay="stagger-3" />
        </div>
      </section>

      {/* Services */}
      <section id="diensten" className="py-24 px-6 md:px-12 border-t border-border">
        <div className="reveal">
          <div className="text-xs font-sans font-medium tracking-[0.4em] uppercase text-brick mb-4">
            Wat wij doen
          </div>
          <h2 className="display-large text-cream mb-16">Onze diensten</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {[
            { num: "01", title: "Nieuwbouw", desc: "Van eerste ontwerp tot sleuteloverdracht. Complete nieuwbouwprojecten met oog voor kwaliteit en duurzaamheid." },
            { num: "02", title: "Verbouw", desc: "Transformatie van bestaande ruimtes. Slim verbouwen met respect voor de oorspronkelijke structuur." },
            { num: "03", title: "Renovatie", desc: "Nieuw leven blazen in bestaande gebouwen. Van klein onderhoud tot complete renovatieprojecten." },
            { num: "04", title: "Verduurzaming", desc: "Energiezuinig en toekomstbestendig bouwen. Isolatie, warmtepompen en duurzame materialen." },
          ].map((service, i) => (
            <div
              key={service.num}
              className={`reveal stagger-${i + 1} group border-l border-border p-8 hover:bg-secondary transition-colors duration-500`}
            >
              <div className="text-xs font-sans text-brick font-semibold tracking-[0.2em] mb-6">
                {service.num}
              </div>
              <h3 className="font-serif text-2xl text-cream mb-4">{service.title}</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                {service.desc}
              </p>
              <div className="mt-6 w-8 h-px bg-brick opacity-0 group-hover:opacity-100 group-hover:w-16 transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* Slogan Section */}
      <section className="py-32 px-6 md:px-12 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="text-[20vw] font-serif text-cream select-none">VB</div>
        </div>
        <div className="reveal text-center relative z-10">
          <blockquote className="display-large text-cream italic max-w-4xl mx-auto">
            "Bouwen op vakmanschap,<br />
            bouwen met <span className="text-brick">vakmanschap.</span>"
          </blockquote>
        </div>
      </section>

      {/* Over ons */}
      <section id="over-ons" className="py-24 px-6 md:px-12 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="reveal">
            <div className="text-xs font-sans font-medium tracking-[0.4em] uppercase text-brick mb-4">
              Over ons
            </div>
            <h2 className="display-large text-cream mb-8">
              Meer dan een<br />eeuw <span className="italic text-brick">ervaring</span>
            </h2>
          </div>
          <div className="reveal stagger-2 flex flex-col justify-end">
            <p className="text-muted-foreground font-sans leading-relaxed mb-6">
              Bouwbedrijf Van Boxmeer is een all-round bouwbedrijf gevestigd in Veghel, 
              in het hart van Noord-Brabant. Al meer dan honderd jaar staan wij voor 
              degelijk vakmanschap en persoonlijke service.
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed mb-6">
              Of het nu gaat om een complete nieuwbouwwoning, een ingrijpende verbouwing, 
              een zorgvuldige renovatie of het verduurzamen van uw pand — wij leveren maatwerk 
              voor zowel particuliere als zakelijke opdrachtgevers.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="w-12 h-px bg-brick" />
              <span className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground">
                Gevestigd in Veghel sinds 1920
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 md:px-12 border-t border-border bg-secondary">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="reveal">
            <div className="text-xs font-sans font-medium tracking-[0.4em] uppercase text-brick mb-4">
              Contact
            </div>
            <h2 className="display-large text-cream mb-8">
              Laten we<br /><span className="italic text-brick">bouwen</span>
            </h2>
          </div>
          <div className="reveal stagger-2 flex flex-col justify-end gap-8">
            <div>
              <div className="text-xs font-sans font-medium tracking-[0.25em] uppercase text-muted-foreground mb-2">
                Adres
              </div>
              <div className="font-sans text-cream">
                Pastoor Clercxstraat 45<br />Veghel, Noord-Brabant
              </div>
            </div>
            <div>
              <div className="text-xs font-sans font-medium tracking-[0.25em] uppercase text-muted-foreground mb-2">
                Telefoon
              </div>
              <a href="tel:0413363479" className="font-serif text-2xl text-brick hover:text-cream transition-colors">
                (0413) 36 34 79
              </a>
            </div>
            <div>
              <div className="text-xs font-sans font-medium tracking-[0.25em] uppercase text-muted-foreground mb-2">
                Website
              </div>
              <a href="https://bouwbedrijfvanboxmeer.nl" className="font-sans text-cream underline underline-offset-4 hover:text-brick transition-colors">
                bouwbedrijfvanboxmeer.nl
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-serif text-cream">Van Boxmeer</div>
        <div className="text-xs font-sans text-muted-foreground tracking-[0.15em]">
          © {new Date().getFullYear()} Bouwbedrijf Van Boxmeer — Alle rechten voorbehouden
        </div>
      </footer>
    </div>
  );
};

export default Index;
