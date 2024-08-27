import { useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { type RgbaColor } from "react-colorful";
import ColorPicker from "./color-picker";
import { Slider } from "./ui/slider";
import { codeToHtml } from "shiki";
import { Button } from "./ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { CheckIcon, CopyIcon } from "lucide-react";

const BoxShadowGenerator = () => {
  const [html, setHtml] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<"ready" | "copied">("ready");

  const [horizontalLength, setHorizontalLength] = useState(0);
  const [verticalLength, setVerticalLength] = useState(0);
  const [blurRadius, setBlurRadius] = useState(0);
  const [spreadRadius, setSpreadRadius] = useState(0);
  const [shadowColor, setShadowColor] = useState<RgbaColor>({
    r: 0,
    g: 0,
    b: 0,
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

  const handleCopy = useCallback(() => {
    if (copyStatus === "ready") {
      copy(CSSCode)
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
  }, [copy, CSSCode, copyStatus]);

  useEffect(() => {
    const generateHtml = async () => {
      const generatedHtml = await codeToHtml(CSSCode, {
        lang: "css",
        theme: "dracula",
      });
      setHtml(generatedHtml);
    };

    generateHtml();
  }, [CSSCode]);

  return (
    <div className="flex w-full max-w-5xl flex-col gap-y-4">
      <Card className="flex w-full gap-x-4 px-4">
        <div className="flex w-1/2 flex-col gap-y-6 py-4">
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
              min={-100}
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

        <Separator orientation="vertical" />

        <div className="flex w-1/2 items-center justify-center py-4">
          <div
            className="size-40 bg-black shadow-md"
            style={{ boxShadow: generatedBoxShadow }}
          />
        </div>
      </Card>

      <Card className="flex w-1/2 flex-col gap-y-4 p-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
          <CardTitle>CSS Code:</CardTitle>

          <Button
            size="sm"
            onClick={handleCopy}
            disabled={copyStatus === "copied"}
            className="h-8 rounded-full bg-indigo-600 hover:bg-indigo-600/90"
            type="button"
          >
            {copyStatus === "copied" ? (
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
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BoxShadowGenerator;
