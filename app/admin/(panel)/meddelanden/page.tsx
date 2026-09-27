import { listMessages } from '@/lib/products';
import { dateTime } from '@/lib/format';
import { deleteMessage } from '../../actions';

export default async function MessagesPage() {
  const messages = await listMessages();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Meddelanden & offertförfrågningar</h1>
      {!messages.length && <p className="rounded-lg border border-dashed border-steel-300 bg-white p-10 text-center text-ink-mute">Inga meddelanden ännu.</p>}
      <ul className="space-y-3">
        {messages.map((m) => (
          <li key={m.id} className="rounded-lg border border-steel-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{m.name}{m.company ? ` · ${m.company}` : ''}</p>
                <p className="text-sm text-ink-soft">
                  <span className="select-all">{m.email}</span>{m.phone ? ` · ${m.phone}` : ''}
                </p>
              </div>
              <p className="tabular font-mono text-xs text-ink-mute">{dateTime(m.created_at)}</p>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
            <form action={deleteMessage} className="mt-3">
              <input type="hidden" name="id" value={m.id} />
              <button className="text-xs text-red-700 hover:underline">Ta bort</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
