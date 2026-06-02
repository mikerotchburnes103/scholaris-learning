interface Props {
  title?: string;
  className?: string;
}

/**
 * Reusable Vimeo embed for the "Scientific Method" lesson video.
 * Maintains 4:3 aspect ratio (padding-top 75%).
 */
export function ScientificMethodVideo({ title = "The Scientific Method", className }: Props) {
  return (
    <div className={className} style={{ padding: "75% 0 0 0", position: "relative" }}>
      <iframe
        src="https://player.vimeo.com/video/543156776?badge=0&autopause=0&player_id=0&app_id=58479"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        title={title}
      />
    </div>
  );
}
