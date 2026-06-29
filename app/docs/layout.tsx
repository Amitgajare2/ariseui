import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_28%),linear-gradient(135deg,#fffaf5_0%,#fffdf9_100%)] text-slate-900">
      <Navbar />
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <main className="mx-auto flex-1 max-w-4xl overflow-auto px-6 py-10 md:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
