import React, { createContext } from "react";
export const ContentContext = createContext({});
export function ContentProvider({ data = {}, children }) {
  return (
    <ContentContext.Provider value={data}>{children}</ContentContext.Provider>
  );
}
