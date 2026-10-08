export interface SampleScenario {
  id: string;
  title: string;
  tag: string;
  decision: string;
  context: string;
  reasoning: string;
  priorities: string[];
  blindSpotConcerns: string;
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'career-startup',
    title: 'Leaving Corporate Tech for an Early-Stage Startup',
    tag: 'Career Transition',
    decision: 'Whether to resign from my Senior Staff role at an enterprise cloud company to join a 6-person AI robotics startup as Founding Engineer with 1.8% equity and a 40% salary cut.',
    context: 'Current role: $280k base, $150k annual equity, 38 hrs/week, low stress, high bureaucracy. Startup offer: $170k base, 1.8% equity (4-yr vest, 1-yr cliff), seed stage ($4M raised, ~18 months runway). My savings: 14 months living expenses. Partner is supportive and earns $95k.',
    reasoning: 'I feel stagnant at my current company—I spend 70% of my time in alignment meetings and feel my technical edge dulling. The startup founders are repeat operators who sold their previous company to an autonomous vehicle firm. If I do not make this leap now before having children in 2-3 years, I may never take another startup risk. Even if it fails, I believe the accelerated learning and network will make me far more valuable.',
    priorities: ['Growth', 'Learning', 'Career', 'Time'],
    blindSpotConcerns: 'I might be romanticizing early-stage startup chaos because I am frustrated by current corporate politics.',
  },
  {
    id: 'relocation-international',
    title: 'International Relocation for a 2-Year Leadership Tour',
    tag: 'Life & Location',
    decision: 'Whether to accept a 2-year expat posting to open and lead our company’s European office in Amsterdam, or stay in Seattle to preserve our domestic community.',
    context: 'The role includes a 25% expat stipend, housing allowance for 6 months, and fast-track consideration for VP upon return. My partner works as a freelance UX researcher and can theoretically work remotely, but has all their closest friends and aging parents within a 2-hour drive of Seattle. We do not have children yet.',
    reasoning: 'Living abroad has been a lifelong aspiration for both of us. The international executive experience would set me apart for future C-suite roles. Amsterdam has incredible quality of life, cycling infrastructure, and travel access. My partner says they are on board, and 2 years goes by quickly.',
    priorities: ['Growth', 'Location', 'Career', 'Family'],
    blindSpotConcerns: 'I worry I am underestimating the isolation my partner might feel in a foreign city while I am consumed with building a new office from scratch.',
  },
  {
    id: 'business-acquisition',
    title: 'Acquiring an Established Specialty Coffee Roastery',
    tag: 'Entrepreneurship',
    decision: 'Whether to purchase a 12-year-old specialty coffee roastery with 2 retail locations for $620k ($350k cash from personal savings/collateral, $270k seller-financing over 5 years).',
    context: 'The business generates $1.2M revenue with $140k SDE (seller discretionary earnings). The retiring founder works ~35 hours/week doing master roasting and key B2B relationships. The lease on the main roastery expires in 30 months with a 5-year renewal option at market rate. Three competing specialty cafes opened in the neighborhood over the last 18 months.',
    reasoning: 'Buying an existing cash-flowing business is safer than building from zero. I have 8 years of brand marketing experience and know how to expand their wholesale e-commerce subscription, which is currently only 12% of revenue. The seller is willing to stay on for 3 months to train me on roasting operations.',
    priorities: ['Money', 'Growth', 'Stability', 'Career'],
    blindSpotConcerns: 'I am not an artisan coffee roaster by trade; wholesale customer retention may be tied to the founder’s personal charisma rather than the brand.',
  },
];
