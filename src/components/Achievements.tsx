import React from 'react';
import { Trophy, Award, Flame } from 'lucide-react';
import { UserStats, Badge } from '../types';
import { BADGES } from '../utils/achievements';

interface AchievementsProps {
  stats: UserStats;
}

export function Achievements({ stats }: AchievementsProps) {
  const getBadgeIcon = (badge: Badge) => {
    switch (badge.icon) {
      case '🏆':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case '🔥':
        return <Flame className="w-6 h-6 text-red-500" />;
      default:
        return <Award className="w-6 h-6 text-blue-500" />;
    }
  };

  const calculateProgress = (badge: Badge) => {
    const achievement = stats.achievements.find(a => a.badgeId === badge.id);
    if (achievement) return 100;

    switch (badge.condition.type) {
      case 'score':
        return Math.min(100, (stats.averageScore / badge.condition.value) * 100);
      case 'streak':
        return Math.min(100, (stats.streak / badge.condition.value) * 100);
      case 'completion':
        return Math.min(100, (stats.totalTests / badge.condition.value) * 100);
      case 'speed':
        const averageTime = stats.totalTimeTaken / stats.totalTests;
        return Math.min(100, (badge.condition.value / averageTime) * 100);
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BADGES.map(badge => {
          const progress = calculateProgress(badge);
          const isEarned = progress >= 100;

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 ${
                isEarned ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {getBadgeIcon(badge)}
                <div>
                  <h3 className="font-semibold text-gray-800">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}