export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatEventDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 0) {
    return 'Past event';
  } else if (diffDays <= 7) {
    return `In ${diffDays} days`;
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `In ${months} month${months > 1 ? 's' : ''}`;
  }
};

export const isUpcoming = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= 30;
};

