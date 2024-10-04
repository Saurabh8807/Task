import React from 'react';
import { IconType } from 'react-icons';

interface CardProps {
  title: string;
  count: number;
  color: string;
  Icon: IconType; 
}

const Card: React.FC<CardProps> = ({ title, count, color, Icon }) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer ${color}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Icon size={30} />
      </div>
      <p className="text-4xl font-bold mt-4">{count}</p>
    </div>
  );
};

export default Card;
