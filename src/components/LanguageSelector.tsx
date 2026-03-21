import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

export function LanguageSelector() {
  const [selected, setSelected] = useState("en");
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === selected);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{current?.native}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="end">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              setSelected(lang.code);
              setOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
              selected === lang.code
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted text-foreground"
            }`}
          >
            <span>{lang.native}</span>
            <span className="text-xs text-muted-foreground">{lang.label}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
