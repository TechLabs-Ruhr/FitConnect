import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

 

  return (
    <AppContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </AppContext.Provider>
  );
};