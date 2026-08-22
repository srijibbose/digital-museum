import {
  anatomyExhibitSchema,
  type AnatomyModelKey,
  type AnatomyStructure,
  type AnatomySystem,
  type AnatomySystemId,
  type AnatomyView,
  type AnatomyViewId,
} from "@/lib/anatomy/anatomy-schema";

export const anatomy = anatomyExhibitSchema.parse({
  id: "human-anatomy",
  title: "Human Anatomy",
  curatorialThesis:
    "The body becomes intelligible when organs are not treated as isolated objects, but as structures whose position, material, and relationships allow living systems to work.",
  sources: [
    {
      id: "hra-models",
      title: "Human Reference Atlas 3D Reference Objects",
      publisher: "HuBMAP / NIH",
      url: "https://humanatlas.io/3d-reference-library",
      role: "Expert-curated reference geometry, anatomical placement, named structures, and spatial relationships.",
    },
    {
      id: "hra-docs",
      title: "Human Reference Atlas Digital Objects",
      publisher: "HuBMAP / NIH",
      url: "https://docs.humanatlas.io/dev/digital-objects",
      role: "Provenance, ontology crosswalks, reference-object scope, and interpretation of HRA digital objects.",
    },
    {
      id: "visible-human",
      title: "Visible Human Project",
      publisher: "U.S. National Library of Medicine",
      url: "https://www.nlm.nih.gov/research/visible/visible_human.html",
      role: "Underlying cryosection, CT, and MRI observations used to construct adult male and female reference bodies.",
    },
    {
      id: "bodyparts3d",
      title: "BodyParts3D / Anatomography",
      publisher: "Database Center for Life Science (DBCLS)",
      url: "https://lifesciencedb.jp/bp3d/",
      role: "Open, ontology-linked whole-body reference geometry supplying the 201 separately named bones in the skeletal view.",
    },
    {
      id: "niddk-digestion",
      title: "Your Digestive System & How It Works",
      publisher: "NIH / NIDDK",
      url: "https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works",
      role: "Authoritative functional overview of the gastrointestinal tract, liver, pancreas, and nutrient absorption.",
    },
    {
      id: "niddk-kidneys",
      title: "Your Kidneys & How They Work",
      publisher: "NIH / NIDDK",
      url: "https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work",
      role: "Authoritative explanation of renal filtration, nephron function, fluid balance, and urinary flow.",
    },
    {
      id: "niddk-urinary",
      title: "The Urinary Tract & How It Works",
      publisher: "NIH / NIDDK",
      url: "https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-tract-how-it-works",
      role: "Authoritative explanation of the kidneys, ureters, bladder, urethra, and coordinated urination.",
    },
    {
      id: "ninds-brain",
      title: "Brain Basics",
      publisher: "NIH / NINDS",
      url: "https://www.ninds.nih.gov/health-information/public-education/brain-basics",
      role: "Authoritative introduction to brain structure, regional function, neurons, and central nervous system organization.",
    },
    {
      id: "ninds-spinal",
      title: "Anatomy of the Spinal Cord",
      publisher: "NIH / NINDS",
      url: "https://www.ninds.nih.gov/health-information/disorders/spinal-cord-injury",
      role: "Authoritative account of spinal-cord organization, segmental levels, and information exchange with the body.",
    },
    {
      id: "nei-vision",
      title: "How the Eyes Work",
      publisher: "NIH / National Eye Institute",
      url: "https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work",
      role: "Authoritative explanation of the optical path from cornea and lens to retina and neural signals.",
    },
    {
      id: "niaid-immune",
      title: "Overview of the Immune System",
      publisher: "NIH / NIAID",
      url: "https://www.niaid.nih.gov/research/immune-system-overview",
      role: "Authoritative functional context for thymus, lymph nodes, spleen, immune-cell traffic, and surveillance.",
    },
    {
      id: "niams-bone",
      title: "What Is Bone?",
      publisher: "NIH / NIAMS",
      url: "https://www.niams.nih.gov/health-topics/what-bone",
      role: "Authoritative explanation of living bone, skeletal support, protection, movement, marrow, and remodeling.",
    },
    {
      id: "niams-joints",
      title: "Learning About Joints",
      publisher: "NIH / NIAMS",
      url: "https://www.niams.nih.gov/health-topics/educational-resources/health-lesson-learning-about-joints",
      role: "Authoritative overview of joint anatomy, cartilage, menisci, movement, and load-bearing relationships.",
    },
  ],
  models: [
    {
      key: "heart",
      label: "Adult male heart reference object",
      path: "/models/anatomy/hra-v1.2/heart-male.glb",
      fallback: "/media/anatomy/cardiac-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Geometry and object names are preserved; only web materials, lighting, and draw order are changed.",
    },
    {
      key: "lung",
      label: "Adult male lung and airway reference object",
      path: "/models/anatomy/hra-v1.2/lung-male.glb",
      fallback: "/media/anatomy/thorax-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Bronchopulmonary segments, trachea, cartilage, and bronchi remain separately addressable.",
    },
    {
      key: "vasculature",
      label: "Adult male blood vasculature reference object",
      path: "/models/anatomy/hra-v1.2/blood-vasculature-male.glb",
      fallback: "/media/anatomy/cardiac-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. The first exhibit slice shows thoracic vessels while retaining their original scale and registration.",
    },
    {
      key: "liver",
      label: "Adult male liver reference object",
      path: "/models/anatomy/hra-v1.2/liver-male.glb",
      fallback: "/media/anatomy/digestive-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Lobes, segments, capsule, surfaces, impressions, porta hepatis, and ligaments remain separately addressable.",
    },
    {
      key: "pancreas",
      label: "Adult male pancreas reference object",
      path: "/models/anatomy/hra-v1.2/pancreas-male.glb",
      fallback: "/media/anatomy/digestive-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Head, neck, body, tail, and uncinate process retain their source names and shared registration.",
    },
    {
      key: "small-intestine",
      label: "Adult male small-intestine reference object",
      path: "/models/anatomy/hra-v1.2/small-intestine-male.glb",
      fallback: "/media/anatomy/digestive-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Duodenum, jejunum, ileum, terminal ileum, and named junctional structures remain separate meshes.",
    },
    {
      key: "large-intestine",
      label: "Adult male large-intestine reference object",
      path: "/models/anatomy/hra-v1.2/large-intestine-male.glb",
      fallback: "/media/anatomy/digestive-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry registered to the HRA reference body; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Caecum, appendix, colon segments, flexures, rectum, and ileocecal valve remain separately addressable.",
    },
    {
      key: "kidney-left",
      label: "Adult male left-kidney reference object",
      path: "/models/anatomy/hra-v1.2/kidney-left-male.glb",
      fallback: "/media/anatomy/urinary-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Capsule, cortex, columns, pyramids, papillae, and hilum remain separate source meshes.",
    },
    {
      key: "kidney-right",
      label: "Adult male right-kidney reference object",
      path: "/models/anatomy/hra-v1.2/kidney-right-male.glb",
      fallback: "/media/anatomy/urinary-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Capsule, cortex, columns, pyramids, papillae, and hilum remain separate source meshes.",
    },
    {
      key: "ureter-left",
      label: "Adult male left collecting system and ureter",
      path: "/models/anatomy/hra-v1.2/ureter-left-male.glb",
      fallback: "/media/anatomy/urinary-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Minor calyces, major calyces, renal pelvis, and ureter remain separate source meshes.",
    },
    {
      key: "ureter-right",
      label: "Adult male right collecting system and ureter",
      path: "/models/anatomy/hra-v1.2/ureter-right-male.glb",
      fallback: "/media/anatomy/urinary-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Minor calyces, major calyces, renal pelvis, and ureter remain separate source meshes.",
    },
    {
      key: "urinary-bladder",
      label: "Adult male urinary-bladder reference object",
      path: "/models/anatomy/hra-v1.2/urinary-bladder-male.glb",
      fallback: "/media/anatomy/urinary-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Dome, base, neck smooth muscle, trigone, and ureteral orifices remain separately addressable.",
    },
    {
      key: "urethra",
      label: "Adult male urethra reference object",
      path: "/models/anatomy/hra-v1.2/urethra-male.glb",
      fallback: "/media/anatomy/urinary-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Prostatic and remaining urethral regions retain their source division; this model is sex-specific.",
    },
    {
      key: "brain",
      label: "Adult male Allen brain reference object",
      path: "/models/anatomy/hra-v1.2/brain-male.glb",
      fallback: "/media/anatomy/nervous-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Adult male Allen/HRA reference geometry aligned to the HRA coordinate framework; not a universal or patient-specific brain.",
      processing:
        "Source GLB delivered locally. All 283 cortical, subcortical, ventricular, white-matter, and hindbrain meshes retain their source names.",
    },
    {
      key: "spinal-cord",
      label: "Adult male spinal-cord reference object",
      path: "/models/anatomy/hra-v1.2/spinal-cord-male.glb",
      fallback: "/media/anatomy/nervous-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Thirty cervical, thoracic, lumbar, and sacral segment meshes remain separately addressable.",
    },
    {
      key: "eye-left",
      label: "Adult male left-eye reference object",
      path: "/models/anatomy/hra-v1.2/eye-left-male.glb",
      fallback: "/media/anatomy/sensory-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific eye.",
      processing:
        "Source GLB delivered locally. Cornea, sclera, iris, pupil, lens, humors, retina, macula, fovea, optic disc, and related meshes remain separate.",
    },
    {
      key: "eye-right",
      label: "Adult male right-eye reference object",
      path: "/models/anatomy/hra-v1.2/eye-right-male.glb",
      fallback: "/media/anatomy/sensory-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific eye.",
      processing:
        "Source GLB delivered locally. Cornea, sclera, iris, pupil, lens, humors, retina, macula, fovea, optic disc, and related meshes remain separate.",
    },
    {
      key: "spleen",
      label: "Adult male spleen reference object",
      path: "/models/anatomy/hra-v1.2/spleen-male.glb",
      fallback: "/media/anatomy/immune-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; not a universal or patient-specific body.",
      processing:
        "Source GLB delivered locally. Diaphragmatic, gastric, renal, and colic surfaces plus the splenic hilum remain addressable.",
    },
    {
      key: "thymus",
      label: "Adult male thymus reference object",
      path: "/models/anatomy/hra-v1.2/thymus-male.glb",
      fallback: "/media/anatomy/immune-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Healthy adult male reference geometry derived from the NLM Visible Human male dataset; thymic size and composition vary strongly with age.",
      processing:
        "Source GLB delivered locally. Right and left thymic lobes remain separate source meshes in their registered thoracic position.",
    },
    {
      key: "lymph-node",
      label: "Adult male lymph-node microanatomy reference object",
      path: "/models/anatomy/hra-v1.2/lymph-node-male.glb",
      fallback: "/media/anatomy/immune-reference-render.png",
      sourceId: "hra-models",
      referenceBody:
        "Generalized adult male lymph-node reference object; it is not the position or shape of one mapped individual node.",
      processing:
        "Source GLB delivered locally. Capsule, follicles, paracortex, medulla, afferent and efferent lymphatics, and blood vasculature remain separate.",
    },
    {
      key: "skeleton-full",
      label: "Whole-body 201-bone skeletal reference",
      path: "/models/anatomy/z-anatomy/full-skeleton-bodyparts3d.glb",
      fallback: "/media/anatomy/full-skeleton-reference-render.png",
      sourceId: "bodyparts3d",
      referenceBody:
        "BodyParts3D whole-body reference geometry; anatomical variation and patient-specific differences are not represented.",
      processing:
        "The open BodyParts3D bone set was converted to one browser-ready GLB with 201 separately named bone meshes; Loupe only normalizes its coordinate frame, material, and presentation scale at runtime.",
    },
  ],
  views: [
    {
      id: "context",
      label: "In place",
      description: "See the active system in its registered relationships within the current body territory.",
      visibleChange:
        "Related organs remain visible with quieter materials so position and connection are legible without obscuring the selected system.",
      evidence: "reference-anatomy",
    },
    {
      id: "isolate",
      label: "Isolate",
      description: "Remove neighboring organ context and inspect the active system directly.",
      visibleChange:
        "Only the source meshes belonging to the active system remain visible; no geometry is invented or reshaped.",
      evidence: "reference-anatomy",
    },
    {
      id: "pathway",
      label: "Trace function",
      description: "Emphasize the structures that form a functional route through the active system.",
      visibleChange:
        "Registered vessel, airway, or organ-route meshes receive a sequential animated emphasis; direction and timing are explanatory, not measured live physiology.",
      evidence: "scientific-visualization",
    },
  ],
  systems: [
    {
      id: "cardiovascular",
      index: "01",
      label: "Cardiovascular system",
      shortLabel: "Cardiovascular",
      territory: "Thorax",
      thesis: "A pressure-driven circuit connects the heart to pulmonary and systemic vessels.",
      overview:
        "The heart is a muscular pump divided into right and left circuits. Valves maintain one-way movement, the pulmonary circuit exchanges gases through the lungs, and systemic vessels distribute blood through the body.",
      accent: "#b64d3f",
      fallback: "/media/anatomy/thorax-reference-render.png",
      modelKeys: ["heart", "lung", "vasculature"],
      availableViews: ["context", "isolate", "pathway"],
      viewLabels: { context: "In place", isolate: "Isolate", pathway: "Trace circulation" },
      defaultStructureId: "heart",
      structures: [
        {
          id: "heart",
          systemId: "cardiovascular",
          label: "Heart",
          category: "Organ",
          summary: "A four-chambered muscular pump at the center of two connected circulatory loops.",
          detail:
            "The right side receives oxygen-poor blood and sends it toward the lungs. The left side receives oxygen-rich blood and drives it into the systemic circulation. The reference model keeps chambers, septum, valves, and papillary muscles as separate structures.",
          relationship:
            "It lies in the mediastinum between the lungs, behind the sternum and above the diaphragm, with its apex directed down and to the anatomical left.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "visible-human"],
          selectors: [{ model: "heart", includes: ["VH_M_"] }],
          formalTerms: { fma: "FMA:7088", uberon: "UBERON:0000948" },
        },
        {
          id: "left-ventricle",
          systemId: "cardiovascular",
          label: "Left ventricle",
          category: "Chamber",
          summary: "The thick-walled chamber that propels blood into the aorta and systemic circulation.",
          detail:
            "During ventricular systole, the left ventricle contracts and ejects blood through the aortic valve. Its myocardium is substantially thicker than the right ventricle because it works against the higher resistance of the systemic circulation.",
          relationship:
            "It forms much of the heart's left border and apex, sitting below the left atrium and to the left of the interventricular septum.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "heart", includes: ["heart_left_ventricle"] }],
          formalTerms: { fma: "FMA:7101", uberon: "UBERON:0002084", laterality: "Left" },
        },
        {
          id: "right-ventricle",
          systemId: "cardiovascular",
          label: "Right ventricle",
          category: "Chamber",
          summary: "The chamber that sends venous blood through the pulmonary trunk toward the lungs.",
          detail:
            "The right ventricle receives blood through the tricuspid valve and ejects it through the pulmonary valve. It operates at lower pressure than the left ventricle because the pulmonary circuit is shorter and normally lower resistance.",
          relationship:
            "It forms most of the anterior surface of the heart and wraps partly around the interventricular septum in front of the left ventricle.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "heart", includes: ["heart_right_ventricle"] }],
          formalTerms: { fma: "FMA:7098", uberon: "UBERON:0002080", laterality: "Right" },
        },
        {
          id: "atria",
          systemId: "cardiovascular",
          label: "Atria",
          category: "Chambers",
          summary: "The two receiving chambers that pass venous return into the ventricles.",
          detail:
            "The right atrium receives systemic venous blood through the venae cavae. The left atrium receives pulmonary venous blood from the lungs. Their contractions assist ventricular filling but most filling occurs passively.",
          relationship:
            "Both atria sit superior and posterior to their respective ventricles and connect to them through the atrioventricular valves.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "heart", includes: ["cardiac_atrium"] }],
          formalTerms: { uberon: "UBERON:0002081" },
        },
        {
          id: "heart-valves",
          systemId: "cardiovascular",
          label: "Four heart valves",
          category: "Valves",
          summary: "Thin tissue structures that keep blood moving in one direction through the chambers.",
          detail:
            "The mitral and tricuspid valves separate atria from ventricles. The aortic and pulmonary valves guard the ventricular outflow tracts. They open and close in response to pressure differences rather than by active muscular pulling.",
          relationship:
            "Each valve sits at a junction between a chamber and the next chamber or great vessel, creating a sequence through the cardiac circuit.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "heart", includes: ["valve"] }],
          formalTerms: { fma: "FMA:7110", uberon: "UBERON:0002139" },
        },
        {
          id: "coronary-vessels",
          systemId: "cardiovascular",
          label: "Coronary vessels",
          category: "Vessels",
          summary: "Surface vessels that supply and drain the heart muscle itself.",
          detail:
            "The coronary arteries arise near the aortic root and distribute oxygenated blood across the myocardium. Cardiac veins return blood toward the coronary sinus and right atrium. Their branching pattern is shown as reference anatomy, not patient-specific vasculature.",
          relationship:
            "They course over the epicardial surface and send smaller branches into the muscular wall of the heart.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [
            { model: "vasculature", includes: ["coronary_artery", "cardiac_vein", "coronary_sinus", "anterior_descending"] },
          ],
          formalTerms: { fma: "FMA:49893", uberon: "UBERON:0001613" },
        },
        {
          id: "great-vessels",
          systemId: "cardiovascular",
          label: "Great vessels",
          category: "Vessels",
          summary: "The large arteries and veins that connect the heart with pulmonary and systemic circuits.",
          detail:
            "The aorta carries blood from the left ventricle, the venae cavae return blood to the right atrium, pulmonary arteries leave the right ventricle, and pulmonary veins return to the left atrium. Red and blue are conventional route colours, not literal blood colours.",
          relationship:
            "These vessels converge at the superior and posterior aspects of the heart and continue into the lungs, neck, trunk, and limbs.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [
            { model: "vasculature", includes: ["aorta", "vena_cava", "pulmonary_artery", "pulmonary_vein", "pulmonary_trunk"] },
          ],
          formalTerms: { fma: "FMA:66643", uberon: "UBERON:0013140" },
        },
      ],
    },
    {
      id: "respiratory",
      index: "02",
      label: "Respiratory system",
      shortLabel: "Respiratory",
      territory: "Airway & thorax",
      thesis: "A branching airway delivers air to exchange surfaces while the circulation carries gases onward.",
      overview:
        "Air passes from the upper airway through the trachea, main bronchi, lobar and segmental bronchi. The lungs are divided into lobes and bronchopulmonary segments that share space with the pulmonary circulation.",
      accent: "#b99272",
      fallback: "/media/anatomy/thorax-reference-render.png",
      modelKeys: ["lung", "heart", "vasculature"],
      availableViews: ["context", "isolate", "pathway"],
      viewLabels: { context: "In place", isolate: "Isolate", pathway: "Trace airflow" },
      defaultStructureId: "lungs",
      structures: [
        {
          id: "lungs",
          systemId: "respiratory",
          label: "Lungs",
          category: "Paired organs",
          summary: "Paired thoracic organs organized into lobes and bronchopulmonary segments.",
          detail:
            "The lungs surround a branching airway and pulmonary vascular network. The right lung usually has three lobes and the left two, leaving space for the heart. The displayed surfaces are reference segment geometry, not photographic tissue texture.",
          relationship:
            "They occupy the pleural cavities on either side of the mediastinum and sit above the diaphragm, enclosing the heart between their medial surfaces.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "visible-human"],
          selectors: [{ model: "lung", includes: ["bronchopulmonary_segment", "hilum"] }],
          formalTerms: { fma: "FMA:7195", uberon: "UBERON:0002048" },
        },
        {
          id: "trachea",
          systemId: "respiratory",
          label: "Trachea",
          category: "Airway",
          summary: "A cartilage-supported airway connecting the larynx to the main bronchi.",
          detail:
            "The trachea conducts air through the neck and superior mediastinum. C-shaped cartilaginous supports help keep its lumen open while the posterior membranous wall allows limited flexibility.",
          relationship:
            "It descends anterior to the oesophagus and divides at the carina into right and left main bronchi.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "lung", includes: ["VH_M_trachea", "tracheal_cartilage"] }],
          formalTerms: { fma: "FMA:7394", uberon: "UBERON:0003126" },
        },
        {
          id: "carina",
          systemId: "respiratory",
          label: "Carina",
          category: "Airway landmark",
          summary: "The internal ridge at the division of the trachea into the main bronchi.",
          detail:
            "The carina marks the tracheal bifurcation and is highly sensitive to mechanical stimulation. Its position helps orient bronchoscopy and thoracic imaging.",
          relationship:
            "It lies near the level of the sternal angle, immediately above the right and left main bronchi.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "lung", includes: ["carina"] }],
          formalTerms: { fma: "FMA:7465", uberon: "UBERON:0002330" },
        },
        {
          id: "main-bronchi",
          systemId: "respiratory",
          label: "Main bronchi",
          category: "Airway",
          summary: "The first two branches carrying air from the trachea into each lung.",
          detail:
            "The right and left main bronchi enter their respective lungs at the hila and divide into lobar bronchi. The right main bronchus is typically wider, shorter, and more vertical than the left.",
          relationship:
            "They begin at the carina and travel laterally into each lung alongside pulmonary arteries and veins.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "lung", includes: ["main_bronchus"] }],
          formalTerms: { fma: "FMA:7409", uberon: "UBERON:0002185" },
        },
        {
          id: "bronchial-tree",
          systemId: "respiratory",
          label: "Bronchial tree",
          category: "Branching airway",
          summary: "Repeated airway branches distributing air through lobes and pulmonary segments.",
          detail:
            "Main bronchi divide into lobar, segmental, and progressively smaller bronchi. The present source resolves named central branches; microscopic bronchioles and alveoli require a separate multiscale dataset and are not fabricated here.",
          relationship:
            "The tree branches within the lung parenchyma and travels with pulmonary vessels toward progressively smaller exchange territories.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "lung", includes: ["bronchus", "bronchial_cartilage"] }],
          formalTerms: { fma: "FMA:7399", uberon: "UBERON:0002182" },
        },
      ],
    },
    {
      id: "digestive",
      index: "03",
      label: "Digestive system",
      shortLabel: "Digestive",
      territory: "Abdomen",
      thesis: "A continuous tract and its accessory organs transform food into absorbable material.",
      overview:
        "The delivered abdominal reference shows the liver and pancreas in their registered relationship to the small and large intestines. It is a spatial atlas of the supplied organs, not a claim that the entire gastrointestinal tract is present: mouth, oesophagus, stomach, and gallbladder await equally qualified source models.",
      accent: "#a85d46",
      fallback: "/media/anatomy/digestive-reference-render.png",
      modelKeys: ["liver", "pancreas", "small-intestine", "large-intestine"],
      availableViews: ["context", "isolate", "pathway"],
      viewLabels: { context: "In place", isolate: "Isolate", pathway: "Digestive route" },
      defaultStructureId: "digestive-territory",
      structures: [
        {
          id: "digestive-territory",
          systemId: "digestive",
          label: "Digestive territory",
          category: "Registered organ set",
          summary: "Four source objects shown together in their shared abdominal coordinate frame.",
          detail:
            "This release combines the HRA liver, pancreas, small intestine, and large intestine without moving or reshaping their source geometry. The stomach, gallbladder, oesophagus, oral cavity, and anus are not represented by this delivered model set and are therefore not fabricated.",
          relationship:
            "The liver occupies the upper abdomen, the pancreas lies posterior to the upper gastrointestinal tract, and the large intestine frames much of the coiled small intestine.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "visible-human", "niddk-digestion"],
          selectors: [
            { model: "liver", includes: ["VH_M_"] },
            { model: "pancreas", includes: ["VH_M_"] },
            { model: "small-intestine", includes: ["VH_M_"] },
            { model: "large-intestine", includes: ["VH_M_"] },
          ],
          formalTerms: { uberon: "UBERON:0001007" },
        },
        {
          id: "liver",
          systemId: "digestive",
          label: "Liver",
          category: "Accessory organ",
          summary: "A large upper-abdominal organ that processes absorbed material and produces bile.",
          detail:
            "The liver receives nutrient-rich blood from the gastrointestinal tract through the portal circulation, processes and stores many absorbed substances, and produces bile that contributes to fat digestion. Its source object resolves surface impressions, ligaments, lobes, and segmental territories.",
          relationship:
            "It lies predominantly beneath the right dome of the diaphragm, superior to the transverse colon and partly anterior to the right kidney.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-digestion"],
          selectors: [{ model: "liver", includes: ["VH_M_"] }],
          formalTerms: { uberon: "UBERON:0002107" },
        },
        {
          id: "porta-hepatis",
          systemId: "digestive",
          label: "Porta hepatis",
          category: "Surface gateway",
          summary: "The transverse gateway where major vessels and ducts enter or leave the liver.",
          detail:
            "The porta hepatis is a fissure on the visceral surface of the liver associated with the portal vein, hepatic artery, lymphatics, nerves, and hepatic ducts. This model identifies the landmark but does not invent structures absent from its meshes.",
          relationship:
            "It sits on the inferior visceral surface between major hepatic territories and faces the upper abdominal viscera.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "liver", includes: ["porta_hepatis"] }],
          formalTerms: { uberon: "UBERON:0001278" },
        },
        {
          id: "pancreas",
          systemId: "digestive",
          label: "Pancreas",
          category: "Accessory organ",
          summary: "A glandular organ with digestive and endocrine functions across the upper abdomen.",
          detail:
            "Its exocrine tissue releases bicarbonate-rich digestive juice and enzymes into the small intestine, while endocrine islets release hormones into the circulation. The reference mesh distinguishes head, neck, body, tail, and uncinate process but does not resolve microscopic islets or ducts.",
          relationship:
            "The head lies within the curve of the duodenum; the body crosses the posterior upper abdomen and the tail approaches the spleen.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-digestion"],
          selectors: [{ model: "pancreas", includes: ["VH_M_"] }],
          formalTerms: { uberon: "UBERON:0001264" },
        },
        {
          id: "duodenum",
          systemId: "digestive",
          label: "Duodenum",
          category: "Small intestine",
          summary: "The first small-intestinal region, receiving material from the stomach and accessory secretions.",
          detail:
            "The duodenum mixes incoming chyme with pancreatic secretion and bile. The source object resolves superior, descending, horizontal, and ascending parts as well as the duodenal ampulla and selected junctional structures.",
          relationship:
            "It curves around the pancreatic head before continuing as the jejunum, largely fixed against the posterior abdominal wall.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-digestion"],
          selectors: [{ model: "small-intestine", includes: ["duoden"] }],
          formalTerms: { uberon: "UBERON:0002114" },
        },
        {
          id: "jejunum",
          systemId: "digestive",
          label: "Jejunum",
          category: "Small intestine",
          summary: "The middle small-intestinal region where digestion and absorption continue.",
          detail:
            "The jejunum receives partially digested material from the duodenum and participates extensively in nutrient and water absorption. Its mucosal folds and microscopic villi are functionally important but below the resolution of this organ-level reference object.",
          relationship:
            "It follows the duodenum and forms mobile intraperitoneal loops before transitioning gradually into the ileum.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-digestion"],
          selectors: [{ model: "small-intestine", includes: ["jejunum"] }],
          formalTerms: { uberon: "UBERON:0002115" },
        },
        {
          id: "ileum",
          systemId: "digestive",
          label: "Ileum",
          category: "Small intestine",
          summary: "The distal small-intestinal region leading to the ileocecal junction.",
          detail:
            "The ileum is the final portion of the small intestine and continues absorption before intestinal contents enter the caecum. The model separately identifies ileum and terminal ileum but does not display microscopic mucosa.",
          relationship:
            "Its terminal segment joins the caecum at the ileocecal valve in the right lower abdomen.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-digestion"],
          selectors: [{ model: "small-intestine", includes: ["ileum"] }],
          formalTerms: { uberon: "UBERON:0002116" },
        },
        {
          id: "large-intestine",
          systemId: "digestive",
          label: "Large intestine",
          category: "Gastrointestinal tract",
          summary: "The caecum, colon, and rectum that reclaim water and consolidate digestive waste.",
          detail:
            "The large intestine receives material through the ileocecal valve, absorbs water and electrolytes, and moves progressively consolidated contents toward the rectum. This source resolves caecum, appendix, four named colon regions, flexures, and rectum.",
          relationship:
            "It begins in the right lower abdomen, ascends, crosses, descends, and curves into the pelvis, framing much of the small-intestinal mass.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-digestion"],
          selectors: [{ model: "large-intestine", includes: ["VH_M_"] }],
          formalTerms: { uberon: "UBERON:0000059" },
        },
        {
          id: "appendix",
          systemId: "digestive",
          label: "Vermiform appendix",
          category: "Lymphoid-rich intestinal appendage",
          summary: "A narrow, blind-ended tube arising from the caecum.",
          detail:
            "The vermiform appendix projects from the caecum near the ileocecal junction. Its wall contains abundant lymphoid tissue, although that microscopic organization is outside the resolution of the displayed organ-level mesh.",
          relationship:
            "It arises from the caecum in the right lower abdomen, with a tip position that varies between individuals.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "large-intestine", includes: ["vermiform_appendix"] }],
          formalTerms: { uberon: "UBERON:0001154" },
        },
      ],
    },
    {
      id: "urinary",
      index: "04",
      label: "Urinary system",
      shortLabel: "Urinary",
      territory: "Retroperitoneum & pelvis",
      thesis: "Filtration becomes a continuous route from paired kidneys to a controlled outlet.",
      overview:
        "The kidneys regulate the composition and volume of body fluids while producing urine. The collecting systems funnel urine into the ureters, the bladder stores it, and the urethra provides an outlet. This is an adult male reference and the urethral anatomy is explicitly sex-specific.",
      accent: "#9a6551",
      fallback: "/media/anatomy/urinary-reference-render.png",
      modelKeys: [
        "kidney-left",
        "kidney-right",
        "ureter-left",
        "ureter-right",
        "urinary-bladder",
        "urethra",
      ],
      availableViews: ["context", "isolate", "pathway"],
      viewLabels: { context: "In place", isolate: "Isolate", pathway: "Urine route" },
      defaultStructureId: "urinary-tract",
      structures: [
        {
          id: "urinary-tract",
          systemId: "urinary",
          label: "Urinary tract",
          category: "Registered organ route",
          summary: "Paired filters connected to a muscular reservoir and outlet.",
          detail:
            "The delivered HRA objects preserve the bilateral kidneys and collecting systems, both ureters, the urinary bladder, and the adult male urethra in one coordinate frame. Trace function highlights this route as a scientific visualization, not measured fluid motion.",
          relationship:
            "The kidneys lie high on the posterior abdominal wall; the ureters descend retroperitoneally to the pelvic bladder, which continues inferiorly as the urethra.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "visible-human", "niddk-urinary"],
          selectors: [
            { model: "kidney-left", includes: ["VH_M_"] },
            { model: "kidney-right", includes: ["VH_M_"] },
            { model: "ureter-left", includes: ["VH_M_"] },
            { model: "ureter-right", includes: ["VH_M_"] },
            { model: "urinary-bladder", includes: ["VH_M_"] },
            { model: "urethra", includes: ["VH_M_"] },
          ],
          formalTerms: { uberon: "UBERON:0001008", laterality: "Bilateral route; male outlet" },
        },
        {
          id: "kidneys",
          systemId: "urinary",
          label: "Kidneys",
          category: "Paired organs",
          summary: "Paired organs that filter plasma and regulate fluid, electrolyte, and acid-base balance.",
          detail:
            "Blood is filtered within microscopic nephrons; useful water and solutes are selectively returned while wastes and excess water contribute to urine. The HRA organ meshes resolve cortex, columns, pyramids, papillae, hila, and capsules, but not individual nephrons.",
          relationship:
            "They lie retroperitoneally on either side of the spine below the rib cage; the liver usually makes the right kidney sit slightly lower.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-kidneys"],
          selectors: [
            { model: "kidney-left", includes: ["VH_M_"] },
            { model: "kidney-right", includes: ["VH_M_"] },
          ],
          formalTerms: { uberon: "UBERON:0002113", laterality: "Bilateral" },
        },
        {
          id: "renal-cortex",
          systemId: "urinary",
          label: "Renal cortex",
          category: "Kidney region",
          summary: "The outer renal region containing glomeruli and much of the nephron tubule system.",
          detail:
            "The renal cortex lies beneath the capsule and extends between medullary pyramids as renal columns. Individual glomeruli and tubules are far below this mesh scale and are described rather than falsely rendered.",
          relationship:
            "It forms the peripheral layer of each kidney and sends cortical tissue inward between medullary pyramids.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-kidneys"],
          selectors: [
            { model: "kidney-left", includes: ["outer_cortex"] },
            { model: "kidney-right", includes: ["outer_cortex"] },
          ],
          formalTerms: { uberon: "UBERON:0001225", laterality: "Bilateral" },
        },
        {
          id: "renal-pyramids",
          systemId: "urinary",
          label: "Renal pyramids",
          category: "Kidney medulla",
          summary: "Conical medullary territories that converge toward renal papillae.",
          detail:
            "Collecting ducts traverse the medullary pyramids toward their papillae, where urine enters the minor calyces. The model distinguishes multiple pyramids and papillae on both sides as reference anatomy.",
          relationship:
            "They sit deep to the cortex, separated by renal columns and directed inward toward the collecting system.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-kidneys"],
          selectors: [
            { model: "kidney-left", includes: ["renal_pyramid"] },
            { model: "kidney-right", includes: ["renal_pyramid"] },
          ],
          formalTerms: { uberon: "UBERON:0004200", laterality: "Bilateral" },
        },
        {
          id: "collecting-systems",
          systemId: "urinary",
          label: "Calyces & renal pelvis",
          category: "Collecting system",
          summary: "A branching funnel that receives urine and narrows into each ureter.",
          detail:
            "Minor calyces receive urine from renal papillae and converge into larger calyces and the renal pelvis. The paired HRA source objects preserve those named branches and their continuation into the ureters.",
          relationship:
            "They occupy the central renal sinus and converge at each kidney's medial hilum before descending as a ureter.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-kidneys"],
          selectors: [
            { model: "ureter-left", includes: ["calyx", "renal_pelvis"] },
            { model: "ureter-right", includes: ["calyx", "renal_pelvis"] },
          ],
          formalTerms: { uberon: "UBERON:0001224", laterality: "Bilateral" },
        },
        {
          id: "ureters",
          systemId: "urinary",
          label: "Ureters",
          category: "Muscular tubes",
          summary: "Paired muscular conduits carrying urine from renal pelves to the bladder.",
          detail:
            "Peristaltic waves in the ureteral walls propel urine toward the bladder; gravity alone is not the mechanism. Trace function visualizes the route but does not claim measured speed or timing.",
          relationship:
            "Each ureter descends retroperitoneally from the renal pelvis and enters the bladder obliquely at a ureteral orifice.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-urinary"],
          selectors: [
            { model: "ureter-left", includes: ["VH_M_ureter_L"] },
            { model: "ureter-right", includes: ["VH_M_ureter_R"] },
          ],
          formalTerms: { uberon: "UBERON:0000056", laterality: "Bilateral" },
        },
        {
          id: "urinary-bladder",
          systemId: "urinary",
          label: "Urinary bladder",
          category: "Muscular reservoir",
          summary: "A distensible pelvic organ that stores urine between voids.",
          detail:
            "The bladder wall accommodates changing volume and contracts during urination. The HRA source separates its dome, base, neck smooth muscle, trigone, and paired ureteral orifices; a static reference shape does not represent one fixed fill volume.",
          relationship:
            "It sits in the pelvis behind the pubic bones, receives both ureters, and narrows inferiorly toward the urethra.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-urinary"],
          selectors: [{ model: "urinary-bladder", includes: ["VH_M_"] }],
          formalTerms: { uberon: "UBERON:0001255" },
        },
        {
          id: "bladder-trigone",
          systemId: "urinary",
          label: "Bladder trigone",
          category: "Internal landmark",
          summary: "A triangular bladder-base region defined by two ureteral openings and the internal urethral opening.",
          detail:
            "The trigone is a smooth internal region of the bladder base. Its geometry helps orient the route from both ureters toward the bladder outlet, although this organ-level mesh does not display urothelial microstructure.",
          relationship:
            "It lies at the bladder base between the paired ureteral orifices and the bladder neck.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models"],
          selectors: [{ model: "urinary-bladder", includes: ["trigone"] }],
          formalTerms: { uberon: "UBERON:0001258" },
        },
        {
          id: "urethra",
          systemId: "urinary",
          label: "Male urethra",
          category: "Outlet",
          summary: "The sex-specific tube carrying urine from the bladder to the exterior.",
          detail:
            "This reference object is explicitly male and separates a prostatic portion from the remaining urethra. It should not be generalized to female urethral anatomy, which differs substantially in length and anatomical relationships.",
          relationship:
            "It begins at the bladder neck and continues inferiorly through male pelvic and external genital anatomy beyond the delivered bladder model.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niddk-urinary"],
          selectors: [{ model: "urethra", includes: ["VH_M_"] }],
          formalTerms: { uberon: "UBERON:0000057", laterality: "Male reference" },
        },
      ],
    },
    {
      id: "nervous",
      index: "05",
      label: "Central nervous system",
      shortLabel: "Nervous",
      territory: "Brain & spinal axis",
      thesis: "Dense regional specialization meets a continuous signaling axis through the spinal cord.",
      overview:
        "An Allen/HRA adult male brain with 283 named regions is shown in registration with a thirty-segment spinal cord. The exhibit can address organ-scale territories and named nuclei, gyri, tracts, ventricles, and cord segments; it does not invent individual neurons or functional connectivity absent from these meshes.",
      accent: "#9a655d",
      fallback: "/media/anatomy/nervous-reference-render.png",
      modelKeys: ["brain", "spinal-cord"],
      availableViews: ["context", "isolate"],
      viewLabels: { context: "In place", isolate: "Isolate region", pathway: "Signal axis" },
      defaultStructureId: "central-nervous-system",
      structures: [
        {
          id: "central-nervous-system",
          systemId: "nervous",
          label: "Central nervous system",
          category: "Registered organ axis",
          summary: "The brain and spinal cord shown as one continuous central anatomical territory.",
          detail:
            "The brain integrates sensory information, supports cognition and behavior, and coordinates output through distributed regions. The spinal cord exchanges information with the body and also coordinates patterned activity. Signal axis is an explanatory emphasis across source meshes, not a connectome or measured neural firing.",
          relationship:
            "The brain occupies the cranial cavity and continues through the foramen magnum into the spinal cord within the vertebral canal.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "ninds-brain", "ninds-spinal"],
          selectors: [
            { model: "brain", includes: ["Allen_"] },
            { model: "spinal-cord", includes: ["VH_M_"] },
          ],
          formalTerms: { uberon: "UBERON:0001017" },
        },
        {
          id: "frontal-regions",
          systemId: "nervous",
          label: "Frontal cortical regions",
          category: "Cerebral cortex",
          summary: "Anterior cortical territories involved in planning, action, language, and executive control.",
          detail:
            "The source distinguishes precentral, superior, middle, inferior, orbital, medial, and opercular frontal territories on both sides. Functional specialization is distributed and variable; selecting this group does not claim that one behavior belongs to one isolated patch.",
          relationship:
            "These regions occupy the anterior cerebrum, in front of the central sulcus and superior to the orbital surfaces.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "ninds-brain"],
          selectors: [{ model: "brain", includes: ["frontal_gyrus", "precentral_gyrus", "frontal_operculum", "orbital_gyrus", "gyrus_rectus", "frontal_agranular"] }],
          formalTerms: { uberon: "UBERON:0001870", laterality: "Bilateral" },
        },
        {
          id: "parietal-regions",
          systemId: "nervous",
          label: "Parietal cortical regions",
          category: "Cerebral cortex",
          summary: "Posterior-superior cortical territories integrating somatic sensation and spatial information.",
          detail:
            "The model resolves postcentral, superior and inferior parietal, supramarginal, angular, precuneus, and related territories. They participate in distributed networks rather than acting as isolated modules.",
          relationship:
            "They lie behind the frontal lobe and above much of the temporal lobe, extending onto the medial cerebral surface.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "ninds-brain"],
          selectors: [{ model: "brain", includes: ["postcentral_gyrus", "parietal", "supramarginal", "angular_gyrus", "precuneus"] }],
          formalTerms: { uberon: "UBERON:0001871", laterality: "Bilateral" },
        },
        {
          id: "temporal-memory-regions",
          systemId: "nervous",
          label: "Temporal & memory regions",
          category: "Cerebral cortex and limbic structures",
          summary: "Lateral and medial temporal structures important to audition, recognition, and memory.",
          detail:
            "The source resolves temporal gyri and deep medial structures including hippocampal and amygdaloid territories. These structures participate in many overlapping networks; the display is a spatial grouping, not a single-function map.",
          relationship:
            "Temporal regions occupy the lateral and inferior cerebrum, while hippocampal and amygdaloid structures lie deeper within the medial temporal territory.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "ninds-brain"],
          selectors: [{ model: "brain", includes: ["temporal", "hippocamp", "amygdal", "parahippocamp", "fusiform"] }],
          formalTerms: { uberon: "UBERON:0001872", laterality: "Bilateral" },
        },
        {
          id: "occipital-regions",
          systemId: "nervous",
          label: "Occipital cortical regions",
          category: "Cerebral cortex",
          summary: "Posterior cortical territories that participate centrally in visual processing.",
          detail:
            "The occipital surface contains multiple visual cortical territories and communicates extensively with parietal and temporal networks. This anatomical source distinguishes named gyri and medial surfaces but does not encode live visual activation.",
          relationship:
            "These regions form the posterior pole of each cerebral hemisphere around medial calcarine and cuneal territories.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "ninds-brain", "nei-vision"],
          selectors: [{ model: "brain", includes: ["occipital", "cuneus", "lingual_gyrus", "calcarine"] }],
          formalTerms: { uberon: "UBERON:0002021", laterality: "Bilateral" },
        },
        {
          id: "basal-nuclei",
          systemId: "nervous",
          label: "Basal nuclei",
          category: "Deep forebrain",
          summary: "Deep paired nuclei that participate in selecting and coordinating action and behavior.",
          detail:
            "The selected meshes include caudate, putamen, globus pallidus, and nucleus accumbens territories. Their functions arise through loops with cortex, thalamus, and brainstem; the display should not be read as an isolated motor switch.",
          relationship:
            "They lie deep within each cerebral hemisphere, lateral to the thalamus and closely related to internal white-matter pathways.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "ninds-brain"],
          selectors: [{ model: "brain", includes: ["caudate", "putamen", "globus_pallidus", "nucleus_accumbens"] }],
          formalTerms: { uberon: "UBERON:0002420", laterality: "Bilateral" },
        },
        {
          id: "thalamus",
          systemId: "nervous",
          label: "Thalamic nuclei",
          category: "Diencephalon",
          summary: "Paired deep-brain relay and integration territories composed of many distinct nuclei.",
          detail:
            "The source resolves anterior, mediodorsal, pulvinar, ventral, geniculate, and other thalamic nuclei. Many sensory, motor, cognitive, and arousal networks pass through thalamic circuits, but no single linear relay explains the whole organ.",
          relationship:
            "The thalami sit on either side of the third ventricle, superior to the brainstem and medial to the basal nuclei.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "ninds-brain"],
          selectors: [{ model: "brain", includes: ["thalamus", "thalamic", "geniculate_nucleus"] }],
          formalTerms: { uberon: "UBERON:0001897", laterality: "Bilateral" },
        },
        {
          id: "cerebellum",
          systemId: "nervous",
          label: "Cerebellum",
          category: "Hindbrain",
          summary: "A densely folded structure that coordinates movement, timing, balance, and motor learning.",
          detail:
            "The cerebellum compares and refines activity through extensive connections with the spinal cord, brainstem, and cerebrum. The source resolves hemispheric and vermal territories plus deep nuclei and white matter.",
          relationship:
            "It lies in the posterior cranial fossa behind the brainstem and beneath the occipital cerebrum.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "ninds-brain"],
          selectors: [{ model: "brain", includes: ["cerebell"] }],
          formalTerms: { uberon: "UBERON:0002037" },
        },
        {
          id: "corpus-callosum",
          systemId: "nervous",
          label: "Corpus callosum",
          category: "White-matter tract",
          summary: "The largest commissural fiber system connecting the two cerebral hemispheres.",
          detail:
            "The corpus callosum contains axons linking widespread cortical territories across the midline. The displayed mesh marks organ-scale tract territory; individual axons and their direction of signaling are below this model's resolution.",
          relationship:
            "It arches in the midline above the lateral ventricles and below the medial cerebral cortex.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "ninds-brain"],
          selectors: [{ model: "brain", includes: ["corpus_callosum"] }],
          formalTerms: { uberon: "UBERON:0002336" },
        },
        {
          id: "spinal-cord",
          systemId: "nervous",
          label: "Spinal cord segments",
          category: "Central nervous system",
          summary: "Thirty named source segments spanning cervical, thoracic, lumbar, and sacral levels.",
          detail:
            "The spinal cord transmits information between brain and body and contains circuits that coordinate reflexes and patterned movement. Segment names describe neurological levels; the source does not include peripheral roots, nerves, or microscopic tracts.",
          relationship:
            "It descends from the brainstem through the vertebral canal, with named segments related to but not perfectly level with corresponding vertebrae.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "ninds-spinal"],
          selectors: [{ model: "spinal-cord", includes: ["spinal_cord"] }],
          formalTerms: { uberon: "UBERON:0002240" },
        },
      ],
    },
    {
      id: "sensory",
      index: "06",
      label: "Visual system",
      shortLabel: "Vision",
      territory: "Paired eyes",
      thesis: "Transparent and opaque tissues cooperate to focus light onto a neural sensory surface.",
      overview:
        "The paired HRA eyes preserve twenty-three named structures per side, from cornea and aqueous chamber to lens, vitreous, retina, macula, fovea, and optic disc. The models are displayed as a magnified organ territory rather than pretending the eye is body-sized.",
      accent: "#6c8793",
      fallback: "/media/anatomy/sensory-reference-render.png",
      modelKeys: ["eye-left", "eye-right"],
      availableViews: ["context", "isolate", "pathway"],
      viewLabels: { context: "Paired view", isolate: "Isolate tissue", pathway: "Optical path" },
      defaultStructureId: "paired-eyes",
      structures: [
        {
          id: "paired-eyes",
          systemId: "sensory",
          label: "Paired eyes",
          category: "Sensory organs",
          summary: "Bilateral optical and neural organs shown at matched magnification.",
          detail:
            "Light is refracted by the cornea, regulated by the iris and pupil, refined by the lens, and projected onto the retina where photoreceptors initiate neural signals. The source ends at the optic disc and does not include complete optic nerves or visual pathways.",
          relationship:
            "The eyes occupy the bony orbits and align their optical axes toward overlapping visual fields.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "visible-human", "nei-vision"],
          selectors: [
            { model: "eye-left", includes: ["VH_"] },
            { model: "eye-right", includes: ["VH_"] },
          ],
          formalTerms: { uberon: "UBERON:0000970", laterality: "Bilateral" },
        },
        {
          id: "corneas",
          systemId: "sensory",
          label: "Corneas",
          category: "Transparent refractive tissue",
          summary: "Clear anterior domes that provide most of the eye's fixed refractive power.",
          detail:
            "The cornea bends incoming light and also forms a protective outer surface. Transparency depends on highly ordered tissue structure and fluid regulation, which are not resolved in these organ-scale meshes.",
          relationship:
            "Each cornea forms the anterior continuation of the scleral coat in front of the aqueous chamber, iris, pupil, and lens.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "nei-vision"],
          selectors: [
            { model: "eye-left", includes: ["VH_M_cornea_L"] },
            { model: "eye-right", includes: ["VH_M_cornea_R"] },
          ],
          formalTerms: { uberon: "UBERON:0000964", laterality: "Bilateral" },
        },
        {
          id: "iris-and-pupil",
          systemId: "sensory",
          label: "Iris & pupil",
          category: "Aperture system",
          summary: "A contractile pigmented diaphragm surrounding the variable optical opening.",
          detail:
            "The iris changes pupil diameter to regulate how much light enters the eye. The pupil is an opening rather than a solid tissue; its displayed mesh is an HRA reference representation used to make the aperture addressable.",
          relationship:
            "The iris lies behind the cornea and in front of the lens, surrounding the central pupil.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "nei-vision"],
          selectors: [
            { model: "eye-left", includes: ["iris_L", "pupil_L"] },
            { model: "eye-right", includes: ["iris_R", "pupil_R"] },
          ],
          formalTerms: { uberon: "UBERON:0001769", laterality: "Bilateral" },
        },
        {
          id: "lenses",
          systemId: "sensory",
          label: "Lenses",
          category: "Transparent refractive tissue",
          summary: "Flexible transparent bodies that fine-tune focus onto the retina.",
          detail:
            "The lens changes optical power through accommodation, working with the cornea to focus light. The suspensory ligaments and ciliary apparatus alter lens shape, although the static source captures one reference geometry.",
          relationship:
            "Each lens sits behind the iris and pupil and in front of the vitreous chamber and retina.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "nei-vision"],
          selectors: [
            { model: "eye-left", includes: ["lens_L"] },
            { model: "eye-right", includes: ["lens_R"] },
          ],
          formalTerms: { uberon: "UBERON:0000965", laterality: "Bilateral" },
        },
        {
          id: "retinas",
          systemId: "sensory",
          label: "Retinas",
          category: "Neural sensory tissue",
          summary: "Light-sensitive neural layers converting photons into patterns of electrical activity.",
          detail:
            "Photoreceptors and retinal circuits transform focused light into neural signals that leave the eye through retinal ganglion-cell axons. The organ mesh represents the retinal surface, not its microscopic cell layers.",
          relationship:
            "Each retina lines the posterior interior of the eye around the vitreous chamber and converges toward the optic disc.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "nei-vision"],
          selectors: [
            { model: "eye-left", includes: ["retina_L"] },
            { model: "eye-right", includes: ["retina_R"] },
          ],
          formalTerms: { uberon: "UBERON:0000966", laterality: "Bilateral" },
        },
        {
          id: "macula-and-fovea",
          systemId: "sensory",
          label: "Macula & fovea",
          category: "Specialized retina",
          summary: "Central retinal territories supporting high-acuity, detailed vision.",
          detail:
            "The macula contains the fovea, where cone photoreceptors are densely arranged for the sharpest central vision. These are small named surface territories; their cellular architecture is below organ-model resolution.",
          relationship:
            "They lie near the posterior pole of each retina, lateral to the optic disc along the visual axis.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "nei-vision"],
          selectors: [
            { model: "eye-left", includes: ["macula", "fovea"] },
            { model: "eye-right", includes: ["macula", "fovea"] },
          ],
          formalTerms: { laterality: "Bilateral" },
        },
        {
          id: "optic-discs",
          systemId: "sensory",
          label: "Optic discs",
          category: "Neural exit landmark",
          summary: "Retinal landmarks where ganglion-cell axons and retinal vessels leave the eye.",
          detail:
            "The optic disc contains no photoreceptors and corresponds to the physiological blind spot. The delivered eye source identifies the disc but does not extend the complete optic nerve to the brain.",
          relationship:
            "Each disc lies on the posterior retina, medial to the macula and fovea.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "nei-vision"],
          selectors: [
            { model: "eye-left", includes: ["optic_disc"] },
            { model: "eye-right", includes: ["optic_disc"] },
          ],
          formalTerms: { laterality: "Bilateral" },
        },
      ],
    },
    {
      id: "immune",
      index: "07",
      label: "Immune organs",
      shortLabel: "Immune",
      territory: "Thymus · spleen · node",
      thesis: "Immune surveillance depends on specialized organs for maturation, sampling, and response.",
      overview:
        "The registered thymus and spleen are paired with a separate generalized lymph-node reference object. The lymph node is a magnifiable structural exemplar, not one body-mapped node. This distinction keeps organ position and organ microarchitecture honest while connecting immune stations conceptually.",
      accent: "#8d5e64",
      fallback: "/media/anatomy/immune-reference-render.png",
      modelKeys: ["thymus", "spleen", "lymph-node"],
      availableViews: ["context", "isolate"],
      viewLabels: { context: "Organ stations", isolate: "Isolate tissue", pathway: "Immune architecture" },
      defaultStructureId: "immune-organs",
      structures: [
        {
          id: "immune-organs",
          systemId: "immune",
          label: "Immune organ stations",
          category: "Mixed-scale source set",
          summary: "A registered thymus and spleen plus a generalized lymph-node structural reference.",
          detail:
            "T cells mature in the thymus, lymph nodes sample information arriving through lymphatic routes, and the spleen monitors blood-borne material. These are interacting stations rather than one linear pipeline; animation emphasizes architecture without claiming a single direction of immune flow.",
          relationship:
            "The thymus lies in the upper anterior chest, the spleen in the left upper abdomen, and lymph nodes occur in distributed groups throughout the body; the displayed node is not assigned a body position.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niaid-immune"],
          selectors: [
            { model: "thymus", includes: ["VH_"] },
            { model: "spleen", includes: ["VH_"] },
            { model: "lymph-node", includes: ["Yao"] },
          ],
          formalTerms: { uberon: "UBERON:0002405" },
        },
        {
          id: "thymus",
          systemId: "immune",
          label: "Thymus",
          category: "Primary lymphoid organ",
          summary: "A bilobed organ where developing T cells mature and undergo selection.",
          detail:
            "The thymus supports T-cell development and is relatively large and active earlier in life before much of its tissue is replaced by fat with age. This healthy adult male reference is one anatomical state, not a universal thymic size.",
          relationship:
            "It lies behind the upper sternum in the anterior superior mediastinum, above and in front of the heart.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niaid-immune"],
          selectors: [{ model: "thymus", includes: ["thymus"] }],
          formalTerms: { uberon: "UBERON:0002370" },
        },
        {
          id: "spleen",
          systemId: "immune",
          label: "Spleen",
          category: "Secondary lymphoid organ",
          summary: "A blood-filtering immune organ that samples circulating material and supports immune responses.",
          detail:
            "The spleen helps monitor blood-borne antigens, supports immune-cell activation, and removes aged or damaged blood cells. The source resolves organ surfaces and the hilum but not white-pulp and red-pulp microarchitecture.",
          relationship:
            "It sits high in the left upper abdomen beneath the diaphragm, behind the stomach and near the left kidney.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niaid-immune"],
          selectors: [{ model: "spleen", includes: ["spleen"] }],
          formalTerms: { uberon: "UBERON:0002106" },
        },
        {
          id: "lymph-node",
          systemId: "immune",
          label: "Lymph node",
          category: "Generalized reference organ",
          summary: "A communication hub where lymph-borne material is sampled by organized immune-cell territories.",
          detail:
            "This HRA object is a generalized node model with capsule, follicles, paracortex, medulla, lymphatic vessels, and blood vasculature. It is deliberately treated as a magnified exemplar rather than placed as one specific node in the adult body.",
          relationship:
            "Lymph nodes occur along lymphatic vessels in distributed groups; afferent lymphatics enter the node and an efferent route leaves at the hilum.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niaid-immune"],
          selectors: [{ model: "lymph-node", includes: ["Yao_"] }],
          formalTerms: { uberon: "UBERON:0000029", laterality: "Generalized exemplar" },
        },
        {
          id: "lymph-node-follicles",
          systemId: "immune",
          label: "Lymph-node follicles",
          category: "Node microanatomy",
          summary: "Organized cortical territories associated strongly with B-cell responses.",
          detail:
            "Follicles occupy the outer node cortex and can form germinal centers during active adaptive responses. The mesh identifies their organ-scale territories but does not display individual immune cells.",
          relationship:
            "They sit deep to the capsule around the node periphery, outside the deeper paracortex and medulla.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niaid-immune"],
          selectors: [{ model: "lymph-node", includes: ["follicles"] }],
          formalTerms: { laterality: "Generalized exemplar" },
        },
        {
          id: "lymph-node-paracortex",
          systemId: "immune",
          label: "Lymph-node paracortex",
          category: "Node microanatomy",
          summary: "A deeper cortical territory enriched in T cells and antigen-presenting interactions.",
          detail:
            "The paracortex lies between follicles and medulla and is a major site of T-cell organization. It is shown as one source mesh; cellular populations and dynamic traffic require histology and molecular data beyond this scale.",
          relationship:
            "It occupies an intermediate zone beneath the follicular cortex and around deeper medullary territories.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niaid-immune"],
          selectors: [{ model: "lymph-node", includes: ["paracortex"] }],
          formalTerms: { laterality: "Generalized exemplar" },
        },
        {
          id: "lymph-node-medulla",
          systemId: "immune",
          label: "Lymph-node medulla",
          category: "Node microanatomy",
          summary: "The central node territory where sinuses and immune-cell cords converge toward outflow.",
          detail:
            "The medulla contains structural channels and immune-cell-rich cords involved in filtering lymph and routing it toward the efferent vessel. The displayed object is anatomical organization, not a live-flow simulation.",
          relationship:
            "It lies deep within the node, internal to cortex and paracortex, converging toward the hilar outflow side.",
          evidence: "reference-anatomy",
          sourceIds: ["hra-models", "niaid-immune"],
          selectors: [{ model: "lymph-node", includes: ["medulla"] }],
          formalTerms: { laterality: "Generalized exemplar" },
        },
      ],
    },
    {
      id: "musculoskeletal",
      index: "08",
      label: "Full skeletal system",
      shortLabel: "Skeleton",
      territory: "Whole body · 201 named bones",
      thesis: "The skeleton is a continuous body-wide architecture: protection, leverage, mineral storage, and marrow organized from skull to toes.",
      overview:
        "This view replaces the earlier pelvis-only slice with 201 separately named bones from the open BodyParts3D reference atlas. It covers the skull, vertebral column, thoracic cage, shoulder girdles, upper limbs, pelvis, and lower limbs. Cartilage, ligaments, marrow cavities, and muscles are not included in this bone-only source and are not simulated.",
      accent: "#a89676",
      fallback: "/media/anatomy/full-skeleton-reference-render.png",
      modelKeys: ["skeleton-full"],
      availableViews: ["context", "isolate"],
      viewLabels: { context: "Whole skeleton", isolate: "Isolate region", pathway: "Not offered" },
      defaultStructureId: "full-skeleton",
      structures: [
        {
          id: "full-skeleton",
          systemId: "musculoskeletal",
          label: "Whole skeleton",
          category: "Body-wide skeletal reference",
          summary: "A complete articulated reference from the cranial bones to the distal phalanges of the feet.",
          detail:
            "Bone is living tissue that supports the body, protects organs, stores minerals, and contains marrow. The model preserves 201 named source meshes so regions can be selected without pretending to show cartilage, ligaments, microscopic bone organization, or subject-specific mechanics.",
          relationship:
            "Axial bones form the central skull, vertebral, and thoracic framework; appendicular bones attach through the shoulder and pelvic girdles to form the limbs.",
          evidence: "reference-anatomy",
          sourceIds: ["bodyparts3d", "niams-bone"],
          selectors: [{ model: "skeleton-full", includes: ["*"] }],
          formalTerms: { uberon: "UBERON:0001434", laterality: "Whole body reference" },
        },
        {
          id: "skull",
          systemId: "musculoskeletal",
          label: "Skull",
          category: "Axial skeleton",
          summary: "Cranial and facial bones protecting the brain and shaping the orbits, nasal cavity, and jaws.",
          detail:
            "The skull combines cranial bones around the brain with facial bones that support the eyes, nose, and oral cavity. Sutures, teeth, and auditory ossicles are present where the source provides separately named meshes, but soft tissue is absent.",
          relationship:
            "It sits at the superior end of the vertebral column; the occipital region meets the atlas while the mandible forms the movable lower jaw.",
          evidence: "reference-anatomy",
          sourceIds: ["bodyparts3d", "niams-bone"],
          selectors: [{ model: "skeleton-full", includes: ["frontal", "parietal", "temporal", "occipital", "sphenoid", "ethmoid", "nasal", "lacrimal", "maxilla", "mandible", "palatine", "zygomatic", "vomer", "malleus", "incus", "stapes", "tooth"] }],
          formalTerms: { uberon: "UBERON:0003128" },
        },
        {
          id: "vertebral-column",
          systemId: "musculoskeletal",
          label: "Vertebral column",
          category: "Axial skeleton",
          summary: "A segmented central column protecting the spinal cord while transmitting load through the trunk.",
          detail:
            "Cervical, thoracic, and lumbar vertebrae form a flexible column above the fused sacrum and coccyx. Intervertebral discs, ligaments, and the spinal cord are not part of this bone-only layer.",
          relationship:
            "The atlas and axis support head motion; thoracic vertebrae articulate with ribs, and the sacrum transfers axial load into the pelvic girdle.",
          evidence: "reference-anatomy",
          sourceIds: ["bodyparts3d", "niams-bone"],
          selectors: [{ model: "skeleton-full", includes: ["vertebra", "atlas", "axis", "sacrum", "coccyx"] }],
          formalTerms: { uberon: "UBERON:0001130" },
        },
        {
          id: "thoracic-cage",
          systemId: "musculoskeletal",
          label: "Thoracic cage",
          category: "Axial skeleton",
          summary: "Ribs and sternum enclosing the thorax while moving with breathing.",
          detail:
            "Twelve rib pairs attach posteriorly to thoracic vertebrae; most connect anteriorly toward the sternum through cartilage that is outside this bone-only rendering. The cage protects the heart and lungs without behaving as a rigid shell.",
          relationship:
            "It surrounds the thoracic organs between the shoulder girdles and upper abdomen, anchored anteriorly by the sternum and posteriorly by the thoracic spine.",
          evidence: "reference-anatomy",
          sourceIds: ["bodyparts3d", "niams-bone"],
          selectors: [{ model: "skeleton-full", includes: ["rib", "sternum", "xiphoid"] }],
          formalTerms: { uberon: "UBERON:0000978", laterality: "Bilateral ribs" },
        },
        {
          id: "shoulders-upper-limbs",
          systemId: "musculoskeletal",
          label: "Shoulders & upper limbs",
          category: "Appendicular skeleton",
          summary: "Shoulder girdles and arm, forearm, wrist, hand, and finger bones arranged for reach and dexterity.",
          detail:
            "Clavicles and scapulae position each upper limb. Humeri, radii, ulnae, carpals, metacarpals, and phalanges create linked levers with increasing mobility toward the hands. Joint cartilage and muscle are not shown.",
          relationship:
            "Each clavicle links the sternum to the scapula; the humerus continues to the elbow, the radius and ulna to the wrist, and the hand bones to the digits.",
          evidence: "reference-anatomy",
          sourceIds: ["bodyparts3d", "niams-bone"],
          selectors: [{ model: "skeleton-full", includes: ["clavicle", "scapula", "humerus", "radius", "ulna", "carpal", "metacarpal", "finger", "thumb", "capitate", "hamate", "lunate", "pisiform", "scaphoid", "trapezium", "trapezoid", "triquetrum"] }],
          formalTerms: { laterality: "Bilateral" },
        },
        {
          id: "pelvic-girdle",
          systemId: "musculoskeletal",
          label: "Pelvic girdle",
          category: "Axial-appendicular junction",
          summary: "Paired hip bones forming the socket-bearing bridge between the spine and lower limbs.",
          detail:
            "Each hip bone represents the fused ilium, ischium, and pubis at adult scale. Together with the sacrum, the girdle transfers trunk load and encloses the pelvic cavity; pelvic soft tissues are not displayed.",
          relationship:
            "The hip bones articulate posteriorly with the sacrum and laterally with the heads of the femora at the acetabula.",
          evidence: "reference-anatomy",
          sourceIds: ["bodyparts3d", "niams-bone"],
          selectors: [{ model: "skeleton-full", includes: ["hip bone"] }],
          formalTerms: { laterality: "Bilateral" },
        },
        {
          id: "lower-limbs",
          systemId: "musculoskeletal",
          label: "Lower limbs & feet",
          category: "Appendicular skeleton",
          summary: "Femora, patellae, leg bones, ankles, feet, and toes forming the principal weight-bearing limbs.",
          detail:
            "Femora transmit load toward the knees; tibiae carry most leg load while fibulae contribute lateral stability. Tarsals, metatarsals, and phalanges form adaptable foot arches and the lever system used in gait.",
          relationship:
            "Femoral heads meet the pelvic girdle, distal femora meet tibiae and patellae at the knees, and tibiae and fibulae continue to the ankle and foot bones.",
          evidence: "reference-anatomy",
          sourceIds: ["bodyparts3d", "niams-bone"],
          selectors: [{ model: "skeleton-full", includes: ["femur", "patella", "tibia", "fibula", "talus", "calcaneus", "navicular", "cuboid", "cuneiform", "metatarsal", "toe"] }],
          formalTerms: { laterality: "Bilateral" },
        },
      ],
    },
  ],
});

