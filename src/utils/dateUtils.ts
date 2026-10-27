export const formatDate = (dateStringOrTimestamp: string | number | Date): string => {
  const d = new Date(dateStringOrTimestamp);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (dateStringOrTimestamp: string | number | Date): string => {
  const d = new Date(dateStringOrTimestamp);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDateTime = (dateStringOrTimestamp: string | number | Date): string => {
  return `${formatDate(dateStringOrTimestamp)}, ${formatTime(dateStringOrTimestamp)}`;
};

export const getIsoDateToday = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const getDaysAgoIso = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const formatDuration = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins}m`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getDayLabel = (dateString: string): string => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

export const isDueSoon = (dateString: string, daysThreshold = 3): boolean => {
  const target = new Date(dateString).getTime();
  const now = Date.now();
  const diffDays = (target - now) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= daysThreshold;
};

export const isOverdue = (dateString: string): boolean => {
  const target = new Date(dateString).getTime();
  return target < Date.now();
};
