import Link from "next/link";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

export const Header = () => {

  const menuItems = [
    { name: "Guides", href: "/guides" },
    { name: "T2125 Tax Calculator", href: "/canada-t2125-tax-calculator" },
    { name: "Income Tax Calculator", href: "/canada-income-tax-calculator" },
    { name: "Deduction Finder", href: "/deduction-finder" },
    { name: "Firms", href: "/firms" },
  ]

  return (
    <div className="fixed z-50 top-0 left-0 w-full bg-transparent">
      <header className="flex items-center justify-between container py-4 md:py-4">
        <Link href="/">
          <Logo className="w-[100px] md:w-[120px]" />
        </Link>
        <nav className="flex max-lg:hidden absolute left-1/2 -translate-x-1/2 items-center justify-center gap-x-10">
          {menuItems.map((item) => (
            <Link
              className="text-sm text-nowrap font-bold uppercase inline-block font-mono text-foreground/60 hover:text-foreground/100 duration-150 transition-colors ease-out"
              href={item.href}
              key={item.name}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <MobileMenu />
      </header>
    </div>
  );
};
