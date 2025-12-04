"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
}: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 56, text: "text-2xl" },
  };

  const { icon, text } = sizes[size];

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon */}
      <div
        className="relative flex-shrink-0"
        style={{ width: icon, height: icon }}
      >
        <Image
          src="/logo-icon.svg"
          alt="TADA VTU"
          width={icon}
          height={icon}
          priority
        />
      </div>

      {/* Text */}
      {showText && (
        <div className={`font-bold ${text}`}>
          <span className="text-green-500">TADA</span>
          <span className="text-muted-foreground ml-1">VTU</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

// Logo component without Link wrapper, using the same Image source
export function LogoInline({
  size = "md",
  showText = true,
  className = "",
}: Omit<LogoProps, "href">) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 56, text: "text-2xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon */}
      <div
        className="relative flex-shrink-0"
        style={{ width: icon, height: icon }}
      >
        <Image
          src="/logo-icon.svg"
          alt="TADA VTU"
          width={icon}
          height={icon}
          priority
        />
      </div>

      {/* Text */}
      {showText && (
        <div className={`font-bold ${text}`}>
          <span className="text-green-500">TADA</span>
          <span className="text-muted-foreground ml-1">VTU</span>
        </div>
      )}
    </div>
  );
}
