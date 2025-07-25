import { createClient } from "@/libs/supabase/server";
import { getAdminConfig, isAdminEmail } from "@/libs/admin";
import { redirect } from "next/navigation";

export default async function AdminStatusPage() {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if not logged in
  if (!user) {
    redirect("/signin");
  }

  const adminConfig = getAdminConfig();
  const userIsAdmin = isAdminEmail(user.email);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Configuration Status</h1>
        
        <div className="space-y-6">
          {/* Current User Info */}
          <div className="bg-spindeck-dark p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Current User</h2>
            <div className="space-y-2">
              <p><span className="text-spindeck-gray">Email:</span> {user.email}</p>
              <p><span className="text-spindeck-gray">ID:</span> {user.id}</p>
              <p><span className="text-spindeck-gray">Has Admin Access:</span> 
                <span className={userIsAdmin ? "text-green-500 ml-2" : "text-red-500 ml-2"}>
                  {userIsAdmin ? "✅ YES" : "❌ NO"}
                </span>
              </p>
            </div>
          </div>

          {/* Admin Configuration */}
          <div className="bg-spindeck-dark p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Admin Configuration</h2>
            <div className="space-y-2">
              <p><span className="text-spindeck-gray">Admin System Configured:</span> 
                <span className={adminConfig.configured ? "text-green-500 ml-2" : "text-red-500 ml-2"}>
                  {adminConfig.configured ? "✅ YES" : "❌ NO"}
                </span>
              </p>
              <p><span className="text-spindeck-gray">Number of Admin Emails:</span> {adminConfig.count}</p>
              
              {adminConfig.adminEmails.length > 0 && (
                <div>
                  <p className="text-spindeck-gray mb-2">Admin Email List:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {adminConfig.adminEmails.map((email, index) => (
                      <li key={index} className="text-sm font-mono bg-gray-800 px-2 py-1 rounded inline-block mr-2 mb-1">
                        {email}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How Admin Access Works</h2>
            <div className="space-y-3 text-sm">
              <p>🔐 <strong>Admin access is controlled by email addresses</strong> in the <code className="bg-gray-800 px-2 py-1 rounded">.env.local</code> file.</p>
              <p>📝 <strong>To add/remove admins:</strong> Edit the <code className="bg-gray-800 px-2 py-1 rounded">ADMIN_EMAILS</code> variable in <code className="bg-gray-800 px-2 py-1 rounded">.env.local</code></p>
              <p>🚫 <strong>Users cannot select "Admin" role</strong> during signup - it's automatically assigned based on email.</p>
              <p>🔄 <strong>Role updates automatically</strong> when users log in - no manual database changes needed.</p>
              <p>✅ <strong>Current admins</strong> will see the Admin Dashboard instead of Artist/DJ dashboards.</p>
            </div>
          </div>

          {/* Environment Variable Example */}
          <div className="bg-spindeck-dark p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Environment Variable Format</h2>
            <div className="bg-gray-900 p-4 rounded-lg">
              <pre className="text-sm text-green-400">
                <code>{`# In your .env.local file:
ADMIN_EMAILS=benbond@gmail.com,admin@spinrec.com,admin@netswagger.com`}</code>
              </pre>
            </div>
            <p className="text-sm text-spindeck-gray mt-2">
              Separate multiple emails with commas. No spaces around emails recommended.
            </p>
          </div>

          {/* Quick Test */}
          {userIsAdmin && (
            <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">✅ Admin Access Confirmed</h2>
              <p>Your email ({user.email}) has admin access. You should see the Admin Dashboard when you visit <code className="bg-gray-800 px-2 py-1 rounded">/dashboard</code>.</p>
              <div className="mt-4">
                <a href="/dashboard" className="bg-spindeck-red hover:bg-red-600 text-white px-4 py-2 rounded-lg inline-block">
                  Go to Dashboard →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}