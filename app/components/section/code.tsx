import { useEffect, useRef, useState } from "react";
import DropdownButton from "../ui/DropdownButton";
import { Menu } from "~/data/data";
import { useFetcher } from "react-router";
import type { action } from "~/routes/api/generate";

const PLACEHOLDER = `var twoSum = function(nums, target) {
    for(let i = 0; i < nums.length; i++) {
        for(let j = i+1; j < nums.length; j++) {
            if(nums[i] + nums[j] === target){
                return [i, j]
            }
        }
    }
};`;

const EDITOR_FONT = "font-mono text-lg leading-6 whitespace-pre";

const isIndent = (ch: string | undefined) => ch === " " || ch === "\t";

const skipIndentForward = (s: string) => {
  let out = s;
  if (out[out.length - 1] !== "\n") return out;
  while (out.length < PLACEHOLDER.length && isIndent(PLACEHOLDER[out.length])) {
    out += PLACEHOLDER[out.length];
  }
  return out;
};

const skipIndentBackward = (s: string) => {
  let out = s;
  while (out.length > 0 && isIndent(PLACEHOLDER[out.length])) {
    out = out.slice(0, -1);
  }
  return out;
};

const Code = () => {
  const fetcher = useFetcher<typeof action>();
  const onGenerate = () => {
    fetcher.submit(selected, {
      method: "post",
      action: "/api/generate",
      encType: "application/json",
    });
  };
  const targetTextRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState(() => skipIndentForward(""));
  const [open, setOpen] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries(Menu.map((m) => [m.label, m.items[0]])),
  );

  const onSelect = (label: string, item: string) => {
    setSelected((s) => ({ ...s, [label]: item }));
    setOpen(null);
  };

  const handleType = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    const grew = raw.length >= code.length;
    setCode(grew ? skipIndentForward(raw) : skipIndentBackward(raw));
  };

  useEffect(() => {
    if (fetcher.data?.code) setCode(fetcher.data.code);
  }, [fetcher.data]);

  return (
    <section className="w-full min-h-dvh flex flex-col items-center justify-start gap-5 py-10">
      <div className="flex justify-between max-w-4xl w-full z-50">
        <div className="flex gap-5">
          {Menu.map((m) => (
            <DropdownButton
              key={m.label}
              value={m.label}
              open={open}
              setOpen={setOpen}
              selected={selected[m.label]}
              onSelect={(item) => onSelect(m.label, item)}
            />
          ))}
        </div>
        <button
          onClick={onGenerate}
          disabled={fetcher.state !== "idle"}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
        >
          {fetcher.state === "idle" ? "Generate" : "Generating..."}
        </button>
      </div>
      <pre className="w-full max-w-4xl bg-[#161616] h-96 rounded-xl border border-white/20 relative overflow-hidden">
        <code
          ref={targetTextRef}
          aria-hidden
          className={`absolute inset-0 p-4 pointer-events-none ${EDITOR_FONT} text-white/30 whitespace-pre`}
        >
          {PLACEHOLDER.split("").map((char, i) => (
            <span
              key={i}
              className={`${
                i > code.length - 1
                  ? "text-white/30 border-white"
                  : code[i] === char
                    ? "text-white"
                    : "text-red-500"
              } ${i === code.length ? "border-l-2 animate-pulse" : ""}`}
            >
              {char}
            </span>
          ))}
        </code>
        <textarea
          value={code}
          onChange={handleType}
          spellCheck={false}
          className={`absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-transparent resize-none outline-none ${EDITOR_FONT}`}
        />
      </pre>
    </section>
  );
};
export default Code;
