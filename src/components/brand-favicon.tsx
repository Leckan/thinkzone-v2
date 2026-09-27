import Image from "next/image";

export function BrandFavicon({
  className = "",
  inverse = false,
}: {
  className?: string;
  inverse?: boolean;
}) {
  return (
    <Image
      src="/icon.svg"
      alt=""
      aria-hidden="true"
      width={64}
      height={64}
      className={`brand-favicon${inverse ? " brand-favicon-inverse" : ""}${className ? ` ${className}` : ""}`}
    />
  );
}
