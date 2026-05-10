import { Phenomenon } from '@/types/game';

export const PHENOMENA: Phenomenon[] = [
  // ─── David Deutsch ── Novice ────────────────────────────────────────────────
  {
    id: 'stellar-scintillation',
    thinker: 'deutsch',
    difficulty: 'novice',
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
    id: 'iridescent-clouds',
    thinker: 'deutsch',
    difficulty: 'novice',
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
    id: 'bicycle-stability',
    thinker: 'deutsch',
    difficulty: 'novice',
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
  // ─── David Deutsch ── Adept ─────────────────────────────────────────────────
  {
    id: 'mpemba-effect',
    thinker: 'deutsch',
    difficulty: 'adept',
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
    id: 'ant-colony-intelligence',
    thinker: 'deutsch',
    difficulty: 'adept',
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
    thinker: 'deutsch',
    difficulty: 'adept',
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
    id: 'jump-to-universality',
    thinker: 'deutsch',
    difficulty: 'adept',
    title: 'Roman numerals can express any number. Only Arabic numerals let you actually calculate.',
    prompt: `Both Roman and Arabic numerals can represent any integer. A Roman scholar could write MCMXCIX for 1999 just as precisely as we write 1999. Yet European mathematics stagnated for centuries while Arabic mathematicians advanced rapidly, and the adoption of Arabic numerals preceded an explosion of mathematical progress. What property does the Arabic system possess that makes calculation tractable, and what does this reveal about the nature of representational systems more broadly?`,
    seedFacts: [
      'Arabic numerals use positional notation: the same symbol means different things depending on position',
      'Roman numerals require entirely different symbols for each order of magnitude (I, X, C, M)',
      'Long multiplication with Roman numerals requires translation to an abacus or counting board',
      'Deutsch describes this as a "jump to universality" — a system that can embody all possibilities in a domain',
    ],
    naiveTraps: [
      '"Arabic numerals are simpler" — simplicity doesn\'t explain why one enables calculation and the other doesn\'t',
      '"Roman numerals are inefficient" — efficiency is a description, not a causal mechanism',
    ],
    reachOpportunities: [
      'Why did the alphabet enable more literature than hieroglyphics?',
      'Why does a Turing-complete programming language let you compute everything any other language can?',
      'Why can DNA encode proteins for organisms that haven\'t evolved yet?',
    ],
  },
  // ─── David Deutsch ── Master ─────────────────────────────────────────────────
  {
    id: 'delayed-choice',
    thinker: 'deutsch',
    difficulty: 'master',
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
    thinker: 'deutsch',
    difficulty: 'master',
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
  {
    id: 'fermi-paradox',
    thinker: 'deutsch',
    difficulty: 'master',
    title: 'The universe has 200 billion trillion stars and 13 billion years of history. We\'ve heard nothing.',
    prompt: `By conservative estimates, our galaxy contains billions of potentially habitable planets. Life evolved on Earth within a few hundred million years of favorable conditions. Several civilizations should have arisen billions of years ago — enough time to colonize the galaxy, build structures visible across the cosmos, or at minimum broadcast detectable signals. SETI has listened for 65 years. The result: silence. What does this silence actually tell us about the nature of life, intelligence, and civilization?`,
    seedFacts: [
      'The Drake Equation estimates many civilizations but contains enormous multiplicative uncertainties',
      'SETI has searched a tiny fraction of possible signal space (frequency, direction, type)',
      'The "Great Filter" hypothesis: something prevents civilizations from reaching cosmic scale',
      'Anthropic reasoning: we can only observe a universe where observers can exist to observe it',
    ],
    naiveTraps: [
      '"Space is too big for signals to reach us" — a civilization 100,000 light-years away could have signaled us millions of years ago',
      '"They\'re hiding from us" — this requires all civilizations, across all time, to coordinate concealment',
    ],
    reachOpportunities: [
      'Why is all life on Earth descended from a single common ancestor, despite independent origins seeming probable?',
      'Why has digital computation appeared only once in nature (brains) despite being so useful?',
    ],
  },
  {
    id: 'static-vs-dynamic-societies',
    thinker: 'deutsch',
    difficulty: 'master',
    title: 'Ancient Egypt lasted 3,000 years with almost no change. The Industrial Revolution changed everything in 150.',
    prompt: `Ancient Egypt maintained essentially the same political structure, art style, agricultural techniques, and religious practices for three millennia. Contemporary Western civilization has transformed its technology, governance, science, and daily life beyond recognition in two centuries. Both are human societies with the same cognitive hardware. What mechanism accounts for this thousand-fold difference in the rate of change, and why did the phase transition happen when and where it did?`,
    seedFacts: [
      'Deutsch distinguishes "static societies" (change is taboo, tradition is authoritative) from "dynamic societies" (change is celebrated, criticism is permitted)',
      'Static societies have error-correction mechanisms that eliminate deviation from tradition',
      'Dynamic societies have error-correction mechanisms that select better ideas through criticism',
      'The printing press, widespread literacy, and scientific institutions may be critical structural differences',
    ],
    naiveTraps: [
      '"Modern people are smarter" — brain architecture hasn\'t meaningfully changed in 50,000 years; cognitive capacity is essentially identical',
      '"Technology causes progress" — this is circular; what caused the technology to be created and accepted in the first place?',
    ],
    reachOpportunities: [
      'Why do some companies remain nearly unchanged for decades while others iterate rapidly?',
      'Why do some scientific fields advance explosively while others are stuck for generations?',
    ],
  },
  {
    id: 'universality-of-computation',
    thinker: 'deutsch',
    difficulty: 'master',
    title: 'A pocket calculator and a human brain can both — in principle — simulate any physical process.',
    prompt: `A Turing machine — an abstract device with a tape and simple rules — can simulate any other Turing machine, including ones that are far more complex. David Deutsch extended this to physics: the laws of nature permit the existence of a universal computer that can simulate any physically allowed process. This is not a mathematical coincidence. Deutsch argues it reflects something deep about the fabric of reality. What does it mean for a physical system to be computationally universal, and why would the laws of physics permit this at all?`,
    seedFacts: [
      'The Church-Turing thesis: all sufficiently powerful computational models can simulate each other',
      'Deutsch extended this to the quantum Church-Turing principle, incorporating quantum mechanics',
      'Every physical object can in principle be simulated by a universal quantum computer',
      'This connects to why scientific models — running in brains — can accurately predict physical reality',
    ],
    naiveTraps: [
      '"Computers are just very fast calculators" — universality is about capability, not speed',
      '"The brain is more powerful than any computer" — this may be false and is certainly unproven',
    ],
    reachOpportunities: [
      'Why can mathematics — developed in human minds — describe physical reality at all?',
      'Why can written fiction produce genuine emotional responses as if the events were real?',
    ],
  },

  // ─── Naval Ravikant ── Novice ────────────────────────────────────────────────
  {
    id: 'software-leverage',
    thinker: 'naval',
    difficulty: 'novice',
    title: 'A programmer working alone can build something used by a billion people every day.',
    prompt: `WhatsApp served 450 million users with 55 employees when Facebook acquired it. A master carpenter, working their entire career, might furnish 500 homes. A surgeon might perform 5,000 procedures over a lifetime. But a single software engineer can write code that runs on a billion devices simultaneously, with each additional user costing essentially nothing. What is the fundamental mechanism that allows software to scale in a way that physical crafts cannot — and what determines where the limits of this leverage actually lie?`,
    seedFacts: [
      'Software is a digital good: it can be copied at near-zero marginal cost',
      'Physical goods require materials and labor for every additional unit produced',
      'The internet provides near-costless global distribution for digital goods',
      'Naval calls this "permissionless leverage" — no factory, warehouse, or employees required to scale',
    ],
    naiveTraps: [
      '"Software is just digital" — digital vs. physical doesn\'t explain the economic mechanism; what specifically changes?',
      '"The internet makes distribution easy" — true, but what\'s different about distributing software versus distributing a digital photo?',
    ],
    reachOpportunities: [
      'Why does a pop song earn more per hour of creation than a live performance?',
      'Why do financial instruments like options have asymmetric risk profiles compared to owning the underlying asset?',
      'Why does writing a book earn more per reader reached than giving a lecture?',
    ],
  },
  {
    id: 'compound-interest-counterintuition',
    thinker: 'naval',
    difficulty: 'novice',
    title: 'Warren Buffett earned 97% of his wealth after age 65, despite investing since age 11.',
    prompt: `Buffett has been a successful investor since childhood. Yet roughly 97% of his net worth accumulated after his 65th birthday — not because he got better at investing, but because compounding had more time to run. A 1% daily advantage compounded for a year becomes a 37-fold advantage. A 10% annual return over 50 years produces 117x; at 7% it produces only 30x — a 3-percentage-point difference yielding a 4-fold difference in outcome. Humans consistently and severely underestimate compound growth. What is the mechanism behind this systematic failure of intuition?`,
    seedFacts: [
      'Human brains process linear change naturally — each step adds a fixed amount',
      'Compound growth is multiplicative: each step multiplies by a fixed factor, so the base keeps growing',
      'The "doubling time" of compound growth (the Rule of 72) is deeply counterintuitive',
      'Buffett\'s net worth: roughly $1.4B at 65, over $100B at 93',
    ],
    naiveTraps: [
      '"People don\'t understand the math" — many people know the formula yet still fail to feel its implications; knowing ≠ intuiting',
      '"It\'s just a cognitive bias" — naming the bias doesn\'t explain the mechanism; why does this specific bias exist?',
    ],
    reachOpportunities: [
      'Why does starting to exercise at 20 vs. 30 produce disproportionate long-term health differences?',
      'Why do small software performance gains produce enormous differences at scale?',
      'Why does the "flywheel effect" in business compound so dramatically over time?',
    ],
  },
  // ─── Naval Ravikant ── Adept ─────────────────────────────────────────────────
  {
    id: 'specific-knowledge',
    thinker: 'naval',
    difficulty: 'adept',
    title: 'The most valuable workers have skills they cannot fully explain and couldn\'t have deliberately chosen.',
    prompt: `Naval Ravikant argues that the most economically valuable people possess "specific knowledge" — expertise so idiosyncratic it cannot be commoditized, automated, or taught in a curriculum. This knowledge often emerges from the intersection of genuine curiosity, unusual experiences, and obsessive focus on something the market doesn't yet value. Yet if you deliberately try to acquire "specific knowledge" for its own sake — to be rare on purpose — you systematically fail. What is the mechanism that makes this type of knowledge valuable precisely because it cannot be deliberately sought?`,
    seedFacts: [
      'Skills with clear curricula (accounting, basic medicine) are well-compensated but rarely extraordinarily so',
      'The most highly compensated individuals often have unusual, hard-to-replicate skill combinations',
      'Markets efficiently price commoditized skills toward their cost of training over time',
      'Genuine curiosity is structurally difficult to fake for long enough periods to develop mastery',
    ],
    naiveTraps: [
      '"Rare skills are just scarce" — scarcity explains high wages but not why deliberately seeking rarity fails',
      '"It\'s about natural talent" — talent is a description of an outcome, not a causal mechanism',
    ],
    reachOpportunities: [
      'Why do authentic artists often produce work that calculated artists cannot replicate even with equal technical skill?',
      'Why do the most creative scientific breakthroughs often come from researchers working in adjacent fields?',
      'Why is poker success correlated with genuine enjoyment of the game rather than just studying strategy manuals?',
    ],
  },
  {
    id: 'permissionless-leverage',
    thinker: 'naval',
    difficulty: 'adept',
    title: 'For most of history, reaching a million people required a gatekeeper\'s permission. Now it requires only an idea.',
    prompt: `A 19th-century author needed a publisher. A journalist needed a newspaper. A musician needed a record label. A filmmaker needed a studio. Each gatekeeper extracted a large toll in exchange for access to audiences — and most creators were simply denied access entirely. The internet lowered distribution costs to near zero. Yet most independent creators still earn very little, while the top 0.1% capture most attention and revenue. What actually changed — and what didn't — when gatekeepers lost their distribution monopoly?`,
    seedFacts: [
      'The internet reduced digital distribution costs to near zero for any creator',
      'The number of active content creators has increased by orders of magnitude since 2000',
      'Attention and revenue still follow power-law distributions — top creators capture disproportionate share',
      'New gatekeepers (platforms, algorithms, recommendation systems) replaced old ones',
    ],
    naiveTraps: [
      '"Competition increased, so earnings fell" — true, but this doesn\'t explain why power-law distributions persist or intensify',
      '"Gatekeepers were just middlemen, now they\'re gone" — new gatekeepers replaced old ones; the question is what structurally changed',
    ],
    reachOpportunities: [
      'Why do open-source projects that anyone can contribute to still have disproportionate influence from a tiny number of contributors?',
      'Why does removing entry barriers in a market often increase concentration rather than distribute it?',
    ],
  },

  // ─── Karl Popper / Tokcast ── Adept ──────────────────────────────────────────
  {
    id: 'black-swan-problem',
    thinker: 'popper',
    difficulty: 'adept',
    title: 'No matter how many white swans you\'ve seen, you cannot prove all swans are white. One black swan disproves it.',
    prompt: `For millennia, Europeans had seen only white swans. Every observation confirmed "all swans are white." In 1697, black swans were discovered in Australia, instantly disconfirming what seemed an unassailable universal law. Logically, no finite number of confirming instances can prove a universal claim — but a single counterexample can disprove it. This asymmetry seems to undermine science entirely: if we can't verify our theories, what justifies scientific confidence? And yet science works. How?`,
    seedFacts: [
      'Popper\'s solution: science advances through bold conjectures subjected to vigorous attempted refutation, not accumulated confirmations',
      'Modus tollens is logically valid: if P implies Q, and Q is false, then P is false',
      'Modus ponens cannot establish universals: if P implies Q, and Q is true, P might still be false',
      'Every scientific theory is best understood as "not yet falsified," not "proven true"',
    ],
    naiveTraps: [
      '"Science works because many experiments confirm theories" — this is precisely what\'s in question; confirming instances don\'t logically prove universals',
      '"We use probability to handle uncertainty" — Bayesian approaches still don\'t solve the foundational problem of how initial priors are justified',
    ],
    reachOpportunities: [
      'Why is a theory making ten precise predictions more trustworthy than one making a hundred vague ones?',
      'Why do scientists treat surprising, unexpected results differently from expected ones?',
      'Why do courts use "beyond reasonable doubt" rather than demanding proof of innocence?',
    ],
  },
  {
    id: 'evolutionary-epistemology',
    thinker: 'popper',
    difficulty: 'adept',
    title: 'Knowledge grows like life — through variation, selection, replication. But with one crucial difference.',
    prompt: `Popper and Deutsch argued that knowledge creation is analogous to biological evolution: existing theories generate variations (new conjectures), these face selection pressure (experimental testing and criticism), and successful variants replicate (become accepted knowledge). Both processes generate increasing fit with the environment without requiring a designer. But there's a crucial disanalogy: biological evolution is blind, while scientists can deliberately design experiments to target specific theoretical weaknesses. Does this disanalogy undermine the analogy, strengthen it, or reveal something deeper?`,
    seedFacts: [
      'Popper drew explicit parallels between natural selection and the scientific method in "Objective Knowledge"',
      'Richard Dawkins extended this to memes — cultural units of information subject to selection',
      'Human knowledge can "simulate" hypothetical tests before physically performing them',
      'Biological evolution has no memory: a failed variant doesn\'t record why it failed',
    ],
    naiveTraps: [
      '"Evolution is random, but science is deliberate" — partially true, but both select from variation; is the source of variation the essential difference?',
      '"The analogy is just a metaphor" — this dismisses the possibility that both are instances of a more general abstract process',
    ],
    reachOpportunities: [
      'Why do markets — which nobody designs — produce useful price signals that no planner could compute?',
      'Why do languages evolve to match the expressive needs of their speakers without any governing committee?',
      'Why do habits that "survive" in a person\'s routine tend to be more adaptive than deliberately chosen habits?',
    ],
  },
  // ─── Karl Popper / Tokcast ── Master ─────────────────────────────────────────
  {
    id: 'paradox-of-tolerance',
    thinker: 'popper',
    difficulty: 'master',
    title: 'A society that tolerates everything — including intolerance — will eventually be destroyed by the intolerant.',
    prompt: `Karl Popper identified the paradox of tolerance in 1945: if a society is completely tolerant, tolerating all views including intolerant ones, the intolerant will eventually overwhelm the tolerant and destroy tolerance itself. But a society that refuses to tolerate intolerance is itself practicing intolerance. The paradox seems to show that no coherent political philosophy can avoid drawing an arbitrary line. Where should that line be drawn, and what principle — rather than mere preference — determines it?`,
    seedFacts: [
      'Popper\'s resolution: tolerance must include willingness to suppress movements that explicitly threaten tolerance through violence',
      'The paradox appeared historically with Weimar Germany\'s democratic tolerance of anti-democratic movements',
      'The paradox applies recursively: should skeptics be skeptical of skepticism? Should relativists tolerate absolutism?',
      '"Hate speech" laws attempt to operationalize Popper\'s limit; their effectiveness is empirically contested',
    ],
    naiveTraps: [
      '"Just tolerate everything" — this ignores the logical paradox; tolerating intolerant movements gives them time to grow and eliminate tolerance',
      '"Suppress intolerance" — this restates the paradox; you\'ve simply declared yourself the arbiter of what counts as intolerance',
    ],
    reachOpportunities: [
      'Should a completely open-source project accept a pull request that closes the project permanently?',
      'Should freedom of speech protect speech that explicitly advocates for ending freedom of speech?',
      'Why does any self-referential rule system need meta-rules governing what can change the rules?',
    ],
  },
  {
    id: 'falsificationism-vs-confirmation',
    thinker: 'popper',
    difficulty: 'master',
    title: 'A thousand experiments supporting your theory tell you less than one that almost broke it.',
    prompt: `Confirmation bias — seeking evidence that supports existing beliefs — is one of the most well-documented cognitive tendencies. Karl Popper argued this is not merely psychological weakness but a logical error: confirming instances do not logically strengthen a theory, while failed falsification attempts do. A scientist who designs experiments specifically trying to disprove their theory and repeatedly fails has stronger justification than one who designs experiments to confirm it. Why is this logically true — and why do humans, and even scientific institutions, systematically resist it?`,
    seedFacts: [
      'Popper\'s demarcation criterion: a claim is scientific only if it specifies what observations would falsify it',
      'Falsifying a theory requires only one counterexample; confirming it would require verifying all possible cases',
      'Publication bias: journals historically prefer positive (confirming) results over null or disconfirming results',
      'Peter Wason\'s 1966 selection task showed systematic confirmation bias in naive reasoners across cultures',
    ],
    naiveTraps: [
      '"Both confirming and disconfirming evidence update beliefs" — from a Bayesian view this is true, but it misses Popper\'s logical asymmetry',
      '"Scientists already know this" — documented cases of confirmation bias in professional science suggest otherwise',
    ],
    reachOpportunities: [
      'Why do product teams that explicitly try to invalidate their own feature ideas build better products?',
      'Why do red teams (groups trying to break a plan) improve security more than security teams trying to validate it?',
      'Why does debugging by trying to reproduce a bug work better than trying to prove the code is correct?',
    ],
  },
];

export function getPhenomenaByThinker(thinker: import('@/types/game').Thinker | 'all'): Phenomenon[] {
  if (thinker === 'all') return PHENOMENA;
  return PHENOMENA.filter((p) => p.thinker === thinker);
}

export function getPhenomenaByDifficulty(difficulty: import('@/types/game').Difficulty | 'all'): Phenomenon[] {
  if (difficulty === 'all') return PHENOMENA;
  return PHENOMENA.filter((p) => p.difficulty === difficulty);
}

export function getUnlockedPhenomena(unlocked: import('@/types/game').Difficulty[]): Phenomenon[] {
  return PHENOMENA.filter((p) => unlocked.includes(p.difficulty));
}

export function getRandomPhenomenon(
  excludingId?: string,
  unlockedDifficulties?: import('@/types/game').Difficulty[]
): Phenomenon {
  const pool = unlockedDifficulties
    ? PHENOMENA.filter((p) => unlockedDifficulties.includes(p.difficulty))
    : PHENOMENA;
  const available = excludingId ? pool.filter((p) => p.id !== excludingId) : pool;
  return available[Math.floor(Math.random() * available.length)];
}
