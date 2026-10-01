window.SITE_DATA = {
  "news": [
    {
      "date": "SEP 2026",
      "title": "Top 100+ Women in AI, Data & Robotics in Switzerland 2026 report",
      "description": "Recognized in the Academia category of the 2026 selection celebrating women shaping AI, data and robotics.",
      "url": "https://www.linkedin.com/feed/update/urn:li:activity:7510361528068407296/",
      "tags": [
        "RECOGNITION"
      ]
    },
    {
      "date": "JUL 2026",
      "title": "€2.2 million Volkswagen Foundation grant",
      "description": "Establishing a research group on world foundation models for embodied interactions, advancing physical AI and assistive robotics.",
      "url": "https://www.linkedin.com/posts/sharmita-dey-23087b24_volkswagenfoundation-activity-7483101518875766784-QzL-",
      "tags": [
        "GROUP LEADERSHIP",
        "FUNDING"
      ]
    },
    {
      "date": "CURRENT",
      "title": "Visiting Scholar at UC Berkeley",
      "description": "Research on physical AI and intelligent embodied systems at the University of California, Berkeley.",
      "url": "#about"
    },
    {
      "date": "AUG 2026",
      "title": "Joining the Science Residency",
      "description": "Part of the inaugural cohort at the Innovation Park Artificial Intelligence Foundation, developing intelligent robotic prostheses that respond to spoken language.",
      "url": "https://de.linkedin.com/posts/ipai-foundation-heilbronn_ipaifoundation-scienceresidency-aiforgood-activity-7491410764780539904-zvwm"
    },
    {
      "date": "MAY 2026",
      "title": "In conversation with Nautilus",
      "description": "On trust, collaboration, and how robots can learn through interaction: “How to Build a Trustworthy Robot.”",
      "url": "https://nautil.us/how-to-build-a-trustworthy-robot-1280550"
    },
    {
      "date": "APR 2026",
      "title": "From autonomy to alliance, in Science Robotics",
      "description": "My research paper lays out a research agenda for robot foundation models that learn with humans and other robots.",
      "url": "https://doi.org/10.1126/scirobotics.aea1822"
    },
    {
      "date": "FEB 2026",
      "title": "€210K for foundation models in assistive robotics",
      "description": "A grant from the Innovation Park Artificial Intelligence Foundation supports a proof of concept for intelligent assistive systems.",
      "url": "#research",
      "tags": [
        "FUNDING"
      ]
    }
  ],
  "projects": [
    {
      "id": "alliance",
      "title": "Alliance-aware robot foundation models",
      "category": "FOUNDATION MODELS · COLLABORATIVE INTELLIGENCE",
      "image": "assets/research/alliance-aware-models.webp",
      "alt": "Six components of alliance-aware robot foundation models, including partner modeling, communication, and trust-aware memory",
      "label": "SCIENCE ROBOTICS 2026",
      "featured": true,
      "description": "Moving from isolated autonomy to robots that learn, adapt, and collaborate with humans and other agents.",
      "detail": "How can robot foundation models become better collaborators? This research direction brings interaction and partner awareness into the learning process. Our Science Robotics viewpoint organizes the challenge around six components: interaction priors, partner modeling, modular policies, norm adaptation, trust-aware memory, and communication.",
      "meta": "Robot foundation models / Human–robot interaction",
      "caption": "Alliance-aware robotic foundation models. Figure reproduced from my research presentation; associated with the Science Robotics viewpoint (2026).",
      "links": [
        {
          "label": "Read the Science Robotics viewpoint",
          "url": "https://doi.org/10.1126/scirobotics.aea1822"
        }
      ]
    },
    {
      "id": "world",
      "title": "Continual learning and world models for embodied adaptation",
      "category": "WORLD MODELS · CONTINUAL LEARNING",
      "image": "assets/research/world-models.webp",
      "alt": "TMLR prospective rehearsal framework showing model pretraining, simulated interactions, and continual refinement",
      "label": "TMLR 2025",
      "featured": true,
      "description": "Developing continual learning models that use simulated interactions to anticipate physical dynamics and adapt control behavior over time.",
      "detail": "Continual learning and world models offer a way to build on past experience and learn from interactions before carrying them out. In our TMLR work, multitask prospective rehearsal uses simulated experience to adapt bionic limb behavior across locomotion tasks. My ongoing research develops continual learning models alongside world models for scene understanding, action prediction, and embodied control.",
      "meta": "Continual learning / Prospective rehearsal / Control",
      "caption": "Figure 1. Multitask prospective rehearsal: pretraining, simulated interaction, and refinement. Extracted directly from Dey et al., TMLR (2025).",
      "secondaryImage": "assets/research/world-models-results.webp",
      "secondaryAlt": "Experimental results from the prospective rehearsal world-model study",
      "links": [
        {
          "label": "Read the TMLR paper",
          "url": "https://openreview.net/forum?id=Bmy82p2eez"
        },
        {
          "label": "Open-access PDF",
          "url": "https://openreview.net/pdf?id=Bmy82p2eez"
        },
        {
          "label": "View full-resolution Figure 1",
          "url": "assets/research/world-models-paper-figure.webp"
        }
      ],
      "dialogImage": "assets/research/world-models-paper-figure.webp"
    },
    {
      "id": "objects",
      "title": "Object interaction & dynamics",
      "category": "SCENE UNDERSTANDING · VIDEO LEARNING",
      "image": "assets/research/object-dynamics.gif",
      "still": "assets/research/object-dynamics-poster.webp",
      "alt": "Animated synthetic scene with moving objects used for learning object interactions and physical dynamics",
      "label": "OBJECT-CENTRIC LEARNING",
      "description": "Understanding moving objects and their interactions through structured representations learned from video.",
      "detail": "Understanding a scene requires more than recognizing what is present. This research investigates object-centric video representations that track how objects move and interact. Video features, transformer-based prediction, and object matching provide a foundation for reasoning about physical dynamics and generalizing beyond the training scene.",
      "meta": "Video representations / Physical dynamics",
      "caption": "Original animated example from slide 3 (physical slide 4) of my research presentation.",
      "secondaryImage": "assets/research/object-dynamics-model.webp",
      "secondaryAlt": "Object dynamics architecture using video features, a transformer, and bipartite matching",
      "links": [
        {
          "label": "Discuss this research",
          "url": "#contact"
        }
      ]
    },
    {
      "id": "control",
      "title": "Embodied control",
      "category": "ROBOT LEARNING · ASSISTIVE SYSTEMS",
      "image": "assets/research/embodied-control.webp",
      "alt": "Closed-loop embodied control diagram connecting motion sensors, an AI digital twin, and control commands",
      "label": "PHD THESIS",
      "description": "Turning human movement and sensor feedback into adaptive behavior for wearable and assistive robots.",
      "detail": "I study learning-based control that connects human intent, sensor feedback, and robot behavior. This work spans motion forecasting, model reprogramming, and adaptive assistive systems. Real-world experiments with wearable robotics ground the learning methods in physical interaction.",
      "meta": "Motion forecasting / Wearable robotics",
      "caption": "A sensorimotor digital twin for adaptive control.",
      "video": "assets/research/embodied-control.mp4",
      "poster": "assets/research/embodied-control-poster.webp",
      "videoDescription": "Silent demonstration of gait and wearable-robot experiments used to evaluate embodied adaptation. The linked TMLR paper describes the method and evaluation.",
      "links": [
        {
          "label": "ReMAP · NeurIPS 2024",
          "url": "https://proceedings.neurips.cc/paper_files/paper/2024/hash/2cdf71a65e95bf1874212f6e604c64db-Abstract-Conference.html"
        },
        {
          "label": "TMLR experiments",
          "url": "https://openreview.net/forum?id=Bmy82p2eez"
        }
      ]
    },
    {
      "id": "multimodal",
      "title": "Multimodal self-supervised learning",
      "category": "REPRESENTATION LEARNING · SENSOR FUSION",
      "image": "assets/research/multimodal-ssl.webp",
      "alt": "PathoFM multimodal representation linking biomechanical signals, clinical data, and gait patterns",
      "label": "MULTIMODAL REPRESENTATIONS",
      "description": "Learning reusable representations from complementary signals, with less dependence on labeled data.",
      "detail": "Physical intelligence has to make sense of multiple, sometimes incomplete streams of information. I work on self-supervised representations of biomechanical and clinical time series, alongside cross-modal models that connect complementary sensing modalities. PathoFM explores a foundation-model approach to pathological gait; related work studies cross-modal diffusion and robust representation learning.",
      "meta": "Self-supervision / Time series / Cross-modal learning",
      "caption": "PathoFM representation diagram from my research presentation.",
      "secondaryImage": "assets/research/cross-modal-diffusion.webp",
      "secondaryAlt": "Cross-modal sensory diffusion framework with latent alignment during training and sampling",
      "links": [
        {
          "label": "PathoFM · NeurIPS 2025 workshop",
          "url": "https://openreview.net/forum?id=Hq9Afq7EMk"
        },
        {
          "label": "LaMbDA · SD4H 2026 workshop",
          "url": "https://openreview.net/forum?id=jy2DdtRxvH"
        }
      ]
    },
    {
      "id": "bionics",
      "title": "Trustworthy foundation models for bionic superintelligence",
      "category": "REASONING MODELS · ASSISTIVE ROBOTICS",
      "image": "assets/research/bionic-intelligence.png",
      "alt": "Artificial-intelligence schematic linked to a robotic prosthetic ankle and foot, from my research presentation",
      "label": "BIONIC INTELLIGENCE",
      "description": "Developing super intelligent models for intelligent, adaptable, and safer assistive technologies. Models should reason over possible actions, recognize uncertainty, and use new evidence to guide decisions.",
      "detail": "This research direction explores foundation models that combine multimodal understanding with multi-step reasoning for bionic intelligence. The goal is to enable assistive systems to reason over possible actions and their consequences, assess uncertainty in unfamiliar situations, and seek additional information when needed. By linking these capabilities with continual learning and adaptive control, I aim to build systems that refine their decisions as new evidence arrives and adapt to individual users.",
      "meta": "Multi-step reasoning / Uncertainty / Adaptive control",
      "caption": "AI schematic connected to a robotic prosthetic ankle and foot.",
      "links": [
        {
          "label": "Discuss this research",
          "url": "#contact"
        }
      ]
    }
  ],
  "publications": [
    {
      "id": "dey2026alliance",
      "title": "From autonomy to alliance: Robotic foundation models must learn with us, not just for us",
      "authors": [
        "Sharmita Dey",
        "Robert Riener",
        "Strahinja Dosen",
        "Stefano V. Albrecht"
      ],
      "venue": "Science Robotics",
      "venueClass": "science",
      "year": 2026,
      "type": "Journal article",
      "categories": [
        "foundation"
      ],
      "summary": "A research agenda for robot foundation models that learn through collaboration with people and other robots.",
      "url": "https://doi.org/10.1126/scirobotics.aea1822",
      "doi": "10.1126/scirobotics.aea1822",
      "bibType": "article",
      "journal": "Science Robotics",
      "volume": "11",
      "number": "113",
      "pages": "eaea1822"
    },
    {
      "id": "dey2025prospective",
      "title": "Continual Learning from Simulated Interactions via Multitask Prospective Rehearsal for Bionic Limb Behavior Modeling",
      "authors": [
        "Sharmita Dey",
        "Benjamin Paaßen",
        "Sarath Ravindran Nair",
        "Sabri Boughorbel",
        "Arndt F. Schilling"
      ],
      "venue": "Trans. Machine Learning Research",
      "venueShort": "TMLR",
      "year": 2025,
      "type": "Journal article",
      "categories": [
        "control"
      ],
      "summary": "Continual adaptation through rehearsing predicted movements across changing locomotion tasks.",
      "url": "https://openreview.net/forum?id=Bmy82p2eez",
      "pdf": "https://openreview.net/pdf?id=Bmy82p2eez",
      "bibType": "article",
      "journal": "Transactions on Machine Learning Research"
    },
    {
      "id": "dey2024remap",
      "title": "ReMAP: Neural Model Reprogramming with Network Inversion and Retrieval-Augmented Mapping for Adaptive Motion Forecasting",
      "authors": [
        "Sharmita Dey",
        "Sarath Ravindran Nair"
      ],
      "venue": "NeurIPS",
      "venueClass": "neurips",
      "year": 2024,
      "type": "Main conference",
      "categories": [
        "control",
        "foundation"
      ],
      "summary": "Adapting motion forecasting models for individuals with limb loss through neural model reprogramming.",
      "url": "https://proceedings.neurips.cc/paper_files/paper/2024/hash/2cdf71a65e95bf1874212f6e604c64db-Abstract-Conference.html",
      "pdf": "https://proceedings.neurips.cc/paper_files/paper/2024/file/2cdf71a65e95bf1874212f6e604c64db-Paper-Conference.pdf",
      "bibType": "inproceedings",
      "booktitle": "Advances in Neural Information Processing Systems",
      "volume": "37",
      "pages": "25195--25227"
    },
    {
      "id": "vogg2025primate",
      "title": "Computer vision for primate behavior analysis in the wild",
      "authors": [
        "Richard Vogg",
        "Timo Lüddecke",
        "Jonathan Henrich",
        "Sharmita Dey",
        "Matthias Nuske",
        "Valentin Hassler",
        "Derek Murphy",
        "Julia Fischer",
        "Julia Ostner",
        "Oliver Schülke",
        "Peter M. Kappeler",
        "Claudia Fichtel",
        "Alexander Gail",
        "Stefan Treue",
        "Hansjörg Scherberger",
        "Florentin Wörgötter",
        "Alexander S. Ecker"
      ],
      "shortAuthors": true,
      "venue": "Nature Methods",
      "year": 2025,
      "type": "Perspective",
      "categories": [
        "perception"
      ],
      "summary": "Computer vision for understanding natural behavior, including interactions and learning with limited labels.",
      "url": "https://www.nature.com/articles/s41592-025-02653-y",
      "doi": "10.1038/s41592-025-02653-y",
      "bibType": "article",
      "journal": "Nature Methods",
      "volume": "22",
      "pages": "1154--1166"
    },
    {
      "id": "dey2026lambda",
      "title": "LaMbDA: Diffusion-Step Alignment for Learning Robust Cross-Modal Representations in Time Series",
      "authors": [
        "Sharmita Dey",
        "Sarath Ravindran Nair"
      ],
      "venue": "ICML Workshop",
      "year": 2026,
      "type": "Structured Data for Health",
      "categories": [
        "perception"
      ],
      "summary": "Robust cross-modal representation learning through diffusion-step alignment.",
      "url": "https://openreview.net/forum?id=jy2DdtRxvH",
      "pdf": "https://openreview.net/pdf?id=jy2DdtRxvH",
      "bibType": "inproceedings",
      "booktitle": "Structured Data for Health Workshop at ICML"
    },
    {
      "id": "dey2026inductive",
      "title": "On the Role of Inductive Bias in Time-Series Pretraining: A Case Study in Learning Generalizable Representations for Clinical Time Series",
      "authors": [
        "Sharmita Dey",
        "Diego Paez-Granados"
      ],
      "venue": "arXiv",
      "year": 2026,
      "type": "Preprint",
      "categories": [
        "perception",
        "foundation"
      ],
      "summary": "Studying how inductive bias shapes generalizable representations for clinical time series.",
      "url": "https://arxiv.org/abs/2605.26194",
      "pdf": "https://arxiv.org/pdf/2605.26194",
      "bibType": "misc",
      "eprint": "2605.26194",
      "archivePrefix": "arXiv"
    },
    {
      "id": "dey2025pathofm",
      "title": "PathoFM: Toward a Foundation Model for Pathological Gait",
      "authors": [
        "Sharmita Dey",
        "Diego Paez-Granados"
      ],
      "venue": "NeurIPS Workshop",
      "venueClass": "neurips",
      "year": 2025,
      "type": "Learning from Time Series for Health",
      "categories": [
        "foundation",
        "perception"
      ],
      "summary": "Toward reusable representations of pathological gait from biomechanical time series.",
      "url": "https://openreview.net/forum?id=Hq9Afq7EMk",
      "pdf": "https://openreview.net/pdf?id=Hq9Afq7EMk",
      "bibType": "inproceedings",
      "booktitle": "NeurIPS Workshop on Learning from Time Series for Health"
    },
    {
      "id": "dey2022prepare",
      "title": "PrePARE: Predictive Proprioception for Agile Failure Event Detection in Robotic Exploration of Extreme Terrains",
      "authors": [
        "Sharmita Dey",
        "David Fan",
        "Robin Schmid",
        "Anushri Dixit",
        "Kyohei Otsu",
        "Thomas Touma",
        "Arndt F. Schilling",
        "Ali-akbar Agha-mohammadi"
      ],
      "venue": "IROS",
      "year": 2022,
      "type": "Conference paper",
      "categories": [
        "control",
        "perception"
      ],
      "summary": "Predictive proprioception for identifying failure events during robot exploration of challenging terrain.",
      "url": "https://doi.org/10.1109/IROS47612.2022.9981660",
      "doi": "10.1109/IROS47612.2022.9981660",
      "bibType": "inproceedings",
      "booktitle": "IEEE/RSJ International Conference on Intelligent Robots and Systems",
      "pages": "4338--4343"
    }
  ]
};
