import TestControls from "@/features/typing-test/TestControls";
import { useEngineStore } from "@/features/typing-test/engine/engineStore";
import NavLogo from "./NavLogo";

function Navbar() {
  const status = useEngineStore((s) => s.status);

  return (
    <nav className="flex w-full h-16 items-center justify-between p-4">
      <NavLogo />

      <div className="">{status !== "running" && <TestControls />}</div>
    </nav>
  );
}

export default Navbar;
