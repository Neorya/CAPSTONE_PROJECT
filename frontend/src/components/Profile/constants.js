/**
 * Constants for Profile component
 */

export const ERROR_MESSAGES = {
  LOAD_FAILED: 'Failed to load profile.',
  UPDATE_FAILED: 'Failed to update profile.',
};

export const SUCCESS_MESSAGES = {
  UPDATED: 'Profile updated successfully',
};

/**
 * Maps badge names to their corresponding icon paths
 */
export const BADGE_ICON_MAP = {
  // TopN badges
  'Champion': '/badges/TopN/1.png',
  'Podium Master': '/badges/TopN/3.png',
  'Elite Performer': '/badges/TopN/5.png',
  'Rising Star': '/badges/TopN/10.png',

  // FindingCodeFailures badges
  'Bug Hunter': '/badges/FindingCodeFailures/5.png',
  'Bug Tracker': '/badges/FindingCodeFailures/10.png',
  'Bug Slayer': '/badges/FindingCodeFailures/20.png',
  'Bug Exterminator': '/badges/FindingCodeFailures/50.png',
  'Bug Whisperer': '/badges/FindingCodeFailures/100.png',

  // CorrectUpVotes badges
  'Sharp Eye': '/badges/CorrectUpVotes/5-2.png',
  'Quality Checker': '/badges/CorrectUpVotes/10-1.png',
  'Insightful Reviewer': '/badges/CorrectUpVotes/20-3.png',
  'Truth Seeker': '/badges/CorrectUpVotes/50-2.png',
  'Peer Review Master': '/badges/CorrectUpVotes/100-2.png',

  // PassTeacherTests badges
  'First Pass': '/badges/PassTeacherTests/1.png',
};

export const DEFAULT_BADGE_ICON = '/badges/default_badge.png';

/**
 * Get badge icon path by badge name
 * @param {Object} badge - Badge object with name property
 * @returns {string} Path to badge icon
 */
export const getBadgeIcon = (badge) => {
  return BADGE_ICON_MAP[badge.name] || DEFAULT_BADGE_ICON;
};
