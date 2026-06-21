// Generates a "click to add to Google Calendar" link — no API key, no OAuth required.
// Google reads these query params and pre-fills a new event for the user to confirm/save.
export function generateGoogleCalendarLink(job) {
  if (!job.interviewDate) return null;

  const start = new Date(job.interviewDate);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // defaults to a 1 hour block

  // Google Calendar expects UTC timestamps in this exact compact format: YYYYMMDDTHHMMSSZ
  const formatDate = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${job.role} Interview - ${job.companyName}`,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details: job.notes || '',
    location: job.location || '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
