import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTestSettings } from "@/context/TestSettingsContext";
import { languageOptions } from "@/config/modes";
import type { Language } from "@/lib/words/wordSource";

function MobileLanguageButton() {
  const { language, setLanguage } = useTestSettings();
  const [open, setOpen] = useState(false);
  const [draftLanguage, setDraftLanguage] = useState<Language>(language);

  function handleOpenChange(next: boolean) {
    if (next) setDraftLanguage(language);
    setOpen(next);
  }

  function handleApply() {
    setLanguage(draftLanguage);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Language">
          <Globe className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Language</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <ToggleGroup
            type="single"
            orientation="vertical"
            spacing={2}
            value={draftLanguage}
            onValueChange={(value) =>
              value && setDraftLanguage(value as Language)
            }
            className="w-full items-stretch"
            aria-label="Language"
          >
            {languageOptions.map((option) => (
              <ToggleGroupItem
                key={option.id}
                value={option.id}
                className="w-full justify-start"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <DialogFooter className="rounded-t-none grid grid-cols-2 gap-4 m-0!">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MobileLanguageButton;
