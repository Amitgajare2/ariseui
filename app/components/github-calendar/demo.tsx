import GithubActivityCard from "@/components/ui/github-calendar";


export default function Demo() {
  return (
    <div className="mx-auto flex max-w-5xl justify-center pt-12">
      <GithubActivityCard
        username="amitgajare2"
        colorScheme="pink"
        months={6}
        defaultReposOpen
      />
    </div>
  );
}
