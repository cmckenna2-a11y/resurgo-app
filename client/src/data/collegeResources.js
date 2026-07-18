// Campus mental-health resources, keyed by the school name stored on the
// user's profile. Single source of truth — HomeTab and ToolsTab both render
// from this list (they previously kept separate copies that drifted apart).
export const COLLEGE_RESOURCES = {
  'Bates College': {
    name: 'Bates College', color: '#8B0000',
    resources: [
      { title: 'CAPS — Counseling & Psychological Services', sub: 'Free confidential counseling — same day appointments available', url: 'https://www.bates.edu/counseling-psychological-services/', icon: '🧠' },
      { title: 'Student Well-Being at Bates', sub: 'Wellness programs, resources, and holistic health support', url: 'https://www.bates.edu/well-being/', icon: '🌿' },
      { title: 'Student Affairs', sub: 'Comprehensive support for your Bates journey', url: 'https://www.bates.edu/student-affairs/', icon: '🏫' },
      { title: 'Here to Help — Confidential Support', sub: 'Full list of confidential mental health resources at Bates', url: 'https://www.bates.edu/here-to-help/confidential-non-confidential-support/', icon: '👥' },
      { title: 'Crisis support — Campus Safety', sub: 'Call (207) 786-6254 anytime — 24/7', url: 'tel:+12077866254', icon: '📞' },
    ],
  },
};
