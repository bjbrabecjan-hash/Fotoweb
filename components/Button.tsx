import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: "gold" | "ghost";
};

type LinkButtonProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

const buttonClasses =
  "inline-flex min-h-12 items-center justify-center border px-6 py-3 text-xs font-semibold uppercase tracking-luxe transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

const variants = {
  gold: "border-gold bg-gold text-white shadow-gold hover:bg-transparent hover:text-gold",
  ghost: "border-ink/15 bg-white/50 text-ink hover:border-gold hover:text-gold"
};

export function Button({ children, className, variant = "gold", ...props }: LinkButtonProps | NativeButtonProps) {
  const classes = cn(buttonClasses, variants[variant], className);

  if (typeof props.href === "string") {
    const linkProps = props as LinkButtonProps;
    return (
      <Link className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as NativeButtonProps;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
