'use client';

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';

export function AuthBar() {
  return (
    <div className="flex items-center gap-4">
      <SignedIn>
        <Link
          href="/profile"
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Profile
        </Link>
        <Link
          href="/discover"
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Discover
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-sm px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
