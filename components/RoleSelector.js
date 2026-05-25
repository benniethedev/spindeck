"use client";

/**
 * RoleSelector Component
 * Used during registration to select Artist or DJ role
 */

export default function RoleSelector({ selectedRole, onRoleChange }) {
  const roles = [
    {
      id: "artist",
      title: "Artist",
      icon: "🎵",
      description: "Upload and promote your music to DJs worldwide",
      features: [
        "Upload tracks to the DJ pool",
        "Get feedback from real DJs",
        "Track plays and downloads",
        "Public artist profile page",
      ],
    },
    {
      id: "dj",
      title: "DJ",
      icon: "🎧",
      description: "Access fresh tracks and give feedback to artists",
      features: [
        "Browse the DJ pool",
        "Download high-quality tracks",
        "Rate and review music",
        "Discover new artists",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center text-white">I am a...</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleChange(role.id)}
            className={`relative p-6 rounded-xl border-2 text-left transition-all duration-200 ${
              selectedRole === role.id
                ? "border-spindeck-red bg-spindeck-red/10 shadow-lg shadow-red-500/20"
                : "border-gray-700 bg-spindeck-dark hover:border-gray-600 hover:bg-gray-800/50"
            }`}
          >
            {/* Selected indicator */}
            {selectedRole === role.id && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-spindeck-red rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{role.icon}</span>
              <h4 className="text-xl font-bold text-white">{role.title}</h4>
            </div>

            <p className="text-gray-400 text-sm mb-4">{role.description}</p>

            <ul className="space-y-2">
              {role.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <svg
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      selectedRole === role.id
                        ? "text-spindeck-red"
                        : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}
