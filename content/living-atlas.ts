import {
  anatomyChapterSchema,
  organHotspotSchema,
  sourceSchema,
} from "@/lib/living-atlas/schema";

export const livingAtlasChapters = anatomyChapterSchema.array().parse([
  {
    id: "surface",
    ordinal: "01",
    title: "Surface",
    eyebrow: "The boundary",
    hook: "Where does the outside world end and you begin?",
    narration:
      "Skin is an active boundary. It limits water loss, helps protect deeper tissue, responds to temperature, and carries sensory receptors that register contact with the world.",
    takeaway: "A touch begins at the surface, but the feeling is assembled deeper inside.",
    interactionLabel: "Touch the surface",
    interactionHint: "Select the hand or press the control to send a touch inward.",
    accent: "#d5b49c",
    systemIds: ["skin"],
    hotspotIds: ["skin"],
    fallbackDescription:
      "A warm porcelain outer layer surrounds the human silhouette as a ripple travels from the hand toward the torso.",
    sourceIds: ["openstax-structure"],
  },
  {
    id: "signal",
    ordinal: "02",
    title: "Signal",
    eyebrow: "The conversation",
    hook: "How does a touch become something you can feel?",
    narration:
      "Sensory receptors respond to contact. Nerve cells relay changing electrical signals through peripheral nerves and the spinal cord, while the brain processes the arriving information into perception.",
    takeaway: "Your hand detects the change; your nervous system turns it into experience.",
    interactionLabel: "Follow the signal",
    interactionHint: "Trace the violet path from the hand to the spinal cord and brain.",
    accent: "#aa8cff",
    systemIds: ["nervous"],
    hotspotIds: ["brain", "spinal-cord"],
    fallbackDescription:
      "A violet signal line runs from the fingertips along the arm into the spinal cord and ends in a softly illuminated brain.",
    sourceIds: ["nichd-nervous", "openstax-nervous"],
  },
  {
    id: "breath",
    ordinal: "03",
    title: "Breath",
    eyebrow: "The exchange",
    hook: "A breath is movement. Where does its oxygen go?",
    narration:
      "As the diaphragm moves down, the chest expands and air enters the lungs. In tiny air sacs, oxygen moves into nearby blood while carbon dioxide moves in the opposite direction to be breathed out.",
    takeaway: "Lungs move gases across a boundary; blood carries them onward.",
    interactionLabel: "Take a breath",
    interactionHint: "Press and hold to expand the lungs and lower the diaphragm.",
    accent: "#72c8d7",
    systemIds: ["respiratory", "circulatory"],
    hotspotIds: ["lungs"],
    fallbackDescription:
      "Two blue-cyan lungs expand around the heart while a curved diaphragm lowers beneath them and oxygen dots enter red vessels.",
    sourceIds: ["nhlbi-lungs"],
  },
  {
    id: "pulse",
    ordinal: "04",
    title: "Pulse",
    eyebrow: "The current",
    hook: "What keeps oxygen moving after the breath is over?",
    narration:
      "The heart contracts in a repeating sequence that moves blood through two connected circuits: one between heart and lungs, and another between heart and the rest of the body.",
    takeaway: "The heart is one pump inside a body-wide transport network.",
    interactionLabel: "Send a pulse",
    interactionHint: "Press the control to see one beat travel into the vessel network.",
    accent: "#ef6a5b",
    systemIds: ["circulatory", "respiratory"],
    hotspotIds: ["heart", "lungs"],
    fallbackDescription:
      "A vermilion heart glows between the lungs while branching red and blue paths travel through a ghosted full-body silhouette.",
    sourceIds: ["nhlbi-lungs", "openstax-structure"],
  },
  {
    id: "fuel-motion",
    ordinal: "05",
    title: "Fuel & motion",
    eyebrow: "The transformation",
    hook: "How does a meal become the energy behind a step?",
    narration:
      "Digestion breaks food into smaller molecules that can be absorbed. Blood distributes many of those nutrients, while muscles convert chemical energy into force and bones provide a structure for movement.",
    takeaway: "Movement is a chain: digest, absorb, deliver, contract, and support.",
    interactionLabel: "Make the connection",
    interactionHint: "Trace the amber path from digestion to the muscles of the leg.",
    accent: "#e5a84b",
    systemIds: ["digestive", "muscular", "skeletal", "circulatory"],
    hotspotIds: ["liver", "stomach", "skeleton", "muscles"],
    fallbackDescription:
      "Amber digestive organs connect through a glowing path to rose muscle bands arranged over an ivory skeleton in the legs.",
    sourceIds: ["niddk-digestion", "openstax-digestion"],
  },
  {
    id: "whole",
    ordinal: "06",
    title: "Together",
    eyebrow: "The living whole",
    hook: "There is no solo inside a living body.",
    narration:
      "Skin, nerves, lungs, heart, digestion, muscles, and bones have distinct roles, yet none works in isolation. Their exchanges are what make breathing, sensing, and movement possible.",
    takeaway:
      "Every thought, breath, and step is a conversation between systems that never stop listening to one another.",
    interactionLabel: "See the whole",
    interactionHint: "Move around the figure and revisit any illuminated system.",
    accent: "#f1eadc",
    systemIds: ["whole"],
    hotspotIds: ["brain", "lungs", "heart", "liver", "stomach", "skeleton", "muscles"],
    fallbackDescription:
      "All system colours glow together within a pale body outline, linked by fine lines that form a coordinated constellation.",
    sourceIds: ["openstax-structure", "openstax-digestion"],
  },
]);

