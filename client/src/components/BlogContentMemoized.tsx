import React from "react";

type ContentProps = {
  content: string;
  className: string;
};

const ContentDisplay: React.FC<ContentProps> = ({ content, className }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} className={className} />
  );
};

// Wrap with React.memo for memoization:
const MemoizedContentDisplay = React.memo(ContentDisplay);

export default MemoizedContentDisplay;
// until props change the memoized child component do not re render based on parent re rendering