interface SignatureLogoProps {
  className?: string;
}

export function SignatureLogo({ className }: SignatureLogoProps) {
  return (
    <span
      className={`inline-block font-script leading-none ${className ?? ""}`}
      aria-hidden="true"
    >
      S
    </span>
  );
}