export const livingAtlasHotspots = organHotspotSchema.array().parse([
  {
    id: "skin",
    label: "Skin",
    systemId: "skin",
    location: "The continuous outer covering of the body.",
    function:
      "Forms a protective boundary, helps regulate temperature, limits water loss, and contains sensory structures.",
    accessibleDescription:
      "A warm porcelain outer layer surrounds the complete figure and brightens near the left hand when touch is activated.",
    sourceIds: ["openstax-structure"],
  },
  {
    id: "brain",
    label: "Brain",
    systemId: "nervous",
    location: "Inside the skull, continuous with the spinal cord.",
    function:
      "Receives and processes sensory information and helps coordinate movement, thought, memory, and internal regulation.",
    accessibleDescription:
      "A softly folded violet form sits inside the head and connects to a bright line descending through the torso.",
    sourceIds: ["nichd-nervous", "openstax-nervous"],
  },
  {
    id: "spinal-cord",
    label: "Spinal cord",
    systemId: "nervous",
    location: "Runs from the brain through the protective vertebral canal.",
    function:
      "Carries sensory and motor information between brain and body and participates in many rapid reflexes.",
    accessibleDescription:
      "A narrow violet pathway descends from the brain through the centre of the back and branches toward the limbs.",
    sourceIds: ["nichd-nervous", "openstax-nervous"],
  },
  {
    id: "lungs",
    label: "Lungs",
    systemId: "respiratory",
    location: "A paired set of organs in the chest, positioned on either side of the heart.",
    function:
      "Bring air close to blood so oxygen can enter it and carbon dioxide can move out for exhalation.",
    accessibleDescription:
      "Two translucent cyan lobes fill most of the chest and expand above a curved diaphragm during the breath interaction.",
    sourceIds: ["nhlbi-lungs"],
  },
  {
    id: "heart",
    label: "Heart",
    systemId: "circulatory",
    location: "In the chest between the lungs, slightly left of centre.",
    function:
      "Contracts rhythmically to move blood through two connected circuits: one through the lungs and one through the rest of the body.",
    accessibleDescription:
      "A small vermilion form pulses between the lungs and sends a ring of light into branching vessel paths.",
    sourceIds: ["nhlbi-lungs", "openstax-structure"],
  },
  {
    id: "liver",
    label: "Liver",
    systemId: "digestive",
    location: "High in the right side of the abdomen, beneath the diaphragm.",
    function:
      "Processes absorbed nutrients, makes bile, and performs many metabolic and regulatory tasks.",
    accessibleDescription:
      "A broad amber-brown form rests beneath the right lung and connects visually to the digestive tract and bloodstream.",
    sourceIds: ["niddk-digestion"],
  },
  {
    id: "stomach",
    label: "Stomach",
    systemId: "digestive",
    location: "In the upper left abdomen between the oesophagus and small intestine.",
    function:
      "Stores and mechanically mixes swallowed food with acid and enzymes before passing it to the small intestine.",
    accessibleDescription:
      "A curved amber organ sits below the left lung and leads into a softly coiled intestinal path.",
    sourceIds: ["niddk-digestion"],
  },
  {
    id: "skeleton",
    label: "Skeleton",
    systemId: "skeletal",
    location: "A connected internal framework extending throughout the body.",
    function:
      "Supports the body, protects organs, stores minerals, and gives muscles rigid levers for movement.",
    accessibleDescription:
      "Fine ivory bones and joints form a complete internal frame, remaining visible beneath rose muscle bands.",
    sourceIds: ["openstax-structure"],
  },
  {
    id: "muscles",
    label: "Skeletal muscles",
    systemId: "muscular",
    location: "Layered around and attached to bones across the body.",
    function:
      "Contract to pull on the skeleton, producing controlled movement and helping maintain posture.",
    accessibleDescription:
      "Muted rose bands wrap the arms, torso, and legs, brightening in sequence during the movement interaction.",
    sourceIds: ["openstax-structure", "openstax-digestion"],
  },
]);

export const livingAtlasSources = sourceSchema.array().parse([
  {
    id: "openstax-structure",
    title: "Structural Organization of the Human Body",
    publisher: "OpenStax Anatomy and Physiology 2e",
    url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/1-2-structural-organization-of-the-human-body",
  },
  {
    id: "openstax-nervous",
    title: "Basic Structure and Function of the Nervous System",
    publisher: "OpenStax Anatomy and Physiology 2e",
    url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-1-basic-structure-and-function-of-the-nervous-system",
  },
  {
    id: "nichd-nervous",
    title: "What are the parts of the nervous system?",
    publisher: "NICHD, National Institutes of Health",
    url: "https://www.nichd.nih.gov/health/topics/neuro/conditioninfo/parts",
  },
  {
    id: "nhlbi-lungs",
    title: "How the Lungs Work: The Respiratory System",
    publisher: "NHLBI, National Institutes of Health",
    url: "https://www.nhlbi.nih.gov/health/lungs/respiratory-system",
  },
  {
    id: "niddk-digestion",
    title: "Your Digestive System & How it Works",
    publisher: "NIDDK, National Institutes of Health",
    url: "https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works",
  },
  {
    id: "openstax-digestion",
    title: "Overview of the Digestive System",
    publisher: "OpenStax Anatomy and Physiology 2e",
    url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system",
  },
]);
