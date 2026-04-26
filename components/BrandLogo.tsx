import React from "react";

interface BrandLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showWordmark?: boolean;
}

const FacetOneMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <polygon points="12,1.8 14.9,8.3 12,10.1 9.1,8.3" />
    <polygon points="22.2,12 15.7,14.9 13.9,12 15.7,9.1" />
    <polygon points="12,22.2 14.9,15.7 12,13.9 9.1,15.7" />
    <polygon points="1.8,12 8.3,14.9 10.1,12 8.3,9.1" />
    <polygon points="12,6.7 17.3,12 12,17.3 6.7,12" />
    <polygon points="16.8,5.2 19.1,7.4 16.8,8.5" opacity="0.6" />
    <polygon points="18.8,16.7 16.7,18.8 15.8,16.6" opacity="0.6" />
    <polygon points="7.2,16.6 5.1,18.8 7.3,19" opacity="0.6" />
    <polygon points="5.2,7.2 7.4,5.1 8.5,7.3" opacity="0.6" />
  </svg>
);

const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  iconClassName,
  textClassName,
  showWordmark = true,
}) => {
  return (
    <div className={className}>
      <span
        className="flex shrink-0 items-center justify-center text-gray-950 dark:text-white"
        aria-hidden="true"
      >
        <FacetOneMark className={iconClassName} />
      </span>
      {showWordmark ? (
        <span className={textClassName}>
          <span className="font-bold">Luxury</span>
          <span className="ml-[0.02em] font-black">UI</span>
        </span>
      ) : null}
    </div>
  );
};

export default BrandLogo;
