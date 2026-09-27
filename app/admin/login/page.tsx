'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Logo from '@/components/Logo';
import { login, type LoginState } from '../actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn-dark w-full" disabled={pending}>
      {pending ? 'Loggar in…' : 'Logga in'}
    </button>
  );
}

export default function LoginPage() {
  const [state, action] = useFormState<LoginState, FormData>(login, {});
  return (
    <div className="flex min-h-screen items-center justify-center bg-steel-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-steel-200 bg-white p-8 shadow-sm">
        <Logo />
        <h1 className="mt-6 font-display text-xl font-bold">Logga in i admin</h1>
        <form action={action} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="label">E-post</label>
            <input id="email" name="email" type="email" autoComplete="username" required className="input" />
          </div>
          <div>
            <label htmlFor="password" className="label">Lösenord</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
          </div>
          {state.error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{state.error}</p>}
          <Submit />
        </form>
      </div>
    </div>
  );
}
