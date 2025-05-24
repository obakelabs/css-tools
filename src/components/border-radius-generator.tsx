import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shiki";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

type CopyStatus = "ready" | "copied";

interface BorderRadiusControls {
  topLeftRadius: number;
  topRightRadius: number;
  bottomLeftRadius: number;
  bottomRightRadius: number;
}

const BorderRadiusGenerator = () => {
  const [controls, setControls] = useState<BorderRadiusControls>({
    topLeftRadius: 10,
    topRightRadius: 10,
    bottomLeftRadius: 10,
    bottomRightRadius: 10,
  });

  const [cssHtml, setCssHtml] = useState("");
  const [tailwindHtml, setTailwindHtml] = useState("");
  const [cssCopyStatus, setCssCopyStatus] = useState<CopyStatus>("ready");
  const [tailwindCopyStatus, setTailwindCopyStatus] =
    useState<CopyStatus>("ready");

  const [copiedText, copy] = useCopyToClipboard();

  const generatedBorderRadius = useMemo(() => {
    const {
      topLeftRadius,
      topRightRadius,
      bottomLeftRadius,
      bottomRightRadius,
    } = controls;
    return `${topLeftRadius}px ${topRightRadius}px ${bottomLeftRadius}px ${bottomRightRadius}px`;
  }, [controls]);

  const CSSCode = useMemo(
    () => ` .border-radius {
    border-radius: ${generatedBorderRadius};
  }`,
    [generatedBorderRadius],
  );

  const TailwindCSSCode = useMemo(
    () => ` .border-radius {
    @apply rounded-[${controls.topLeftRadius}px_${controls.topRightRadius}px_${controls.bottomLeftRadius}px_${controls.bottomRightRadius}px];
  }`,
    [controls],
  );

  const handleCopy = (
    code: string,
    copyStatus: CopyStatus,
    setCopyStatus: (status: CopyStatus) => void,
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
      const [generatedHtml, generatedTailwindHtml] = await Promise.all([
        codeToHtml(CSSCode, {
          lang: "css",
          theme: "dracula",
        }),
        codeToHtml(TailwindCSSCode, {
          lang: "css",
          theme: "dracula",
        }),
      ]);

      setCssHtml(generatedHtml);
      setTailwindHtml(generatedTailwindHtml);
    };

    generateHtml();
  }, [CSSCode, TailwindCSSCode]);

  const handleControlChange = (
    key: keyof BorderRadiusControls,
    value: number,
  ) => {
    setControls((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="flex w-full flex-col gap-y-4"
      role="region"
      aria-label="Border Radius Generator"
    >
      <Card className="flex w-full flex-col gap-0 md:flex-row">
        <div className="flex w-full flex-col gap-y-4 p-4 md:w-1/2">
          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-left-radius">Top Left</Label>
              <Input
                type="number"
                id="top-left-radius"
                name="top-left-radius"
                value={controls.topLeftRadius}
                onChange={(e) =>
                  handleControlChange("topLeftRadius", Number(e.target.value))
                }
                className="w-16 text-center"
                aria-label="Top left radius in pixels"
              />
            </div>

            <Slider
              id="top-left-radius"
              name="top-left-radius"
              value={[controls.topLeftRadius]}
              onValueChange={(value) =>
                handleControlChange("topLeftRadius", value[0])
              }
              max={150}
              aria-label="Adjust top left radius"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-right-radius">Top Right</Label>
              <Input
                type="number"
                id="top-right-radius"
                name="top-right-radius"
                value={controls.topRightRadius}
                onChange={(e) =>
                  handleControlChange("topRightRadius", Number(e.target.value))
                }
                className="w-16 text-center"
                aria-label="Top right radius in pixels"
              />
            </div>

            <Slider
              id="top-right-radius"
              name="top-right-radius"
              value={[controls.topRightRadius]}
              onValueChange={(value) =>
                handleControlChange("topRightRadius", value[0])
              }
              max={150}
              aria-label="Adjust top right radius"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="bottom-left-radius">Bottom Left</Label>
              <Input
                type="number"
                id="bottom-left-radius"
                name="bottom-left-radius"
                value={controls.bottomLeftRadius}
                onChange={(e) =>
                  handleControlChange(
                    "bottomLeftRadius",
                    Number(e.target.value),
                  )
                }
                className="w-16 text-center"
                aria-label="Bottom left radius in pixels"
              />
            </div>

            <Slider
              id="bottom-left-radius"
              name="bottom-left-radius"
              value={[controls.bottomLeftRadius]}
              onValueChange={(value) =>
                handleControlChange("bottomLeftRadius", value[0])
              }
              max={150}
              aria-label="Adjust bottom left radius"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="bottom-right-radius">Bottom Right</Label>
              <Input
                type="number"
                id="bottom-right-radius"
                name="bottom-right-radius"
                value={controls.bottomRightRadius}
                onChange={(e) =>
                  handleControlChange(
                    "bottomRightRadius",
                    Number(e.target.value),
                  )
                }
                className="w-16 text-center"
                aria-label="Bottom right radius in pixels"
              />
            </div>

            <Slider
              id="bottom-right-radius"
              name="bottom-right-radius"
              value={[controls.bottomRightRadius]}
              onValueChange={(value) =>
                handleControlChange("bottomRightRadius", value[0])
              }
              max={150}
              aria-label="Adjust bottom right radius"
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
            aria-label="Preview of the border radius"
          />
        </div>
      </Card>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 lg:space-x-4">
        <Card className="flex flex-col gap-y-4 p-4 lg:w-[calc(50%-0.5rem)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <h3 className="text-2xl leading-none font-semibold tracking-tight">
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
              aria-label={
                cssCopyStatus === "copied" ? "CSS code copied" : "Copy CSS code"
              }
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
            <h3 className="text-2xl leading-none font-semibold tracking-tight">
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
              aria-label={
                tailwindCopyStatus === "copied"
                  ? "Tailwind CSS code copied"
                  : "Copy Tailwind CSS code"
              }
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
