type ProductArtProps = {
  color?: string;
  label?: string;
  shape?: "dropper" | "jar" | "tube";
  compact?: boolean;
};

export function ProductArt({
  color = "#b8cfa7",
  label = "EQUA",
  shape = "dropper",
  compact = false,
}: ProductArtProps) {
  return (
    <div
      className={`product-art ${compact ? "product-art--compact" : ""}`}
      style={{ "--product-color": color } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="product-art__halo" />
      <span className={`product-art__pack product-art__pack--${shape}`}>
        <span className="product-art__cap" />
        <span className="product-art__label">
          <strong>{label}</strong>
          <small>skin ritual</small>
        </span>
      </span>
      <span className="product-art__shadow" />
    </div>
  );
}
