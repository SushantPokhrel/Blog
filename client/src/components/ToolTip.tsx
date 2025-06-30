export const ToolTip = () => {
  return (
    <span className="absolute flex size-2 top-1 right-1">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
      <span className="relative inline-flex size-2 rounded-full bg-sky-500"></span>
    </span>
  );
};
