"use client";

import { TextIcon } from "lucide-react";
import { FunctionComponent, useMemo, useState } from "react";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item";

interface UserAboutCellProps
  extends Omit<React.ComponentProps<typeof Item>, "value"> {
  value: string;
  slice?: number;
}

const UserAboutCell: FunctionComponent<UserAboutCellProps> = ({
  value,
  slice = 32,
  ...otherProps
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasNewLine = useMemo(() => value.includes("\n"), [value]);
  const expandable = useMemo(
    () => hasNewLine || value.length > slice,
    [value, slice, hasNewLine],
  );
  const sliced = useMemo(() => {
    const index = hasNewLine ? value.indexOf("\n") : slice;
    return `${value.slice(0, index).trim()}…`;
  }, [value, slice, expanded, hasNewLine]);
  const displayValue = useMemo(() => {
    return expanded || !expandable ? value : sliced;
  }, [value, expanded, expandable, sliced]);

  return (
    <Item size="sm" {...otherProps}>
      <ItemMedia className="mt-2 mb-auto">
        <TextIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>О себе</ItemTitle>
        <ItemDescription className="line-clamp-1">
          <span className="inline-block">
            <span className={expanded ? "whitespace-pre-wrap" : undefined}>
              {displayValue}
            </span>
            {expandable && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="ms-1 underline underline-offset-4 hover:text-primary"
              >
                Показать ещё
              </button>
            )}
          </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default UserAboutCell;
