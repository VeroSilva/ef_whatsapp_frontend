import React, { useState, ReactNode } from "react";
import { IconChevron } from "../Icons/IconChevron";

interface AccordionProps {
  title: string;
  titleClassname: string;
  children: ReactNode;
  defaultIsOpen?: boolean
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, titleClassname, defaultIsOpen }) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen ?? false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={toggleAccordion}
        className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200"
      >
        <span className={titleClassname}>{title}</span>
        <span>
            <IconChevron classes={`w-4 h-4 duration-200 ${isOpen ? "rotate-270" : "rotate-90"}`} />
        </span>
      </button>
      {isOpen && (
        <div className="p-4 text-gray-600 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
};