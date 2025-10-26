import { cn } from "@/shared/lib/utils";

interface UserProfileCardBackgroundGridProps {
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  iconClass?: string | undefined;
  columns?: number;
  rows?: number;
  sizeClasses?: string[];
  rotateClasses?: string[];
}

const UserProfileCardBackgroundGrid: React.FunctionComponent<
  UserProfileCardBackgroundGridProps
> = ({
  icon: Icon,
  iconClass,
  columns = 8,
  rows = 6,
  sizeClasses = ["size-4", "size-5", "size-6"],
  rotateClasses = ["rotate-0", "rotate-6", "rotate-12"],
}) => {
  return (
    <div
      className="absolute inset-0 -z-10 grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: columns * rows }).map((_, i) => {
        const row = Math.floor(i / columns);
        const column = i % columns;
        const offset = row % 2 === 0 ? 0 : 50;
        const sizeClass = sizeClasses[(column + row) % sizeClasses.length];
        const rotationClass =
          rotateClasses[(column * 2 + row) % rotateClasses.length];

        return (
          <div
            key={i}
            className="relative"
            style={{
              left: `${offset}%`,
              top: `${row * (100 / rows)}%`,
            }}
          >
            {Icon && (
              <Icon
                className={cn(`absolute`, iconClass, sizeClass, rotationClass)}
                style={{
                  left: `${column * (100 / columns)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserProfileCardBackgroundGrid;
