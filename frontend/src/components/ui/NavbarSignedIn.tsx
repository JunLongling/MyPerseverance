import { Button } from "@/components/ui/Button";

interface NavbarSignedInProps {
  onSignOut: () => void;
}

export function NavbarSignedIn({ onSignOut }: NavbarSignedInProps) {
  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between px-6 py-4 bg-base-100 text-base-content gap-2">
      <h1 className="text-xl font-bold text-primary">
        <a href="/dashboard">MyPerseverance</a>
      </h1>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onSignOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
}
