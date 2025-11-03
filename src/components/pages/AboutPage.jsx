import React from 'react';
import { Award, Heart, Users, Clock, ChefHat, Star, Crown } from 'lucide-react';

const AboutPage = ({ language = 'ro' }) => {
  const content = {
    ro: {
      title: "Povestea Noastră",
      subtitle: "Pasiune pentru Patiserie din 2015",
      heroQuote: "Fiecare prăjitură spune o poveste, fiecare tort celebrează un moment special",
      founderTitle: "Întâlnește-o pe Odette",
      founderStory: "Totul a început într-o bucătărie mică, cu o pasiune mare și rețete transmise din generație în generație. Odette a visat întotdeauna să aducă bucurie oamenilor prin dulciuri artizanale, făcute cu dragoste și ingrediente premium.",
      founderQuote: "\"Pentru mine, patiseria nu este doar despre desert - este despre crearea amintirilor dulci care durează o viață întreagă.\"",
      missionTitle: "Misiunea Noastră",
      mission: "Să creăm cele mai delicioase și frumoase dulciuri artizanale, folosind doar ingrediente naturale premium, respectând tradițiile și inovând constant pentru a depăși așteptările clienților noștri.",
      valuesTitle: "Valorile Noastre",
      values: [
        {
          icon: Heart,
          title: "Pasiune",
          description: "Fiecare produs este făcut cu dragoste și dedicare"
        },
        {
          icon: Award,
          title: "Calitate Premium",
          description: "Doar cele mai bune ingrediente naturale și locale"
        },
        {
          icon: Users,
          title: "Orientare către Client",
          description: "Fericirea ta este prioritatea noastră numărul 1"
        },
        {
          icon: Clock,
          title: "Prospețime",
          description: "Preparate proaspete zilnic, fără conservanți"
        }
      ],
      teamTitle: "Echipa Noastră",
      teamIntro: "Cunoaște oamenii talentați care fac magie în bucătăria noastră",
      team: [
        {
          name: "Odette Popescu",
          role: "Fondator & Pastry Chef",
          description: "Pasionată de patiserie de peste 15 ani"
        },
        {
          name: "Maria Ionescu",
          role: "Sous Chef",
          description: "Specialist în torturi personalizate"
        },
        {
          name: "Alexandru Radu",
          role: "Baker",
          description: "Expert în patiserie franceză"
        },
        {
          name: "Elena Dumitru",
          role: "Decorator",
          description: "Artistă în design-ul torturilor"
        }
      ],
      whyChooseTitle: "De Ce Să Alegi Odette?",
      reasons: [
        "Peste 10.000 de clienți fericiți",
        "Premiat 'Cea Mai Bună Patiserie' 2023",
        "Torturi personalizate pentru orice eveniment",
        "Livrare rapidă în Cluj-Napoca",
        "Ingrediente 100% naturale",
        "Ambalaj premium cadou"
      ],
      certificationsTitle: "Certificări & Premii",
      certifications: [
        "Certificat ANPC - Siguranță Alimentară",
        "Premiul 'Best Pastry Shop' 2023",
        "Membru Romanian Pastry Association",
        "ISO 9001:2015 Managementul Calității"
      ],
      ctaTitle: "Gata să încerci ceva delicios?",
      ctaButton: "Explorează Produsele"
    },
    en: {
      title: "Our Story",
      subtitle: "Passion for Pastry Since 2015",
      heroQuote: "Every pastry tells a story, every cake celebrates a special moment",
      founderTitle: "Meet Odette",
      founderStory: "It all started in a small kitchen, with a great passion and recipes passed down through generations. Odette always dreamed of bringing joy to people through artisan sweets, made with love and premium ingredients.",
      founderQuote: "\"For me, pastry is not just about dessert - it's about creating sweet memories that last a lifetime.\"",
      missionTitle: "Our Mission",
      mission: "To create the most delicious and beautiful artisan sweets, using only premium natural ingredients, respecting traditions and constantly innovating to exceed our customers' expectations.",
      valuesTitle: "Our Values",
      values: [
        {
          icon: Heart,
          title: "Passion",
          description: "Every product is made with love and dedication"
        },
        {
          icon: Award,
          title: "Premium Quality",
          description: "Only the best natural and local ingredients"
        },
        {
          icon: Users,
          title: "Customer Focus",
          description: "Your happiness is our number 1 priority"
        },
        {
          icon: Clock,
          title: "Freshness",
          description: "Prepared fresh daily, no preservatives"
        }
      ],
      teamTitle: "Our Team",
      teamIntro: "Meet the talented people who make magic in our kitchen",
      team: [
        {
          name: "Odette Popescu",
          role: "Founder & Pastry Chef",
          description: "Passionate about pastry for over 15 years"
        },
        {
          name: "Maria Ionescu",
          role: "Sous Chef",
          description: "Specialist in custom cakes"
        },
        {
          name: "Alexandru Radu",
          role: "Baker",
          description: "Expert in French patisserie"
        },
        {
          name: "Elena Dumitru",
          role: "Decorator",
          description: "Artist in cake design"
        }
      ],
      whyChooseTitle: "Why Choose Odette?",
      reasons: [
        "Over 10,000 happy customers",
        "Awarded 'Best Pastry Shop' 2023",
        "Custom cakes for any event",
        "Fast delivery in Cluj-Napoca",
        "100% natural ingredients",
        "Premium gift packaging"
      ],
      certificationsTitle: "Certifications & Awards",
      certifications: [
        "ANPC Certificate - Food Safety",
        "Best Pastry Shop Award 2023",
        "Member Romanian Pastry Association",
        "ISO 9001:2015 Quality Management"
      ],
      ctaTitle: "Ready to try something delicious?",
      ctaButton: "Explore Products"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-block mb-6">
              <Crown size={64} style={{ color: '#d4af37' }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {t.title}
            </h1>
            <p className="text-xl mb-6" style={{ color: '#d4af37' }}>
              {t.subtitle}
            </p>
            <p className="text-2xl italic opacity-90">
              "{t.heroQuote}"
            </p>
            
            {/* Decorative element */}
            <div className="mt-8 flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-current" size={24} style={{ color: '#d4af37' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {/* Placeholder for founder image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-square flex items-center justify-center">
                  <ChefHat size={120} className="text-gray-300" />
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
                  {t.founderTitle}
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {t.founderStory}
                </p>
                <blockquote className="border-l-4 pl-6 py-2 italic text-gray-700 bg-gray-50 rounded-r-lg" 
                  style={{ borderColor: '#d4af37' }}>
                  {t.founderQuote}
                  <footer className="text-sm text-gray-600 mt-2">— Odette Popescu</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
              {t.missionTitle}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              {t.mission}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#1e3a8a' }}>
            {t.valuesTitle}
          </h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center border-2 border-gray-100"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" 
                    style={{ backgroundColor: '#d4af37' }}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#1e3a8a' }}>
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#1e3a8a' }}>
            {t.teamTitle}
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            {t.teamIntro}
          </p>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.team.map((member, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Placeholder for team member photo */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <Users size={80} className="text-gray-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a8a' }}>
                    {member.name}
                  </h3>
                  <p className="font-semibold mb-3" style={{ color: '#d4af37' }}>
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#1e3a8a' }}>
              {t.whyChooseTitle}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {t.reasons.map((reason, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition border-2 border-gray-100"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#d4af37' }}>
                    <Award className="text-white" size={24} />
                  </div>
                  <div className="text-gray-700 font-medium">
                    {reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#1e3a8a' }}>
            {t.certificationsTitle}
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {t.certifications.map((cert, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-md"
              >
                <Award className="flex-shrink-0" size={32} style={{ color: '#d4af37' }} />
                <p className="text-gray-700 font-medium">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t.ctaTitle}
          </h2>
          <button className="text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
            style={{ backgroundColor: '#d4af37' }}>
            {t.ctaButton}
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;