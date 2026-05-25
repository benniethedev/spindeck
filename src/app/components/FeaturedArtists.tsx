/**
 * FeaturedArtists - Showcase of featured artists on SpinRec
 * Provides social proof and community visibility
 */

const artists = [
  {
    name: 'Luna Wave',
    genre: 'House / Tech House',
    initials: 'LW',
    gradient: 'from-violet-500 to-indigo-600',
  },
  {
    name: 'DJ Phoenix',
    genre: 'Drum & Bass',
    initials: 'DP',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Amara Sol',
    genre: 'Afrobeats / Afro House',
    initials: 'AS',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'The Void',
    genre: 'Techno / Industrial',
    initials: 'TV',
    gradient: 'from-slate-600 to-zinc-800',
  },
  {
    name: 'Echo Park',
    genre: 'Lo-Fi / Chill',
    initials: 'EP',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    name: 'Nyx Protocol',
    genre: 'Progressive House',
    initials: 'NP',
    gradient: 'from-cyan-500 to-blue-600',
  },
];

export default function FeaturedArtists() {
  return (
    <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
            Featured Artists
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Artists Already on SpinRec
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Join a growing community of independent artists getting real DJ rotation.
          </p>
        </div>

        {/* Artist grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.name}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 hover:border-violet-300 dark:hover:border-violet-800 transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${artist.gradient} flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg`}
              >
                {artist.initials}
              </div>
              <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                {artist.name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {artist.genre}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
