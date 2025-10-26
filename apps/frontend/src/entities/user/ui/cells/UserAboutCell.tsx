"use client";

import { TextIcon } from "lucide-react";
import { FunctionComponent, useMemo, useState } from "react";

import Cell from "@/shared/ui/Cell";
import CopyButton from "@/shared/ui/CopyButton";

interface UserAboutCellProps
  extends Omit<React.ComponentProps<typeof Cell>, "value"> {
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
    <Cell
      before={<TextIcon />}
      label="О себе"
      description={
        <span className="inline-block">
          <span>{displayValue}</span>
          {expandable && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="ms-1 cursor-pointer font-medium text-secondary-foreground transition hover:text-foreground"
            >
              Показать ещё
            </button>
          )}
        </span>
      }
      after={<CopyButton side="left" value={value} />}
      multiline={expanded}
      {...otherProps}
    />
  );
};

export default UserAboutCell;
