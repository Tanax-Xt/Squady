"use client";

import { useEffect, useState } from "react";

import { getRandomSkillName } from "./getRandomSkillName";

export type UseRandomSkillNameInterval = {
  delay?: number;
};

export const useRandomSkillNameInterval = ({
  delay = 1500,
}: UseRandomSkillNameInterval = {}) => {
  const [name, setName] = useState(getRandomSkillName());

  useEffect(() => {
    const interval = setInterval(() => {
      setName(getRandomSkillName());
    }, delay);

    return () => {
      clearInterval(interval);
    };
  });

  return name;
};
