import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ArcadeApp } from "@/components/ArcadeApp";
import { checkArcadeAuth } from "@/lib/arcade.functions";

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: "Education — Scholaris" }] }),
  beforeLoad: async () => {
    const { authorized } = await checkArcadeAuth();
    if (!authorized) throw redirect({ to: "/" });
  },
  component: GamesRoute,
});

function GamesRoute() {
  const navigate = useNavigate();
  return <ArcadeApp onExit={() => navigate({ to: "/" })} />;
}
