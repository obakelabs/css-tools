import { RgbaColorPicker, type RgbaColor } from "react-colorful";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const ColorPicker = ({
  color,
  onChange,
}: {
  color: RgbaColor;
  onChange: (color: RgbaColor) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="border-border size-10 cursor-pointer rounded-lg border"
          style={{
            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
          }}
          type="button"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="h-auto w-auto overflow-visible p-0">
        <RgbaColorPicker color={color} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorPicker;
