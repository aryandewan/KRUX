import { Menu } from "~/data/data";

interface DropdownMenuProps {
  value?: string;
  isOpen: boolean;
  onSelect: (item: string) => void;
}

const DropdownMenu = ({ isOpen, value, onSelect }: DropdownMenuProps) => {
  return (
    <div
      className={`absolute top-13 left-0 grid transition-[grid-template-rows,opacity] duration-200 ease-in ${
        isOpen ? "grid-rows-[1fr] visible" : "grid-rows-[0fr] invisible"
      }`}
    >
      <div className="min-h-0 w-full">
        <div className="w-full bg-[#161616] border border-white/20 rounded-xl p-3 flex flex-col gap-3">
          {Menu.find((m) => m.label === value)?.items.map((item) => (
            <div
              key={item}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              className="text-lg px-3 py-1 rounded-md hover:bg-white/20 cursor-pointer whitespace-nowrap"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DropdownMenu;
