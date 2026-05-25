path = '/home/benbond/Documents/spinrec/src/app/artist/dashboard/page.tsx'
with open(path, 'r') as f:
    content = f.read()

# Add import for SubmissionsList and SubmissionsFilter
old_import = 'import type { Submission, SubmissionStatus } from "@/types";'
new_import = '''import type { Submission, SubmissionStatus } from "@/types";
import SubmissionsList from "../components/SubmissionsList";
import SubmissionsFilter from "../components/SubmissionsFilter";'''
content = content.replace(old_import, new_import)

# Add demo submissions data after the stats object
stats_block = '''  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    inCampaign: submissions.filter((s) => s.status === "in_campaign").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };'''

demo_block = '''  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    inCampaign: submissions.filter((s) => s.status === "in_campaign").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>("all");'''

content = content.replace(stats_block, demo_block)

# Add useState for activeFilter
old_usestate = '''  const [refreshing, setRefreshing] = useState(false);'''
new_usestate = '''  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");'''
content = content.replace(old_usestate, new_usestate)

# Replace the stats cards section to include filter
stats_cards = '''        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">'''

stats_cards_new = '''        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">'''

content = content.replace(stats_cards, stats_cards_new)

# Replace the submissions list section
old_list = '''        {/* Submissions List */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Recent Submissions
            </h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {submissions.length} {submissions.length === 1 ? "submission" : "submissions"}
            </span>
          </div>

          {loading ? ('''

new_list = '''        {/* Filters */}
        <div className="mb-4">
          <SubmissionsFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Submissions List */}
        <SubmissionsList
          submissions={submissions}
          loading={loading}
          onRefresh={() => { setLoading(true); setRefreshing(true); fetchSubmissions(); }}
          filterStatus={activeFilter as SubmissionStatus | 'all'}
        />'''

content = content.replace(old_list, new_list)

with open(path, 'w') as f:
    f.write(content)
print('Dashboard page updated')
