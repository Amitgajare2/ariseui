import GithubActivityCard from "@/components/ui/github-calendar";


export default function Demo() {
  return (
    <div className="mx-auto flex max-w-5xl justify-center px-4 pt-12 sm:px-6">
      <GithubActivityCard
        username="amitgajare2"
        colorScheme="pink"
        months={12}
        defaultReposOpen
      />
    </div>
  );
}
