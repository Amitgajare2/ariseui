import SpotlightCard from "@/components/ui/spotlight-card";

export default function Demo() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-6 md:grid-cols-2">
        <SpotlightCard className="bg-white p-8 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold">Default Glow</h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Move your cursor over this card to see the spotlight follow your mouse.
          </p>
        </SpotlightCard>

        <SpotlightCard
          className="bg-white p-8 dark:bg-neutral-900"
          spotlightColor="rgba(59, 130, 246, 0.2)"
          spotlightSize={400}
        >
          <h3 className="text-lg font-semibold">Custom Blue Glow</h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            This card uses a larger blue spotlight radius.
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}
