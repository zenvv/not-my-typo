export interface SoundOption {
  id: string;
  label: string;
  // null for the "no sound" option.
  fileUrl: string | null;
}

// Add a new sound pack by appending an entry here with a unique `id` and a
// matching WAV file under public/sounds/ — it will automatically show up in
// the sound settings popover.
export const soundOptions: SoundOption[] = [
  { id: "none", label: "No sound", fileUrl: null },
  { id: "soft", label: "Soft", fileUrl: "/sounds/soft.wav" },
  { id: "clicky", label: "Clicky", fileUrl: "/sounds/clicky.wav" },
  { id: "laptop", label: "Laptop", fileUrl: "/sounds/laptop.wav" },
  {
    id: "soft_mechanical",
    label: "Soft Mechanical",
    fileUrl: "/sounds/soft_mechanical.wav",
  },
  { id: "mechanical", label: "Mechanical", fileUrl: "/sounds/mechanical.wav" },
  { id: "typewriter", label: "Typewriter", fileUrl: "/sounds/typewriter.wav" },
];

export const defaultSoundId = "none";
