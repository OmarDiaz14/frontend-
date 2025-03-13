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
      className="group relative cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105 flex flex-col border border-gray-100"
    >
      <div className="relative h-56 w-full flex items-center justify-center overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-contain hover:object-scale-down transition-all duration-300"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600 line-clamp-3">{subtitle}</p>
        )}
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white bg-black/40 rounded-full p-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>
    </div>
  );
};
