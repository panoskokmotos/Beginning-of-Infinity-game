import { Phenomenon } from '@/types/game';

export const PHENOMENA: Phenomenon[] = [
  {
    id: 'stellar-scintillation',
    title: 'Stars twinkle. Planets don\'t.',
    prompt: `On a clear night, stars shimmer and flicker — they "twinkle." But planets like Jupiter or Venus, visible to the naked eye, glow with a steady, unwavering light. Both are seen across vast distances through the same atmosphere. Why does that atmosphere treat them so differently?`,
    seedFacts: [
      'Stars are effectively point sources at astronomical distances',
      'Planets subtend a measurable angular diameter (even if tiny) as seen from Earth',
      'Atmospheric turbulence creates pockets of varying refractive index',
      'The technical name is astronomical scintillation',
    ],
    naiveTraps: [
      '"Stars are farther away" — distance alone doesn\'t explain the mechanism',
      '"Planets are brighter" — brightness is irrelevant to the mechanism',
    ],
    reachOpportunities: [
      'Why does heat shimmer over hot asphalt?',
      'Why do radio telescopes have degraded resolution in humid conditions?',
    ],
  },
  {
    id: 'mpemba-effect',
    title: 'Hot water sometimes freezes faster than cold water.',
    prompt: `Under certain conditions, a container of hot water placed in a freezer will reach 0°C before an identical container of cold water placed at the same time. This seems to violate the intuition that water already closer to freezing should freeze first. What is actually happening?`,
    seedFacts: [
      'The effect is real but highly condition-dependent (container shape, dissolved gases, freezer airflow)',
      'Mpemba, a Tanzanian student, rediscovered it in 1963 while making ice cream',
      'Multiple mechanisms have been proposed: evaporation, convection, dissolved gases, supercooling',
      'The effect disappears under some tightly controlled laboratory conditions',
    ],
    naiveTraps: [
      '"Hot water evaporates, leaving less to freeze" — true but insufficient as the primary mechanism',
      '"It\'s just experimental error" — fails to engage with the genuine phenomenon',
    ],
    reachOpportunities: [
      'Why does a car engine warm up faster when driven hard vs. idling?',
      'Why do some metals cool faster than their thermal mass alone would predict?',
    ],
  },
  {
    id: 'iridescent-clouds',
    title: 'Some clouds show vivid rainbow colors — without any rain.',
    prompt: `Occasionally, thin clouds near the sun display brilliant, jewel-like colors — greens, pinks, purples — in patches that shift as you move your head. This happens with no sunlight refracting through raindrops. What produces these colors, and why only in thin clouds near the sun?`,
    seedFacts: [
      'The effect is called cloud iridescence or irisation',
      'It requires thin clouds with unusually uniform droplet sizes',
      'The droplets must be much smaller than typical rain-producing droplets',
      'The mechanism is diffraction, not refraction',
    ],
    naiveTraps: [
      '"It\'s the same as a rainbow" — confuses refraction with diffraction',
      '"Oil on the cloud surface" — there is no physical mechanism for oil in clouds',
    ],
    reachOpportunities: [
      'Why do soap bubbles show colors?',
      'Why do CDs and some beetle shells create rainbow patterns?',
    ],
  },
  {
    id: 'ant-colony-intelligence',
    title: 'Ant colonies solve problems no individual ant can understand.',
    prompt: `Individual ants have tiny brains and follow simple chemical rules. Yet ant colonies find near-optimal paths to food, manage waste disposal, regulate nest temperature, farm fungi, and wage coordinated warfare — solving problems of a complexity far beyond any individual ant's comprehension. Where does this collective intelligence come from?`,
    seedFacts: [
      'Ants communicate primarily through pheromones — simple chemical signals',
      'No ant has a plan or overview of the colony\'s goals',
      'Ant Colony Optimization algorithms, inspired by ant behavior, solve NP-hard problems in computer science',
      'The behavior is an emergent property of purely local interactions',
    ],
    naiveTraps: [
      '"The queen controls everything" — queens only lay eggs and issue no orders',
      '"It\'s instinct" — instinct describes the behavior but doesn\'t explain the mechanism',
    ],
    reachOpportunities: [
      'How do billions of neurons produce conscious thought?',
      'How do free markets set prices without central planning?',
      'How does flocking behavior (murmurations) emerge in birds?',
    ],
  },
  {
    id: 'placebo-effect',
    title: 'Sugar pills cure real diseases.',
    prompt: `Patients given inert pills — sometimes knowing they are inert, sometimes not — often show measurable physiological improvements: reduced pain, lower blood pressure, faster healing. This is not merely a reporting bias; it produces real, measurable physical changes in the body. How can a belief or expectation cause genuine physiological healing?`,
    seedFacts: [
      'Open-label placebos (patients explicitly told they\'re taking a placebo) still work',
      'Placebo surgery has produced outcomes comparable to real surgery in several knee studies',
      'Placebos trigger endogenous opioid release, measurable by reversal with naloxone',
      'The effect varies with pill color, size, branding, and even price',
    ],
    naiveTraps: [
      '"It\'s all in their head" — circular and ignores objectively measured physiological changes',
      '"They weren\'t really sick" — ignores objective biomarker and imaging changes',
    ],
    reachOpportunities: [
      'Why do expensive wines consistently taste better than identical cheap wines in blind tests?',
      'Why does the ritual of a doctor\'s examination itself reduce patient anxiety and symptoms?',
    ],
  },
  {
    id: 'bicycle-stability',
    title: 'A riderless bicycle stays upright when pushed.',
    prompt: `Give a bicycle a push without a rider, and it will travel in a straight line, self-correcting small disturbances for many meters before falling. It has no gyroscope, no computer, no rider making corrections. Simple mechanics should predict it falls immediately. What keeps it upright?`,
    seedFacts: [
      'Gyroscopic effects from spinning wheels contribute but are NOT the primary mechanism',
      'A 2011 Science paper demonstrated a bicycle with counter-rotating wheels (canceling gyroscopic effect) remained stable',
      'The geometry of the front fork — specifically the "trail" — causes the wheel to steer into a fall',
      'The center-of-mass position relative to the steering axis is the critical factor',
    ],
    naiveTraps: [
      '"Gyroscopic effect keeps it up" — partially true, but experimentally refuted as the primary cause',
      '"Momentum keeps it going straight" — momentum doesn\'t explain self-correction of disturbances',
    ],
    reachOpportunities: [
      'Why do spinning tops stay upright?',
      'Why is it easier to balance on a moving bicycle than a stationary one?',
    ],
  },
  {
    id: 'delayed-choice',
    title: 'Whether light "was" a wave or particle can seemingly be decided after the fact.',
    prompt: `In Wheeler's Delayed-Choice Experiment, a photon passes through a double-slit. After the photon has already passed the slits — in principle — the experimenter decides whether to detect which slit it went through (particle behavior) or observe interference (wave behavior). The results match the experimenter's choice as if the photon retroactively decided what it was. What is really happening here?`,
    seedFacts: [
      'The experiment has been physically performed and confirms quantum mechanical predictions',
      'The photon\'s "choice" is not actually retroactive — this is a misleading classical framing',
      'Quantum mechanics makes no claim about what the photon "is" between measurements',
      'Many-worlds, Copenhagen, and pilot-wave interpretations each give different accounts of the mechanism',
    ],
    naiveTraps: [
      '"The photon travels back in time" — violates causality and has no evidential support',
      '"It\'s both a wave and a particle simultaneously" — doesn\'t mechanically explain the experimental results',
    ],
    reachOpportunities: [
      'Why does measurement appear to "collapse" a quantum wavefunction?',
      'Why can\'t we predict individual quantum events even in principle?',
    ],
  },
  {
    id: 'cambrian-explosion',
    title: 'Almost all animal body plans appeared within 20 million years, after 3 billion years of nothing.',
    prompt: `For the first ~3 billion years of life on Earth, organisms were mostly single-celled. Then, roughly 541 million years ago, in a geologically brief 20-million-year window, nearly all the major animal body plans (phyla) we see today suddenly appeared in the fossil record — arthropods, mollusks, chordates, echinoderms. Why then? Why so explosively fast?`,
    seedFacts: [
      'Multiple hypotheses exist: oxygen rise, predation arms race, Snowball Earth thaw, evolution of eyes, Hox gene regulatory networks',
      'The "explosion" may be partly an artifact of better preservation — shells and hard parts fossilize far better than soft bodies',
      'Genetic evidence suggests animal lineages diverged earlier than the fossil record shows',
      'Hox genes act as master developmental switches that control entire body plan segments',
    ],
    naiveTraps: [
      '"Evolution simply got faster" — this describes the observation, doesn\'t explain it; what changed the rate?',
      '"God created them" — unfalsifiable; makes no predictions about which body plans appeared, when, or in what order',
    ],
    reachOpportunities: [
      'Why do technological revolutions cluster (the Industrial Revolution, the Digital Revolution)?',
      'Why did flowering plants radiate explosively in the Cretaceous?',
    ],
  },
];

export function getRandomPhenomenon(excluding?: string): Phenomenon {
  const available = excluding
    ? PHENOMENA.filter((p) => p.id !== excluding)
    : PHENOMENA;
  return available[Math.floor(Math.random() * available.length)];
}
