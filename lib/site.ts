const img = (id: string, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const site = {
  name: 'Nordgrad Storkök',
  short: 'Nordgrad',
  tagline: 'Köksmaskiner för restaurang & storkök',
  email: 'info@nordgrad.se',
  phone: '031-10 20 30',
  hours: 'Mån–fre 08–17',
  address: ['Exempelgatan 12', '417 05 Göteborg'],
  orgnr: '559000-0000',
  vatRate: 0.25,
  freeShippingFrom: 10000,
  usps: ['Delbetalning', 'Fri frakt över 10 000 kr', 'Prisgaranti', 'Installation i hela Sverige'],
  payments: ['Faktura 30 dgr', 'Delbetalning', 'Kort', 'Swish'],
  images: {
    hero: img('1767785990437-dfe1fe516fe8', 1800),
    complete: img('1784039534969-26e424548f3e', 1400),
  },
  categories: [
    {
      slug: 'diskmaskiner',
      name: 'Diskmaskiner',
      blurb: 'Frontmatade, huv- och glasdiskmaskiner',
      image: img('1780590107744-42e6f234fd7d', 900),
      subs: ['Frontmatad / underbänk', 'Huvdiskmaskin', 'Glasdiskmaskin', 'Grytdiskmaskin', 'Diskkorgar', 'Diskmedel & avhärdning'],
    },
    {
      slug: 'varmkok',
      name: 'Varmkök',
      blurb: 'Ugnar, fritöser, grillar och spisar',
      image: img('1789568682937-5df65668d8d3', 900),
      subs: ['Kombiugn', 'Fritös', 'Stekbord', 'Spis', 'Klämgrill', 'Värmeskåp'],
    },
    {
      slug: 'kyl-frys',
      name: 'Kyl & frys',
      blurb: 'Kylbänkar, kylskåp och frysar',
      image: img('1782750161991-23529c9462bb', 900),
      subs: ['Kylbänk', 'Kylskåp', 'Frysskåp', 'Saladette', 'Nedkylningsskåp', 'Ismaskin'],
    },
    {
      slug: 'beredning',
      name: 'Beredning',
      blurb: 'Grönsaksskärare, degblandare och mixers',
      image: img('1762329924239-e204f101fca4', 900),
      subs: ['Grönsaksskärare', 'Degblandare', 'Stavmixer', 'Köttkvarn', 'Vakuummaskin', 'Skärmaskin'],
    },
    {
      slug: 'pizza',
      name: 'Pizza',
      blurb: 'Pizzaugnar, pizzakylbänkar och tillbehör',
      image: img('1622880833523-7cf1c0bd4296', 900),
      subs: ['Pizzaugn', 'Pizzakylbänk', 'Degpress', 'Pizzaspadar'],
    },
    {
      slug: 'reservdelar',
      name: 'Reservdelar',
      blurb: 'Korgar, filter, pumpar och knivar',
      image: img('1789568682842-dedbf3af4bc0', 900),
      subs: ['Diskmaskin', 'Varmkök', 'Beredning', 'Kyl & frys'],
    },
  ],
  segments: [
    { name: 'Pizzeria', text: 'Pizzaugn, kylbänk och en diskmaskin som hinner med kvällsrusningen.', image: img('1651981075280-9a9e01acbff0', 900), href: '/produkter?kategori=pizza' },
    { name: 'Café & bar', text: 'Glasdiskare under disken och kyl som syns för gästen.', image: img('1766289199031-28e6d3e9ee1d', 900), href: '/produkter?q=glas' },
    { name: 'Restaurang', text: 'Varmkök och huvdisk dimensionerat efter antal kuvert per pass.', image: img('1600565193348-f74bd3c7ccdf', 900), href: '/produkter?kategori=varmkok' },
    { name: 'Skolkök & storkök', text: 'Kapacitet för hundratals portioner, med service och reservdelar.', image: img('1675647699232-76b8f533b006', 900), href: '/kontakt' },
  ],
};

export function categoryName(slug: string) {
  return site.categories.find((c) => c.slug === slug)?.name ?? slug;
}
