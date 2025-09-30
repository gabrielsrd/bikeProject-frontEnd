import React, { useState, memo } from "react";
import { Accordion } from "react-bootstrap";

// Componente Accordion isolado que não sofre com re-renders externos
const StableAccordion = memo(({ children, defaultActiveKey = "0" }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  const handleSelect = (eventKey) => {
    setActiveKey(eventKey);
  };

  return (
    <Accordion 
      activeKey={activeKey} 
      onSelect={handleSelect}
      flush
    >
      {children}
    </Accordion>
  );
});

StableAccordion.displayName = 'StableAccordion';

export default StableAccordion;