import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type RgbaColor } from "react-colorful";
import { codeToHtml } from "shiki";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

import ColorPicker from "./color-picker";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";

type CopyStatus = "ready" | "copied";

interface ShadowControls {
  horizontalLength: number;
  verticalLength: number;
  blurRadius: number;
  spreadRadius: number;
  shadowColor: RgbaColor;
  inset: boolean;
}

const BoxShadowGenerator = () => {
  const [controls, setControls] = useState<ShadowControls>({
    horizontalLength: 10,
    verticalLength: 10,
    blurRadius: 10,
    spreadRadius: 0,
    shadowColor: {
      r: 79,
      g: 70,
      b: 229,
      a: 1,
    },
    inset: false,
  });

  const [cssHtml, setCssHtml] = useState("");
  const [tailwindHtml, setTailwindHtml] = useState("");
  const [cssCopyStatus, setCssCopyStatus] = useState<CopyStatus>("ready");
  const [tailwindCopyStatus, setTailwindCopyStatus] =
    useState<CopyStatus>("ready");

  const [copiedText, copy] = useCopyToClipboard();

  const generatedBoxShadow = useMemo(() => {
    const {
      horizontalLength,
      verticalLength,
      blurRadius,
      spreadRadius,
      shadowColor,
      inset,
    } = controls;
    return `${inset ? "inset " : ""}${horizontalLength}px ${verticalLength}px ${blurRadius}px ${spreadRadius}px rgba(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b}, ${shadowColor.a})`;
  }, [controls]);

  const CSSCode = useMemo(
    () => ` .shadow {
    -webkit-box-shadow: ${generatedBoxShadow};
    -moz-box-shadow: ${generatedBoxShadow};
    box-shadow: ${generatedBoxShadow};
  }`,
    [generatedBoxShadow],
  );

  const TailwindCSSCode = useMemo(
    () => ` .shadow {
    @apply shadow-[${controls.inset ? "inset_" : ""}${controls.horizontalLength}px_${controls.verticalLength}px_${controls.blurRadius}px_${controls.spreadRadius}px_rgba(${controls.shadowColor.r},${controls.shadowColor.g},${controls.shadowColor.b},${controls.shadowColor.a})];
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
    key: keyof ShadowControls,
    value: number | boolean | RgbaColor,
  ) => {
    setControls((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="flex w-full flex-col gap-y-4"
      role="region"
      aria-label="Box Shadow Generator"
    >
      <Card className="flex w-full flex-col gap-0 md:flex-row">
        <div className="flex w-full flex-col gap-y-4 p-4 md:w-1/2">
          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="horizontal-length">Horizontal Length</Label>
              <Input
                type="number"
                id="horizontal-length"
                name="horizontal-length"
                value={controls.horizontalLength}
                onChange={(e) =>
                  handleControlChange(
                    "horizontalLength",
                    Number(e.target.value),
                  )
                }
                className="w-16 text-center"
                aria-label="Horizontal length in pixels"
              />
            </div>

            <Slider
              id="horizontal-length"
              name="horizontal-length"
              value={[controls.horizontalLength]}
              onValueChange={(value) =>
                handleControlChange("horizontalLength", value[0])
              }
              min={-100}
              max={100}
              aria-label="Adjust horizontal length"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="vertical-length">Vertical Length</Label>
              <Input
                type="number"
                id="vertical-length"
                name="vertical-length"
                value={controls.verticalLength}
                onChange={(e) =>
                  handleControlChange("verticalLength", Number(e.target.value))
                }
                className="w-16 text-center"
                aria-label="Vertical length in pixels"
              />
            </div>

            <Slider
              id="vertical-length"
              name="vertical-length"
              value={[controls.verticalLength]}
              onValueChange={(value) =>
                handleControlChange("verticalLength", value[0])
              }
              min={-100}
              max={100}
              aria-label="Adjust vertical length"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="blur-radius">Blur Radius</Label>
              <Input
                type="number"
                id="blur-radius"
                name="blur-radius"
                value={controls.blurRadius}
                onChange={(e) =>
                  handleControlChange("blurRadius", Number(e.target.value))
                }
                className="w-16 text-center"
                aria-label="Blur radius in pixels"
              />
            </div>

            <Slider
              id="blur-radius"
              name="blur-radius"
              value={[controls.blurRadius]}
              onValueChange={(value) =>
                handleControlChange("blurRadius", value[0])
              }
              min={0}
              max={100}
              aria-label="Adjust blur radius"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="spread-radius">Spread Radius</Label>
              <Input
                type="number"
                id="spread-radius"
                name="spread-radius"
                value={controls.spreadRadius}
                onChange={(e) =>
                  handleControlChange("spreadRadius", Number(e.target.value))
                }
                className="w-16 text-center"
                aria-label="Spread radius in pixels"
              />
            </div>

            <Slider
              id="spread-radius"
              name="spread-radius"
              value={[controls.spreadRadius]}
              onValueChange={(value) =>
                handleControlChange("spreadRadius", value[0])
              }
              min={-100}
              max={100}
              aria-label="Adjust spread radius"
            />
          </fieldset>

          <fieldset className="flex items-center justify-between">
            <Label htmlFor="color">Shadow Color</Label>
            <ColorPicker
              color={controls.shadowColor}
              onChange={(color) => handleControlChange("shadowColor", color)}
              aria-label="Select shadow color"
            />
          </fieldset>

          <fieldset className="flex items-center justify-between">
            <Label htmlFor="inset">Inset</Label>
            <Switch
              id="inset"
              name="inset"
              checked={controls.inset}
              onCheckedChange={(checked) =>
                handleControlChange("inset", checked)
              }
              aria-label="Toggle inset shadow"
            />
          </fieldset>
        </div>

        <div>
          <Separator className="md:hidden" orientation="horizontal" />
          <Separator className="hidden md:block" orientation="vertical" />
        </div>

        <div className="flex min-h-[416px] w-full items-center justify-center p-4 md:w-1/2">
          <div
            className="size-40 rounded-lg bg-black"
            style={{ boxShadow: generatedBoxShadow }}
            aria-label="Preview of the box shadow"
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

export default BoxShadowGenerator;
