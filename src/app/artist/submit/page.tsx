'use client';

import { ArtistAuthProvider, useArtistAuth } from '../context/ArtistAuthContext';
import ArtistNavbar from '../components/Navbar';
import SubmissionForm from '../components/SubmissionForm';

// Prevent static prerendering - requires context provider
export const dynamic = 'force-dynamic';

function SubmitPageContent() {
  const { isAuthenticated, loading } = useArtistAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="inline-block w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <ArtistNavbar />
      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Submit Your Track</h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-md mx-auto">Get your music in front of curated DJs worldwide.</p>
        </div>
        <SubmissionForm
          onCancel={() => window.location.href = '/artist/dashboard'}
        />
      </main>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <ArtistAuthProvider>
      <SubmitPageContent />
    </ArtistAuthProvider>
  );
}
