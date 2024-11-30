const Spinner = ({ size = 24, strokeWidth = 2 }) => {
  return (
    <div className="animate-spin">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#F7931A"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a10 10 0 1 0 10 10" fill="none" />
      </svg>
    </div>
  );
};

export default Spinner;
