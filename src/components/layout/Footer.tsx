import SettingsBar from "./settings/SettingsBar";

function Footer() {
  return (
    <footer className="flex items-center justify-between w-full p-4 text-gray-500">
      <p className="text-xs">
        <a
          target="_blank"
          className="transition-all hover:underline hover:text-primary"
          href="https://monkeytype.com/"
        >
          monkeytype
        </a>{" "}
        clone made by:{" "}
        <a
          className="transition-all hover:underline hover:text-primary"
          target="_blank"
          href="https://github.com/zenvv"
        >
          zenvv
        </a>
      </p>
      <div className="justify-self-end">
        <SettingsBar />
      </div>
    </footer>
  );
}

export default Footer;
