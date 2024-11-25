import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
}

export function Leaderboard({ entries, currentUserRank }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-500">
          {rank}
        </span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Leaderboard</h2>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              entry.rank === currentUserRank
                ? 'bg-blue-50 border-2 border-blue-200'
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {getRankIcon(entry.rank)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{entry.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{entry.score} points</span>
                  <span>•</span>
                  <span>{entry.streak} day streak</span>
                </div>
              </div>
              <div className="flex-shrink-0 flex space-x-1">
                {entry.badges.slice(0, 3).map((badge, i) => (
                  <span key={i} className="text-lg" title={badge}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}