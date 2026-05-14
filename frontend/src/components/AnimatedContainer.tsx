"use client";

import { Box, Fade } from "@mui/material";
import type { ReactNode } from "react";

type AnimatedContainerProps = {
  children: ReactNode;
  delay?: number;
};

export default function AnimatedContainer({ children, delay = 0 }: AnimatedContainerProps) {
  return (
    <Fade in timeout={450}>
      <Box sx={{ minWidth: 0, transitionDelay: `${delay}ms` }}>{children}</Box>
    </Fade>
  );
}
