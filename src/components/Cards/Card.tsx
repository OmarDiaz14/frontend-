import React from "react";
import { useNavigate } from "react-router-dom";

export interface CardProps {
  imageSrc: string;
  redirectUrl: string;
  title: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({
  imageSrc,
  redirectUrl,
  title,
  subtitle,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(redirectUrl);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:scale-105 flex flex-col border border-gray-100"
    >
      <div className="relative h-48 md:h-56 flex-shrink-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300" />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
};
