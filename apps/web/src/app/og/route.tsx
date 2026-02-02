import { ImageResponse } from "next/og";

async function loadAssets(): Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import("./geist-regular-otf.json").then((mod) => mod.default || mod),
    import("./geistmono-regular-otf.json").then((mod) => mod.default || mod),
    import("./geist-semibold-otf.json").then((mod) => mod.default || mod),
  ]);

  return [
    {
      name: "Geist",
      data: Buffer.from(normal, "base64"),
      weight: 400,
      style: "normal",
    },
    {
      name: "Geist Mono",
      data: Buffer.from(mono, "base64"),
      weight: 400,
      style: "normal",
    },
    {
      name: "Geist",
      data: Buffer.from(semibold, "base64"),
      weight: 600,
      style: "normal",
    },
  ];
}

export async function GET(request: Request) {
  const [fonts] = await Promise.all([loadAssets()]);

  return new ImageResponse(
    <div
      tw="flex h-full w-full items-center justify-center bg-black text-white"
      style={{ fontFamily: "Geist", fontWeight: 600 }}
    >
      <div
        style={{
          fontSize: 96,
          letterSpacing: "-0.04em",
        }}
      >
        Blaboard
      </div>
    </div>,
    {
      width: 1200,
      height: 628,
      fonts,
    },
  );
}
