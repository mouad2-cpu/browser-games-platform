import {
  resolveCategoryIconKey,
  getCategoryIconComponent,
  isCategoryIconImage,
  CATEGORY_ICON_COLOR,
  CATEGORY_ICON_SIZES,
} from "@/lib/category-icons";

type Props = {
  icon: string | null;
  name: string;
  slug?: string;
  size?: keyof typeof CATEGORY_ICON_SIZES;
  className?: string;
};

export function CategoryIcon({ icon, name, slug, size = "md", className = "" }: Props) {
  const px = CATEGORY_ICON_SIZES[size];

  if (isCategoryIconImage(icon)) {
    return (
      <img
        src={icon!}
        alt=""
        width={px}
        height={px}
        className={`rounded-lg object-cover ${className}`}
        style={{ width: px, height: px }}
      />
    );
  }

  const iconKey = resolveCategoryIconKey(icon, slug);
  const Icon = getCategoryIconComponent(iconKey);

  return (
    <Icon
      size={px}
      strokeWidth={1.75}
      color={CATEGORY_ICON_COLOR}
      className={className}
      aria-hidden
    />
  );
}
