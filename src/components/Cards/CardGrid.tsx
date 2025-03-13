import React from "react";
import { Card, CardProps } from "./Card";

interface CardGridProps {
  cards: CardProps[];
  columns?: 2 | 3 | 4;
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, columns = 3 }) => {
  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className={`grid gap-8 ${gridClasses[columns]} w-full max-w-7xl`}>
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};
