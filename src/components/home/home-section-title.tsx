type Props = {
  children: React.ReactNode;
  className?: string;
};

/** Homepage section headings at 24px / bold. */
export function HomeSectionTitle({ children, className = "" }: Props) {
  return (
    <h2 className={`text-[24px] font-bold leading-tight ${className}`.trim()}>
      {children}
    </h2>
  );
}
