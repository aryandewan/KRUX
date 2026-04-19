import { ChevronDown } from "lucide-react";
import DropdownMenu from "./DropdownMenu";

type DropdownButtonProps = {
    value: string;
    open: string | null;
    setOpen: (label: string | null) => void;
    selected: string;
    onSelect: (item: string) => void;
}

const DropdownButton = ({ value, open, setOpen, selected, onSelect }: DropdownButtonProps) => {
    const isOpen = open === value;
    const toggleDropdown = () => {
      setOpen(isOpen ? null : value);
    }

  return (
    <div
      onClick={toggleDropdown}
      className="bg-[#161616] px-4 py-2 rounded-xl w-fit flex items-center justify-between gap-2 cursor-pointer border border-white/20 relative"
    >
      <h1 className="font-bold">
        {selected}
      </h1>
      <ChevronDown size={20} />
      <DropdownMenu isOpen={isOpen} value={value} onSelect={onSelect} />
    </div>
  );
}
export default DropdownButton
