"use client";

import { createContext, useContext } from "react";

const SiteContext = createContext<string>("dataware");

export const SiteProvider = SiteContext.Provider;

export function useSite() {
  return useContext(SiteContext);
}
