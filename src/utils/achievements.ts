import { Badge, UserStats, Achievement } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Achieve 100% on a test',
    icon: '🏆',
    condition: { type: 'score', value: 100 }
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a test in under 5 minutes',
    icon: '⚡',
    condition: { type: 'speed', value: 300 }
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Complete tests for 5 days in a row',
    icon: '🔥',
    condition: { type: 'streak', value: 5 }
  },
  {
    id: 'test_warrior',
    name: 'Test Warrior',
    description: 'Complete 10 tests',
    icon: '⚔️',
    condition: { type: 'completion', value: 10 }
  }
];

export function checkAchievements(stats: UserStats): Achievement[] {
  const newAchievements: Achievement[] = [];
  const now = Date.now();

  BADGES.forEach(badge => {
    const existing = stats.achievements.find(a => a.badgeId === badge.id);
    if (existing) return;

    let progress = 0;
    switch (badge.condition.type) {
      case 'score':
        progress = (stats.averageScore / badge.condition.value) * 100;
        if (stats.averageScore >= badge.condition.value) {
          newAchievements.push({ badgeId: badge.id, earnedAt: now, progress: 100 });
        }
        break;
      case 'streak':
        progress = (stats.streak / badge.condition.value) * 100;
        if (stats.streak >= badge.condition.value) {
          newAchievements.push({ badgeId: badge.id, earnedAt: now, progress: 100 });
        }
        break;
      case 'completion':
        progress = (stats.totalTests / badge.condition.value) * 100;
        if (stats.totalTests >= badge.condition.value) {
          newAchievements.push({ badgeId: badge.id, earnedAt: now, progress: 100 });
        }
        break;
      case 'speed':
        const averageTime = stats.totalTimeTaken / stats.totalTests;
        progress = (badge.condition.value / averageTime) * 100;
        if (averageTime <= badge.condition.value) {
          newAchievements.push({ badgeId: badge.id, earnedAt: now, progress: 100 });
        }
        break;
    }
  });

  return newAchievements;
}