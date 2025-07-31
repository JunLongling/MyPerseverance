import { Link } from "react-router-dom";
import { buttonBaseStyles, variants, sizes } from "@/components/ui/Button";

export function NavbarSignedOut() {
  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between px-6 py-4 bg-base-100 text-base-content gap-2">
      <h1 className="text-xl font-bold text-primary">
        <Link to="/">MyPerseverance</Link>
      </h1>

      <div className="flex items-center gap-4">
        <Link
          to="/signin"
          className={`${buttonBaseStyles} ${variants.ghost} ${sizes.md} rounded-md inline-flex items-center justify-center`}
        >
          Sign In
        </Link>

        <Link
          to="/signup"
          className={`${buttonBaseStyles} ${variants.outline} ${sizes.md} rounded-full inline-flex items-center justify-center`}
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
