import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const BorderRadiusGenerator = () => {
  const [cssHtml, setCssHtml] = useState("");
  const [tailwindHtml, setTailwindHtml] = useState("");
  const [cssCopyStatus, setCssCopyStatus] = useState<"ready" | "copied">(
    "ready",
  );
  const [tailwindCopyStatus, setTailwindCopyStatus] = useState<
    "ready" | "copied"
  >("ready");

  const [topLeftRadius, setTopLeftRadius] = useState(10);
  const [topRightRadius, setTopRightRadius] = useState(10);
  const [bottomLeftRadius, setBottomLeftRadius] = useState(10);
  const [bottomRightRadius, setBottomRightRadius] = useState(10);

  const [copiedText, copy] = useCopyToClipboard();

  const generatedBorderRadius = `${topLeftRadius}px ${topRightRadius}px ${bottomLeftRadius}px ${bottomRightRadius}px`;

  const CSSCode = ` .border-radius {
    border-radius: ${generatedBorderRadius};
  }`;

  const TailwindCSSCode = ` .border-radius {
    @apply rounded-[${topLeftRadius}px_${topRightRadius}px_${bottomLeftRadius}px_${bottomRightRadius}px];
  }`;

  const handleCopy = (
    code: string,
    copyStatus: "ready" | "copied",
    setCopyStatus: (status: "ready" | "copied") => void,
  ) => {
    if (copyStatus === "ready") {
      copy(code)
        .then(() => {
          setCopyStatus("copied");
          setTimeout(() => {
            setCopyStatus("ready");
          }, 1000);
        })
        .catch((error) => {
          console.error("Failed to copy!", error);
        });
    }
  };

  useEffect(() => {
    const generateHtml = async () => {
      const generatedHtml = await codeToHtml(CSSCode, {
        lang: "css",
        theme: "dracula",
      });
      setCssHtml(generatedHtml);

      const generatedTailwindHtml = await codeToHtml(TailwindCSSCode, {
        lang: "css",
        theme: "dracula",
      });
      setTailwindHtml(generatedTailwindHtml);
    };

    generateHtml();
  }, [CSSCode, TailwindCSSCode]);

  return (
    <div className="flex w-full flex-col gap-y-4">
      <Card className="flex w-full flex-col md:flex-row">
        <div className="flex w-full flex-col gap-y-4 p-4 md:w-1/2">
          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-left-radius">Top Left</Label>
              <Input
                type="number"
                id="top-left-radius"
                name="top-left-radius"
                value={topLeftRadius}
                onChange={(e) => setTopLeftRadius(Number(e.target.value))}
                className="w-16 text-center"
              />
            </div>

            <Slider
              id="top-left-radius"
              name="top-left-radius"
              value={[topLeftRadius]}
              onValueChange={(value) => setTopLeftRadius(value[0])}
              max={150}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-right-radius">Top Right</Label>
              <Input
                type="number"
                id="top-right-radius"
                name="top-right-radius"
                value={topRightRadius}
                onChange={(e) => setTopRightRadius(Number(e.target.value))}
                className="w-16 text-center"
              />
            </div>

            <Slider
              id="top-right-radius"
              name="top-right-radius"
              value={[topRightRadius]}
              onValueChange={(value) => setTopRightRadius(value[0])}
              max={150}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="bottom-left-radius">Bottom Left</Label>
              <Input
                type="number"
                id="bottom-left-radius"
                name="bottom-left-radius"
                value={bottomLeftRadius}
                onChange={(e) => setBottomLeftRadius(Number(e.target.value))}
                className="w-16 text-center"
              />
            </div>

            <Slider
              id="bottom-left-radius"
              name="bottom-left-radius"
              value={[bottomLeftRadius]}
              onValueChange={(value) => setBottomLeftRadius(value[0])}
              max={150}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="bottom-right-radius">Bottom Right</Label>
              <Input
                type="number"
                id="bottom-right-radius"
                name="bottom-right-radius"
                value={bottomRightRadius}
                onChange={(e) => setBottomRightRadius(Number(e.target.value))}
                className="w-16 text-center"
              />
            </div>

            <Slider
              id="bottom-right-radius"
              name="bottom-right-radius"
              value={[bottomRightRadius]}
              onValueChange={(value) => setBottomRightRadius(value[0])}
              max={150}
            />
          </fieldset>
        </div>

        <div>
          <Separator className="md:hidden" orientation="horizontal" />
          <Separator className="hidden md:block" orientation="vertical" />
        </div>

        <div className="flex min-h-[416px] w-full items-center justify-center p-4 md:w-1/2">
          <div
            className="size-40 bg-black"
            style={{ borderRadius: generatedBorderRadius }}
          />
        </div>
      </Card>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 lg:space-x-4">
        <Card className="flex flex-col gap-y-4 p-4 lg:w-[calc(50%-0.5rem)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              CSS Code:
            </h3>

            <Button
              size="sm"
              onClick={() =>
                handleCopy(CSSCode, cssCopyStatus, setCssCopyStatus)
              }
              disabled={cssCopyStatus === "copied"}
              className="h-8 rounded-full bg-indigo-600 hover:bg-indigo-600/90"
              type="button"
            >
              {cssCopyStatus === "copied" ? (
                <>
                  <CheckIcon className="mr-2 size-3" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="mr-2 size-3" />
                  Copy
                </>
              )}
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div dangerouslySetInnerHTML={{ __html: cssHtml }} />
          </CardContent>
        </Card>

        <Card className="flex flex-col gap-y-4 p-4 lg:w-[calc(50%-0.5rem)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Tailwind CSS Code:
            </h3>

            <Button
              size="sm"
              onClick={() =>
                handleCopy(
                  TailwindCSSCode,
                  tailwindCopyStatus,
                  setTailwindCopyStatus,
                )
              }
              disabled={tailwindCopyStatus === "copied"}
              className="h-8 rounded-full bg-indigo-600 hover:bg-indigo-600/90"
              type="button"
            >
              {tailwindCopyStatus === "copied" ? (
                <>
                  <CheckIcon className="mr-2 size-3" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="mr-2 size-3" />
                  Copy
                </>
              )}
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div dangerouslySetInnerHTML={{ __html: tailwindHtml }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BorderRadiusGenerator;
