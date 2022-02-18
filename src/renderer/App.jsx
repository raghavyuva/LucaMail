// import { motion } from 'framer-motion'
import React, { useEffect } from "react";
import Index from "./navigation";
import { applyTheme } from "./themes/themeutil";
function App() {
  useEffect(() => {
    applyTheme("solarized");
    return () => { };
  }, []);

  return (
    <div className=" bg-primary-background text-primary-text ">
      <Index />
    </div>
  );
}



export default App
