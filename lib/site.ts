export const site = {
  name: 'Nordgrad Storkök',
  short: 'Nordgrad',
  tagline: 'Köksmaskiner för restaurang & storkök',
  email: 'info@nordgrad.se',
  phone: '031-10 20 30',
  address: ['Exempelgatan 12', '417 05 Göteborg'],
  orgnr: '559000-0000',
  vatRate: 0.25,
  freeShippingFrom: 10000,
  usps: ['Delbetalning via faktura', 'Fri frakt över 10 000 kr', 'Prisgaranti', 'Installation i hela Sverige'],
  categories: [
    { slug: 'diskmaskiner', name: 'Diskmaskiner', blurb: 'Frontmatade, huv- och glasdiskmaskiner.' },
    { slug: 'varmkok', name: 'Varmkök', blurb: 'Ugnar, fritöser, grillar och spisar.' },
    { slug: 'kyl-frys', name: 'Kyl & frys', blurb: 'Kylbänkar, kylskåp och frysar.' },
    { slug: 'beredning', name: 'Beredning', blurb: 'Grönsaksskärare, degblandare och mixers.' },
    { slug: 'pizza', name: 'Pizza', blurb: 'Pizzaugnar, pizzakylbänkar och tillbehör.' },
    { slug: 'reservdelar', name: 'Reservdelar', blurb: 'Korgar, filter, pumpar och delar.' },
  ],
};

export function categoryName(slug: string) {
  return site.categories.find((c) => c.slug === slug)?.name ?? slug;
}
