/* DKL 21 Nov 2026: Organization + WebSite structured data for Google's brand Knowledge Panel.
   Online-only shop, so no Google Business Profile (not eligible); this is the safe alternative.
   Runs on the home page and /about-us only. Links: claude/dkl-social-links-map-15nov.md.
   Add a new profile to SAME_AS when a channel goes live (TPT once it has products). */
(function(){
  var p = location.pathname.replace(/\/+$/, '') || '/';
  if (p !== '/' && p !== '/about-us') return;
  if (document.querySelector('script[data-dkl-org]')) return;

  var SITE = 'https://doodlekidsland.com/';
  var ORG_ID = SITE + '#organization';
  var LOGO = 'https://pe56d.s3.amazonaws.com/o_1k7e1mgeq1pm6h5i1fme1fm4acp16.png';
  var SAME_AS = [
    'https://www.etsy.com/shop/DoodleKidsLand',
    'https://www.pinterest.com/doodlekidsland/',
    'https://www.instagram.com/doodlekidsland/',
    'https://www.facebook.com/doodlekidsland',
    'https://www.youtube.com/@DoodleKidsLandOfficial',
    'https://www.linkedin.com/company/doodlekidsland',
    'https://www.trustpilot.com/review/doodlekidsland.com'
  ];

  var data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'Doodle Kids Land',
        alternateName: 'DoodleKidsLand',
        url: SITE,
        logo: { '@type': 'ImageObject', url: LOGO },
        slogan: 'Where little dreams bloom',
        description: 'Printable coloring pages, drawing guides, workbooks and activity books for kids ages 2–12, made for parents, homeschool families and teachers.',
        email: 'hello@doodlekidsland.com',
        foundingDate: '2026',
        founder: {
          '@type': 'Person',
          name: 'Milan Kodavala',
          jobTitle: 'Founder',
          sameAs: ['https://www.linkedin.com/in/kmilan101/']
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'hello@doodlekidsland.com',
          availableLanguage: 'English'
        },
        sameAs: SAME_AS
      },
      {
        '@type': 'WebSite',
        '@id': SITE + '#website',
        name: 'Doodle Kids Land',
        url: SITE,
        publisher: { '@id': ORG_ID },
        inLanguage: 'en-US'
      }
    ]
  };

  var s = document.createElement('script');
  s.type = 'application/ld+json';
  s.setAttribute('data-dkl-org', '1');
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
})();
