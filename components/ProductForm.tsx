'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import MachineArt from './MachineArt';
import { site } from '@/lib/site';
import type { Product } from '@/lib/types';
import { saveProduct, type SaveState } from '@/app/admin/actions';

function Submit({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn-primary" disabled={pending}>
      {pending ? 'Sparar…' : isNew ? 'Skapa produkt' : 'Spara ändringar'}
    </button>
  );
}

export default function ProductForm({ product }: { product?: Product }) {
  const [state, action] = useFormState<SaveState, FormData>(saveProduct, {});
  const [art, setArt] = useState<Product['art']>(product?.art ?? 'front');
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null);
  const p = product;

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {p && <input type="hidden" name="id" value={p.id} />}

      <div className="space-y-6 rounded-lg border border-steel-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="label">Produktnamn *</label>
            <input id="name" name="name" required defaultValue={p?.name} className="input" placeholder="FD-50 Frontmatad diskmaskin" />
          </div>
          <div>
            <label htmlFor="brand" className="label">Varumärke</label>
            <input id="brand" name="brand" defaultValue={p?.brand} className="input" />
          </div>
          <div>
            <label htmlFor="slug" className="label">URL-namn (lämna tomt = auto)</label>
            <input id="slug" name="slug" defaultValue={p?.slug} className="input font-mono text-xs" />
          </div>
          <div>
            <label htmlFor="category" className="label">Kategori</label>
            <select id="category" name="category" defaultValue={p?.category ?? 'diskmaskiner'} className="input">
              {site.categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategory" className="label">Typ / underkategori</label>
            <input id="subcategory" name="subcategory" defaultValue={p?.subcategory} className="input" placeholder="Fristående / underbänk" />
          </div>
        </div>

        <div>
          <label htmlFor="short" className="label">Kort säljtext</label>
          <input id="short" name="short" defaultValue={p?.short} className="input" placeholder="Visas under namnet på produktsidan" />
        </div>
        <div>
          <label htmlFor="description" className="label">Beskrivning</label>
          <textarea id="description" name="description" rows={6} defaultValue={p?.description} className="input" />
        </div>
        <div>
          <label htmlFor="specs" className="label">Teknisk data – en rad per värde, ”Etikett: Värde”</label>
          <textarea
            id="specs"
            name="specs"
            rows={7}
            defaultValue={p?.specs.map((s) => `${s.label}: ${s.value}`).join('\n')}
            className="input font-mono text-xs"
            placeholder={'Korgstorlek: 500 × 500 mm\nKapacitet: 40 korgar/tim\nAnslutning: 400V 3N~ / 6,7 kW'}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 rounded-lg border border-steel-200 bg-white p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="label">Pris exkl. moms *</label>
              <input id="price" name="price" inputMode="decimal" required defaultValue={p?.price} className="input tabular" />
            </div>
            <div>
              <label htmlFor="compare_price" className="label">Ord. pris (kampanj)</label>
              <input id="compare_price" name="compare_price" inputMode="decimal" defaultValue={p?.compare_price ?? ''} className="input tabular" />
            </div>
            <div>
              <label htmlFor="stock" className="label">Lagersaldo</label>
              <input id="stock" name="stock" type="number" min={0} defaultValue={p?.stock ?? 10} className="input tabular" />
            </div>
            <div>
              <label htmlFor="sort_order" className="label">Sortering</label>
              <input id="sort_order" name="sort_order" type="number" defaultValue={p?.sort_order ?? 100} className="input tabular" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" id="featured" name="featured" defaultChecked={p?.featured ?? false} className="accent-accent" />
            Visa under ”Mest köpta” på startsidan
          </label>
        </div>

        <div className="space-y-4 rounded-lg border border-steel-200 bg-white p-6">
          <p className="label">Produktbild</p>
          <div className="aspect-square rounded-md bg-steel-50 p-4">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-contain" />
            ) : (
              <MachineArt variant={art} className="h-full w-full" />
            )}
          </div>
          <div>
            <label htmlFor="image_file" className="label">Ladda upp bild (max 5 MB)</label>
            <input
              id="image_file"
              name="image_file"
              type="file"
              accept="image/*"
              className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
          </div>
          <div>
            <label htmlFor="image_url" className="label">…eller bildlänk</label>
            <input id="image_url" name="image_url" defaultValue={p?.image_url ?? ''} className="input text-xs" placeholder="https://" onChange={(e) => setPreview(e.target.value || null)} />
          </div>
          {p?.image_url && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" id="remove_image" name="remove_image" className="accent-accent" /> Ta bort nuvarande bild
            </label>
          )}
          <div>
            <label htmlFor="art" className="label">Illustration när bild saknas</label>
            <select id="art" name="art" value={art} onChange={(e) => setArt(e.target.value as Product['art'])} className="input">
              <option value="front">Frontmatad maskin</option>
              <option value="hood">Huvdiskmaskin</option>
              <option value="glass">Glasdiskmaskin</option>
              <option value="generic">Allmän maskin</option>
            </select>
          </div>
        </div>

        {state.error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{state.error}</p>}
        <div className="flex gap-3">
          <Submit isNew={!p} />
          <Link href="/admin" className="btn-ghost">Avbryt</Link>
        </div>
      </div>
    </form>
  );
}
