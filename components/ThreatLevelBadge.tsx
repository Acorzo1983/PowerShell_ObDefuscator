// version 0.2.0
import React from 'react';

interface ThreatLevelBadgeProps {
  level: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational' | 'Unknown' | string;
}

const ThreatLevelBadge: React.FC<ThreatLevelBadgeProps> = ({ level }) => {
  const levelColorClasses: { [key: string]: string } = {
    'Critical': 'bg-red-700 text-red-100',
    'High': 'bg-red-500 text-white',
    'Medium': 'bg-yellow-500 text-white',
    'Low': 'bg-green-500 text-white',
    'Informational': 'bg-blue-500 text-white',
    'Unknown': 'bg-gray-500 text-white',
  };

  const color = levelColorClasses[level] || 'bg-gray-600 text-gray-100';

  return (
    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${color}`}>
      {level}
    </span>
  );
};

export default ThreatLevelBadge;
