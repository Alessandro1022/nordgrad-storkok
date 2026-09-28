const img = (id: string, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

export const site = {
  name: 'Nordgrad Storkök',
  short: 'Nordgrad',
  tagline: 'Köksmaskiner för restaurang & café',
  email: 'info@nordgrad.se',
  phone: '031-10 20 30',
  hours: 'Mån–fre 08–17',
  address: ['Exempelgatan 12', '417 05 Göteborg'],
  orgnr: '559000-0000',
  vatRate: 0.25,
  freeShippingFrom: 10000,
  usps: [
    'Fri frakt över 10 000 kr',
    'Leverans 1–3 dagar',
    'Delbetalning för företag',
    'Prisgaranti',
    'Installation i hela Sverige',
    'Reservdelar i lager',
  ],
  payments: ['Faktura 30 dgr', 'Delbetalning', 'Kort', 'Swish'],
  images: {
    hero: img('1767785990437-dfe1fe516fe8', 2000),
  },
  // nav: visas i menyn. Övriga kan väljas i admin.
  categories: [
    { slug: 'fritoser', name: 'Fritöser', nav: true },
    { slug: 'diskmaskiner', name: 'Diskmaskiner', nav: true },
    { slug: 'ugnar', name: 'Ugnar', nav: true },
    { slug: 'kyl', name: 'Kyl & frys', nav: true },
    { slug: 'beredning', name: 'Beredning', nav: false },
    { slug: 'pizza', name: 'Pizza', nav: false },
    { slug: 'ovrigt', name: 'Övrigt', nav: false },
  ],
};

export const navCategories = site.categories.filter((c) => c.nav);

export function categoryName(slug: string) {
  return site.categories.find((c) => c.slug === slug)?.name ?? slug;
}
