import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useI18n, LangCode } from "@/lib/i18n";
import { useState } from "react";

const LANGUAGES: { code: LangCode; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

export function LanguageSelector() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{current?.native}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-1" align="end">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => {
              setLang(l.code);
              setOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
              lang === l.code
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted text-foreground"
            }`}
          >
            <span>{l.native}</span>
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
