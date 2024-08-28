import { useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { type RgbaColor } from "react-colorful";
import ColorPicker from "./color-picker";
import { Slider } from "./ui/slider";
import { codeToHtml } from "shiki";
import { Button } from "./ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { CheckIcon, CopyIcon } from "lucide-react";

const BoxShadowGenerator = () => {
  const [cssHtml, setCssHtml] = useState<string>("");
  const [tailwindHtml, setTailwindHtml] = useState<string>("");
  const [cssCopyStatus, setCssCopyStatus] = useState<"ready" | "copied">(
    "ready",
  );
  const [tailwindCopyStatus, setTailwindCopyStatus] = useState<
    "ready" | "copied"
  >("ready");

  const [horizontalLength, setHorizontalLength] = useState(10);
  const [verticalLength, setVerticalLength] = useState(10);
  const [blurRadius, setBlurRadius] = useState(10);
  const [spreadRadius, setSpreadRadius] = useState(0);
  const [shadowColor, setShadowColor] = useState<RgbaColor>({
    r: 79,
    g: 70,
    b: 229,
    a: 1,
  });
  const [inset, setInset] = useState(false);

  const [copiedText, copy] = useCopyToClipboard();

  const generatedBoxShadow = `${inset ? "inset " : ""}${horizontalLength}px ${verticalLength}px ${blurRadius}px ${spreadRadius}px rgba(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b}, ${shadowColor.a})`;

  const CSSCode = ` .shadow {
    -webkit-box-shadow: ${generatedBoxShadow};
    -moz-box-shadow: ${generatedBoxShadow};
    box-shadow: ${generatedBoxShadow};
  }`;

  const TailwindCSSCode = ` .shadow {
    @apply shadow-[${inset ? "inset_" : ""}${horizontalLength}px_${verticalLength}px_${blurRadius}px_${spreadRadius}px_rgba(${shadowColor.r},${shadowColor.g},${shadowColor.b},${shadowColor.a})];
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
    <div className="flex w-full max-w-5xl flex-col gap-y-4">
      <Card className="flex w-full gap-x-4 px-4">
        <div className="flex w-1/2 flex-col gap-y-4 py-4">
          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="horizontal-length">Horizontal Length</Label>
              <Input
                type="number"
                id="horizontal-length"
                name="horizontal-length"
                value={horizontalLength}
                onChange={(e) => setHorizontalLength(Number(e.target.value))}
                className="w-16 text-center"
              />
            </div>

            <Slider
              id="horizontal-length"
              name="horizontal-length"
              value={[horizontalLength]}
              onValueChange={(value) => setHorizontalLength(value[0])}
              min={-100}
              max={100}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="vertical-length">Vertical Length</Label>
              <Input
                type="number"
                id="vertical-length"
                name="vertical-length"
                value={verticalLength}
                onChange={(e) => setVerticalLength(Number(e.target.value))}
                className="w-16 text-center"
              />
            </div>

            <Slider
              id="vertical-length"
              name="vertical-length"
              value={[verticalLength]}
              onValueChange={(value) => setVerticalLength(value[0])}
              min={-100}
              max={100}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="blur-radius">Blur Radius</Label>
              <Input
                type="number"
                id="blur-radius"
                name="blur-radius"
                value={blurRadius}
                onChange={(e) => setBlurRadius(Number(e.target.value))}
                className="w-16 text-center"
              />
            </div>

            <Slider
              id="blur-radius"
              name="blur-radius"
              value={[blurRadius]}
              onValueChange={(value) => setBlurRadius(value[0])}
              min={0}
              max={100}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="spread-radius">Spread Radius</Label>
              <Input
                type="number"
                id="spread-radius"
                name="spread-radius"
                value={spreadRadius}
                onChange={(e) => setSpreadRadius(Number(e.target.value))}
                className="w-16 text-center"
              />
            </div>

            <Slider
              id="spread-radius"
              name="spread-radius"
              value={[spreadRadius]}
              onValueChange={(value) => setSpreadRadius(value[0])}
              min={-100}
              max={100}
            />
          </fieldset>

          <fieldset className="flex items-center justify-between">
            <Label htmlFor="color">Shadow Color</Label>
            <ColorPicker color={shadowColor} onChange={setShadowColor} />
          </fieldset>

          <fieldset className="flex items-center justify-between">
            <Label htmlFor="inset">Inset</Label>
            <Switch
              id="inset"
              name="inset"
              checked={inset}
              onCheckedChange={setInset}
            />
          </fieldset>
        </div>

        <div>
          <Separator orientation="vertical" />
        </div>

        <div className="flex w-1/2 items-center justify-center py-4">
          <div
            className="size-40 rounded-lg bg-black shadow-md"
            style={{ boxShadow: generatedBoxShadow }}
          />
        </div>
      </Card>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 lg:space-x-4">
        <Card className="flex flex-col gap-y-4 p-4 lg:w-[calc(50%-0.5rem)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              CSS Code:
            </h2>

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
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Tailwind CSS Code:
            </h2>

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

export default BoxShadowGenerator;