export function getAnatomySystem(id: AnatomySystemId) {
  const system = anatomy.systems.find((candidate) => candidate.id === id);
  if (!system) throw new Error(`Unknown anatomy system: ${id}`);
  return system;
}

export function getAnatomyView(id: AnatomyViewId) {
  const view = anatomy.views.find((candidate) => candidate.id === id);
  if (!view) throw new Error(`Unknown anatomy view: ${id}`);
  return view;
}

export function getAnatomyViewChange(system: AnatomySystem, view: AnatomyView) {
  if (system.id === "musculoskeletal") {
    return view.id === "isolate"
      ? "Only the named BodyParts3D bone meshes assigned to the selected region remain visible; every other bone mesh is hidden."
      : "All 201 delivered BodyParts3D bone meshes remain visible together in one normalized whole-body reference frame.";
  }

  if (system.id === "immune") {
    return view.id === "isolate"
      ? "Only source meshes matching the selected immune organ or tissue region remain visible; no inferred body-wide lymphatic network is added."
      : "Thymus and spleen remain at their registered body positions; selecting lymph-node anatomy opens a clearly disclosed magnified exemplar.";
  }

  return view.visibleChange;
}

export function getAnatomyStructure(systemId: AnatomySystemId, structureId: string) {
  return getAnatomySystem(systemId).structures.find((structure) => structure.id === structureId) ?? null;
}

export function structureMatchesMesh(
  structure: AnatomyStructure,
  model: AnatomyModelKey,
  meshName: string,
) {
  const normalized = normalizeMeshName(meshName);
  return structure.selectors.some(
    (selector) =>
      selector.model === model
      && selector.includes.some((token) => token === "*" || normalized.includes(normalizeMeshName(token))),
  );
}

export function structureForMesh(
  systemId: AnatomySystemId,
  model: AnatomyModelKey,
  meshName: string,
) {
  const normalized = normalizeMeshName(meshName);
  const candidates = getAnatomySystem(systemId).structures
    .map((structure) => {
      const matchingTokens = structure.selectors
        .filter((selector) => selector.model === model)
        .flatMap((selector) => selector.includes)
        .filter((token) => token === "*" || normalized.includes(normalizeMeshName(token)));
      return {
        structure,
        specificity: Math.max(0, ...matchingTokens.map((token) => token.length)),
      };
    })
    .filter((candidate) => candidate.specificity > 0)
    .sort((a, b) => b.specificity - a.specificity);

  return candidates[0]?.structure ?? null;
}

function normalizeMeshName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
