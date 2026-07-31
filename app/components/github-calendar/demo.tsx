import GithubCalendar from "@/components/ui/github-calendar";

export default function Demo() {
  return (
    <div className="mx-auto max-w-5xl pt-12">
      <GithubCalendar
        username="amitgajare2"
        colorScheme="halloween"
        animate
        timeRange="3-months"
      />
    </div>
  );
}
