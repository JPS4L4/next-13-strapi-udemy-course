import React from "react";

interface Props {
  text: string;
}

const PageHeader = ({ text }: Props) => {
  return (
    <>
      <h2 className="text-center text-5xl font-extrabold mb-4 dark:text-white">{text}</h2>
    </>
  );
};

export default PageHeader;
