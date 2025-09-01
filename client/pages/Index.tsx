import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Index() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(["hero-content"]));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const observeElements = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections(prev => new Set([...prev, entry.target.id]));
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll('[data-animate]').forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    };

    window.addEventListener('scroll', handleScroll);
    const cleanup = observeElements();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cleanup();
    };
  }, []);

  // Logo SVG component
  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-fresh-green">
          <path
            d="M20 5c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z"
            fill="currentColor"
            className="opacity-90"
          />
          <path
            d="M20 8c6.627 0 12 5.373 12 12s-5.373 12-12 12S8 26.627 8 20 13.373 8 20 8z"
            fill="#FFF8E7"
          />
          <path
            d="M15 18c1.5-2 4-3 5-3s3.5 1 5 3c0 3-2.24 5.44-5 5.44S15 21 15 18z"
            fill="currentColor"
            className="text-fresh-green"
          />
          <path
            d="M22 12c1 0 2 1 3 2l-1 1c-0.5-0.5-1-1-2-1s-1.5 0.5-2 1l-1-1c1-1 2-2 3-2z"
            fill="currentColor"
            className="text-fresh-green"
          />
        </svg>
      </div>
      <span className="text-xl font-bold text-gray-800">Остатки Сладки</span>
    </div>
  );

  // Floating food icons (croissant, 50% bag, veggies) as PNG with SVG fallback
  const FloatingIcon = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <div className={`animate-float-slow transform-gpu ${className}`} style={{ animationDelay: `${delay}s`, willChange: "transform", backfaceVisibility: "hidden" as any }}>
      {children}
    </div>
  );

  const FloatingImage = ({ src, alt, fallbackSvg, className = "", delay = 0 }: { src: string; alt: string; fallbackSvg: string; className?: string; delay?: number }) => {
    const [imgSrc, setImgSrc] = useState(src);
    useEffect(() => {
      setImgSrc(src);
    }, [src]);
    return (
      <FloatingIcon delay={delay} className={className}>
        <img
          src={imgSrc}
          alt={alt}
          className="w-20 md:w-24 h-auto object-contain select-none pointer-events-none img-glow drop-shadow-xl"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setImgSrc(`data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`)}
        />
      </FloatingIcon>
    );
  };

  const croissantFallbackSvg = `<svg width='64' height='64' viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'><defs><linearGradient id='cg' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#FFB74D'/><stop offset='100%' stop-color='#FF9800'/></linearGradient></defs><path d='M28 84c8-24 64-24 72 0-4 12-14 20-28 23-16 3-34 1-44-23z' fill='url(#cg)'/><path d='M44 86c8-8 24-8 32 0M64 98c6-4 12-4 18 0' stroke='#F08900' stroke-width='6' stroke-linecap='round'/></svg>`;
  const bagFallbackSvg = `<svg width='64' height='64' viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'><rect x='24' y='40' width='80' height='72' rx='12' fill='#FFFFFF' stroke='#E6EFE8'/><path d='M44 40c4-10 36-10 40 0' stroke='#4CAF50' stroke-width='8' stroke-linecap='round'/><circle cx='88' cy='40' r='8' fill='#4CAF50'/><circle cx='44' cy='74' r='18' fill='#4CAF50'/><text x='44' y='79' text-anchor='middle' font-family='Inter, system-ui' font-weight='800' font-size='16' fill='#fff'>50%</text></svg>`;
  const veggiesFallbackSvg = `<svg width='64' height='64' viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'><ellipse cx='84' cy='72' rx='22' ry='22' fill='#E53935'/><path d='M84 48c8 4 12 8 12 12' stroke='#2E7D32' stroke-width='6' stroke-linecap='round'/><path d='M28 92c0-18 26-26 34-10 4 8-6 18-18 20-6 2-16 2-16-10z' fill='#FF9800'/><path d='M38 74l12-8' stroke='#2E7D32' stroke-width='6' stroke-linecap='round'/></svg>`;

  const FoodIcons = () => <></>;

  // Orbit icons around the headline
  const headingRef = useRef<HTMLDivElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  type ItemType = "croissant" | "bag" | "veggies";
  const base = (import.meta as any)?.env?.BASE_URL ?? "/";
  const typeToSrc = (t: ItemType) =>
    t === "croissant"
      ? `${base}illustrations/floating/crouson.png`
      : t === "bag"
      ? `${base}illustrations/floating/pacege.png`
      : `${base}illustrations/floating/vegetable.png`;
  const typeToFallback = (t: ItemType) =>
    t === "croissant" ? croissantFallbackSvg : t === "bag" ? bagFallbackSvg : veggiesFallbackSvg;

  const HeadingOrbit = ({ anchorRef, layerRef }: { anchorRef: React.RefObject<HTMLElement>, layerRef: React.RefObject<HTMLElement> }) => {
    const [items, setItems] = useState<{ x: number; y: number; type: ItemType; delay: number }[]>([]);
    const [center, setCenter] = useState<{ cx: number; cy: number }>({ cx: 0, cy: 0 });
    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
      if (!isDesktop) {
        // On mobile, do not render heavy orbit items
        setItems([]);
        return;
      }
      const compute = () => {
  const el = anchorRef.current as HTMLElement | null;
  const layer = layerRef.current as HTMLElement | null;
  if (!el || !layer) return;
  const rect = el.getBoundingClientRect();
  const layerRect = layer.getBoundingClientRect();
  const cx = rect.left - layerRect.left + rect.width / 2;
  const cy = rect.top - layerRect.top + rect.height / 2;
  const count = 10; // меньше элементов для производительности
  const offsetX = 110; // больше радиус по X
  const offsetY = 80;  // больше радиус по Y
  const iconMargin = 72; // дальше от текста
        // базовый радиус эллипса
        let rx = rect.width / 2 + offsetX + iconMargin; // большая полуось
        let ry = rect.height / 2 + offsetY + iconMargin; // малая полуось
        // ограничим радиус, чтобы иконки не уезжали за пределы экрана
        const vw = Math.max(window.innerWidth, 320);
        const vh = Math.max(window.innerHeight, 480);
        rx = Math.min(rx, vw / 2 - 48);
        ry = Math.min(ry, vh / 2 - 48);
        const result: { x: number; y: number; type: ItemType; delay: number }[] = [];
        const types: ItemType[] = ["croissant", "bag", "veggies"];
  const startAngle = 0; // начинаем справа
  const jitterAmp = 0; // без случайных дрожаний для стабильности при скролле
        for (let i = 0; i < count; i++) {
          const angle = startAngle + (2 * Math.PI * i) / count;
          const a = angle + (Math.random() - 0.5) * jitterAmp;
          const x = Math.cos(a) * rx; // смещение от центра
          const y = Math.sin(a) * ry;
          const type = types[i % types.length];
          const delay = Math.random() * 1.2;
          result.push({ x, y, type, delay });
        }
    setItems(result);
    setCenter({ cx, cy });
      };
      compute();
  const onResize = () => compute();
      window.addEventListener("resize", onResize);
      const t = setTimeout(compute, 200); // пересчет после шрифтов/анимаций
      let ro: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => compute());
    if (anchorRef.current) ro.observe(anchorRef.current);
    if (layerRef.current) ro.observe(layerRef.current);
      }
      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(t);
        ro?.disconnect();
      };
  }, [isDesktop]);

    return (
  <div aria-hidden className="pointer-events-none select-none absolute inset-0 z-20 overflow-visible">
    <div className="absolute inset-0">
  {items.map((it, idx) => (
            <div
              key={idx}
  className="absolute transform-gpu"
  style={{ left: 0, top: 0, willChange: "transform", backfaceVisibility: "hidden", transform: `translate3d(-50%,-50%,0) translate3d(${center.cx}px, ${center.cy}px, 0) translate3d(${it.x}px, ${it.y}px, 0)` }}
            >
              <FloatingImage
                src={typeToSrc(it.type)}
                alt=""
                delay={it.delay}
                fallbackSvg={typeToFallback(it.type)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-soft-cream overflow-hidden smooth-scroll">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 hover:text-fresh-green transition-colors">О приложении</a>
              <a href="#how-works" className="text-gray-700 hover:text-fresh-green transition-colors">Как работает</a>
              <a href="#restaurants" className="text-gray-700 hover:text-fresh-green transition-colors">Для ресторанов</a>
              <a href="#contact" className="text-gray-700 hover:text-fresh-green transition-colors">Контакты</a>
            </nav>
            
            <a href="#restaurants" className="bg-fresh-green text-white px-6 py-2 rounded-full hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg">
              Для бизнеса
            </a>
          </div>
        </div>
      </header>

  {/* Hero Section */}
  <section ref={heroSectionRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-visible">
  <div className="absolute inset-0 bg-gradient-to-br from-soft-cream via-white to-green-50 z-0"></div>
        {/* Hero illustration as full-bleed background; hide on small screens for perf */}
        <div className="hidden md:block">
          <img
            src={`${base}illustrations/hero-illustration.png`}
            alt=""
            aria-hidden
            className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-50 z-0"
            loading="lazy"
            decoding="async"
          />
        </div>
        {/* Orbit layer above background but below text; hide on small screens */}
        <div className="hidden md:block">
          <HeadingOrbit anchorRef={heroContentRef} layerRef={heroSectionRef} />
        </div>
  {/* Section-level floaters removed to keep icons around heading only */}

  <div className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate 
            id="hero-content"
            ref={heroContentRef}
            className={`relative overflow-visible transition-all duration-1000 transform ${
              visibleSections.has('hero-content') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center">
              <div className="relative inline-block" ref={headingRef}>
                <h1 className="relative z-40 text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
                  Еда не должна пропадать,
                  <span className="block text-fresh-green">фудшеринг для всех</span>
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl leading-relaxed mx-auto">
                Помогаем ресторанам, кафе и кофейням продавать блюда с истекающим сроком годности,
                а людям — есть вкусно и экономить.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#how-works" className="bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl">
                  Как это работает
                </a>
                <a href="#restaurants" className="bg-fresh-green text-white px-8 py-4 rounded-2xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-xl">
                  Стать партнером
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate
            id="benefits-title"
            className={`text-center mb-16 transition-all duration-1000 transform ${
              visibleSections.has('benefits-title') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Почему стоит выбрать нас?
            </h2>
          </div>
          {/* ... */}
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "♻️",
                title: "Экология",
                description: "Меньше еды на свалке — больше заботы о планете",
                delay: 0
              },
              {
                icon: "🍴",
                title: "Вкусная еда",
                description: "Лучшие блюда от проверенных заведений по доступным ценам",
                delay: 200
              },
              {
                icon: "🤝",
                title: "Поддержка бизнеса",
                description: "Помогаем локальным ресторанам сократить потери",
                delay: 400
              }
            ].map((benefit, index) => (
              <div
                key={index}
                data-animate
                id={`benefit-${index}`}
                className={`group transition-all duration-1000 transform ${
                  visibleSections.has(`benefit-${index}`)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${benefit.delay}ms` }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-fresh-green/20">
                  <div className="text-6xl mb-6 text-center">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{benefit.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-works" className="py-20 bg-gradient-to-br from-soft-cream to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate
            id="how-works-title"
            className={`text-center mb-16 transition-all duration-1000 transform ${
              visibleSections.has('how-works-title') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Как это работает?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: "📲",
                title: "Ресторан добавляет еду",
                description: "Заведения публикуют блюда с истекающим сроком"
              },
              {
                step: "2", 
                icon: "🛒",
                title: "Пользователь выбирает",
                description: "Находите вкусную еду рядом с вами по выгодной цене"
              },
              {
                step: "3",
                icon: "🚀", 
                title: "Забираете заказ",
                description: "Приходите в заведение и забираете свой заказ"
              }
            ].map((step, index) => (
              <div
                key={index}
                data-animate
                id={`step-${index}`}
                className={`relative transition-all duration-1000 transform ${
                  visibleSections.has(`step-${index}`)
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-fresh-green text-white rounded-full text-2xl font-bold mb-6 shadow-lg">
                    {step.step}
                  </div>
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-8 h-1 bg-fresh-green/30 transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
  <section id="restaurants" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate
            id="restaurants-title"
            className={`text-center mb-16 transition-all duration-1000 transform ${
              visibleSections.has('restaurants-title') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Для ресторанов, кафе и кофеен
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Сокращайте списания, привлекайте новых гостей и повышайте выручку, продавая сегодняшние блюда по выгодной цене.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[ 
                { title: 'Простой старт', text: 'Публикуйте наборы из блюд за минуты — без долгих интеграций.', icon: '/illustrations/start.png' },
                { title: 'Гибкое управление', text: 'Назначайте цену, количество и время самовывоза.', icon: '/illustrations/settings.png' },
                { title: 'Безопасность и доверие', text: 'Понятные правила упаковки и хранения, отзывы гостей.', icon: '/illustrations/save.png' },
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-fresh-green/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <img
                      src={`${base}${f.icon.replace(/^\//, "")}`}
                      alt=""
                      aria-hidden
                      className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 select-none pointer-events-none"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{f.title}</h3>
                      <p className="text-gray-600">{f.text}</p>
                    </div>
                  </div>
                </div>
              ))}

            </div>
            <div className="relative hidden md:block">
              <img
                src={`${base}illustrations/card-quality.png`}
                alt="Качество и контроль"
                className="w-full max-w-md mx-auto img-glow md:animate-float-slow"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate
            id="testimonials-title"
            className={`text-center mb-16 transition-all duration-1000 transform ${
              visibleSections.has('testimonials-title') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Что говорят пользователи
            </h2>
          </div>
          
          <div 
            data-animate
            id="testimonials-grid"
            className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 transform ${
              visibleSections.has('testimonials-grid')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {[
              {
                name: "Анна Петрова",
                text: "Каждый день покупаю свежую выпечку по отличной цене. Спасибо за заботу об экологии!",
                avatar: "👩‍💼"
              },
              {
                name: "Михаил Сидоров",
                text: "Отличная идея! Помогаю любимым кафе и экономлю. Качество еды всегда на высоте.",
                avatar: "👨‍💻"
              },
              {
                name: "Елена Кузнецова",
                text: "Теперь могу позволить себе еду из дорогих ресторанов. Приложение изменило мой подход к питанию.",
                avatar: "👩‍🎨"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-soft-cream rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-5xl mb-4 text-center">{testimonial.avatar}</div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Large CTA Section */}
      <section id="cta" className="relative py-28 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-fresh-green to-green-600"></div>
  <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            data-animate
            id="cta-content"
            className={`transition-all duration-1000 transform ${
              visibleSections.has('cta-content')
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Присоединяйтесь к фудшерингу
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Мы даем информацию и удобный поиск наборов. Рестораны сокращают списания, а жители экономят.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#how-works" className="bg-white text-gray-900 px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl font-semibold">
                Узнать как это работает
              </a>
              <a href="#restaurants" className="bg-warm-orange text-white px-10 py-5 rounded-2xl hover:bg-orange-600 transition-all transform hover:scale-105 shadow-2xl font-semibold">
                Для ресторанов
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-fresh-green">
                  <svg width="40" height="40" viewBox="0 0 40 40" className="text-fresh-green">
                    <path
                      d="M20 5c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15s15-6.716 15-15c0-8.284-6.716-15-15-15z"
                      fill="currentColor"
                      className="opacity-90"
                    />
                    <path
                      d="M20 8c6.627 0 12 5.373 12 12s-5.373 12-12 12S8 26.627 8 20 13.373 8 20 8z"
                      fill="#FFF8E7"
                    />
                    <path
                      d="M15 18c1.5-2 4-3 5-3s3.5 1 5 3c0 3-2.24 5.44-5 5.44S15 21 15 18z"
                      fill="currentColor"
                      className="text-fresh-green"
                    />
                    <path
                      d="M22 12c1 0 2 1 3 2l-1 1c-0.5-0.5-1-1-2-1s-1.5 0.5-2 1l-1-1c1-1 2-2 3-2z"
                      fill="currentColor"
                      className="text-fresh-green"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold">Остатки Сладки</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Еда должна радовать, а не пропадать. Присоединяйтесь к движению foodsharing и помогайте создавать более устойчивый мир.
              </p>
              <div className="flex flex-wrap gap-3 text-gray-300">
                <a href="#how-works" className="underline-offset-4 hover:underline">Как это работает</a>
                <a href="#restaurants" className="underline-offset-4 hover:underline">Для бизнеса</a>
                <a href="#about" className="underline-offset-4 hover:underline">О нас</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Навигация</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-fresh-green transition-colors">О нас</a></li>
                <li><a href="#restaurants" className="text-gray-400 hover:text-fresh-green transition-colors">Для ресторанов</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-fresh-green transition-colors">Контакты</a></li>
                <li><a href="#" className="text-gray-400 hover:text-fresh-green transition-colors">Политика конфиденциальности</a></li>
              </ul>
            </div>
            

          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Остатки Сладки. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
