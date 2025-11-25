import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Award, Users, Clock } from 'lucide-react';

const AboutPage = ({ language }) => {
  const navigate = useNavigate();
  const content = {
    ro: {
      title: 'Despre Odette',
      subtitle: 'Patiserie Artizanală din Inimă',
      story: {
        title: 'Povestea Noastră',
        text: `Odette a luat naștere din pasiunea pentru patiserie fină și dorința de a aduce bucurie prin fiecare creație. 
        Începută ca un vis modest, astăzi suntem mândri să oferim cele mai delicioase torturi și prăjituri din orașul nostru. 
        Fiecare produs este realizat cu ingrediente premium și multă dragoste, respectând rețete tradiționale dar și inovând constant.`
      },
      mission: {
        title: 'Misiunea Noastră',
        text: 'Să creăm momente dulci și memorabile pentru fiecare client, oferind produse de cea mai înaltă calitate, realizate cu pasiune și dedicare.'
      },
      values: {
        title: 'Valorile Noastre',
        items: [
          {
            icon: Heart,
            title: 'Pasiune',
            description: 'Fiecare produs este făcut cu dragoste și atenție la detalii'
          },
          {
            icon: Award,
            title: 'Calitate Premium',
            description: 'Folosim doar cele mai bune ingrediente, multe dintre ele importate'
          },
          {
            icon: Users,
            title: 'Orientare către Client',
            description: 'Satisfacția clientului este prioritatea noastră numărul unu'
          },
          {
            icon: Clock,
            title: 'Prospeţime',
            description: 'Produsele noastre sunt preparate zilnic, proaspete și delicioase'
          }
        ]
      },
      team: {
        title: 'Echipa Noastră',
        description: 'Suntem o echipă de patiseri pasionați, fiecare cu propria specialitate și dragostea pentru arta culinară.'
      },
      cta: 'Descoperă Produsele Noastre'
    },
    en: {
      title: 'About Odette',
      subtitle: 'Artisan Pastries from the Heart',
      story: {
        title: 'Our Story',
        text: `Odette was born from a passion for fine pastries and the desire to bring joy through every creation. 
        Started as a modest dream, today we are proud to offer the most delicious cakes and pastries in our city. 
        Each product is made with premium ingredients and lots of love, respecting traditional recipes while constantly innovating.`
      },
      mission: {
        title: 'Our Mission',
        text: 'To create sweet and memorable moments for every customer, offering the highest quality products, made with passion and dedication.'
      },
      values: {
        title: 'Our Values',
        items: [
          {
            icon: Heart,
            title: 'Passion',
            description: 'Every product is made with love and attention to detail'
          },
          {
            icon: Award,
            title: 'Premium Quality',
            description: 'We use only the best ingredients, many of them imported'
          },
          {
            icon: Users,
            title: 'Customer Oriented',
            description: 'Customer satisfaction is our number one priority'
          },
          {
            icon: Clock,
            title: 'Freshness',
            description: 'Our products are prepared daily, fresh and delicious'
          }
        ]
      },
      team: {
        title: 'Our Team',
        description: 'We are a team of passionate pastry chefs, each with their own specialty and love for culinary arts.'
      },
      cta: 'Discover Our Products'
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{t.title}</h1>
            <p className="text-2xl" style={{ color: '#d4af37' }}>{t.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8" style={{ color: '#1e3a8a' }}>
              {t.story.title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              {t.story.text}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-12 border-2" style={{ borderColor: '#d4af37' }}>
            <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#1e3a8a' }}>
              {t.mission.title}
            </h2>
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              {t.mission.text}
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#1e3a8a' }}>
            {t.values.title}
          </h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.values.items.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl text-center hover:shadow-xl transition border-2 border-gray-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#d4af37' }}>
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
              {t.team.title}
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              {t.team.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Placeholder for team images - can be replaced with actual photos */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{t.cta}</h2>
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-4 text-lg font-semibold rounded-lg hover:opacity-90 transition"
            style={{ backgroundColor: '#d4af37', color: 'white' }}
          >
            {t.cta}
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;