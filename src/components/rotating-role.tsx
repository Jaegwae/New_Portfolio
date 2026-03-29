"use client";

import { useEffect, useMemo, useState } from "react";

const roles = [
  "PROBLEM SOLVER.",
  "PRODUCT PLANNER.",
  ". . . ?",
  "PRODUCT DEVELOPER.",
  "SYSTEM THINKER.",
] as const;

const TYPE_SPEED = 82;
const DELETE_SPEED = 42;
const HOLD_DELAY = 1300;
const NEXT_DELAY = 220;

type RotatingRoleInnerProps = {
  paused: boolean;
};

export function RotatingRoleInner({ paused }: RotatingRoleInnerProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const longestRole = useMemo(
    () => roles.reduce((longest, role) => (role.length > longest.length ? role : longest), roles[0]),
    [],
  );

  useEffect(() => {
    if (paused) {
      return;
    }

    const currentRole = roles[roleIndex];

    let timeoutId: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed !== currentRole) {
      timeoutId = setTimeout(() => {
        setDisplayed(currentRole.slice(0, displayed.length + 1));
      }, TYPE_SPEED);
    } else if (!isDeleting && displayed === currentRole) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, HOLD_DELAY);
    } else if (isDeleting && displayed.length > 0) {
      timeoutId = setTimeout(() => {
        setDisplayed(currentRole.slice(0, displayed.length - 1));
      }, DELETE_SPEED);
    } else {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((current) => (current + 1) % roles.length);
      }, NEXT_DELAY);
    }

    return () => clearTimeout(timeoutId);
  }, [displayed, isDeleting, paused, roleIndex]);

  return (
    <span className="hero-typed-line__dynamic">
      <span aria-hidden="true" className="hero-typed-line__ghost">
        {longestRole}
      </span>
      <span className="hero-typed-line__current">
        <span className="hero-typed-line__word">{displayed}</span>
        <span aria-hidden="true" className="hero-typed-line__caret" />
      </span>
    </span>
  );
}
