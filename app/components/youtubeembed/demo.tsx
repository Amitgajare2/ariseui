import YoutubeEmbed from "@/components/ui/youtube-embed";

export default function Demo() {
  return (
    <div className="mx-auto max-w-5xl pt-12">
      <YoutubeEmbed
        videoId="DUV0KxkaIQU"
        autoPlay
        mute
        loop
      />
    </div>
  );
}