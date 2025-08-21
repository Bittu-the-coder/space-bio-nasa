import axios from 'axios'

const BASE_URL = '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Mock data for demo purposes
const mockPublications = [
  {
    id: 1,
    title: "Effects of Microgravity on Plant Cell Walls and Growth Patterns",
    authors: ["Dr. Sarah Johnson", "Dr. Mike Chen", "Dr. Lisa Rodriguez"],
    year: 2023,
    mission: "ISS Expedition 68",
    organism: "Arabidopsis thaliana",
    experimentType: "Botanical Research",
    abstract: "This study investigates how microgravity conditions aboard the International Space Station affect plant cell wall composition and growth patterns in Arabidopsis thaliana. Results show significant changes in cellulose organization and altered gravitropic responses.",
    keywords: ["microgravity", "plant biology", "cell walls", "ISS", "space agriculture"],
    connections: ["cell-wall-proteins", "gravitropism", "space-farming"],
    summary: {
      plain: "Scientists studied how plants grow differently in space without gravity. They found that plant cell walls become weaker and plants grow in unusual directions, which could affect future space farming efforts.",
      technical: "Microgravity exposure resulted in 40% reduction in cellulose crystallinity, altered pectin methylesterification patterns, and dysregulated auxin transport mechanisms affecting gravitropic responses in Arabidopsis seedlings."
    }
  },
  {
    id: 2,
    title: "Bone Density Changes in Astronauts During Long-Duration Spaceflight",
    authors: ["Dr. Robert Kim", "Dr. Emma Thompson", "Dr. James Wilson"],
    year: 2022,
    mission: "Artemis Analog",
    organism: "Homo sapiens",
    experimentType: "Human Physiology",
    abstract: "Comprehensive analysis of bone mineral density changes in astronauts during 6-month missions, with implications for Mars exploration preparedness.",
    keywords: ["bone density", "astronauts", "long-duration flight", "osteoporosis", "countermeasures"],
    connections: ["calcium-metabolism", "exercise-protocols", "mars-mission-prep"],
    summary: {
      plain: "Astronauts lose bone strength during long space missions, similar to osteoporosis on Earth. This research helps develop exercise programs to keep astronauts healthy for future trips to Mars.",
      technical: "Astronauts experienced 1.5% monthly bone mineral density loss in weight-bearing bones, with trabecular bone showing greater susceptibility than cortical bone. ARED exercise protocols mitigated 60% of expected bone loss."
    }
  },
  {
    id: 3,
    title: "Microbial Community Dynamics in Closed-Loop Life Support Systems",
    authors: ["Dr. Ana Martinez", "Dr. Kevin Park", "Dr. Rachel Green"],
    year: 2023,
    mission: "ECLSS Testing",
    organism: "Mixed microbial communities",
    experimentType: "Astrobiology",
    abstract: "Investigation of microbial ecosystem stability and succession patterns in spacecraft environmental control systems over extended periods.",
    keywords: ["microbiome", "life support", "biofilms", "spacecraft hygiene", "closed ecosystems"],
    connections: ["water-recycling", "air-purification", "crew-health"],
    summary: {
      plain: "Researchers studied bacteria and other microbes that grow in spacecraft air and water systems. Understanding these tiny organisms helps keep astronauts healthy and life support systems working properly.",
      technical: "Microbial diversity decreased 35% over 180 days in closed systems, with Proteobacteria and Firmicutes dominating. Biofilm formation on surfaces increased antimicrobial resistance by 3-fold, requiring enhanced cleaning protocols."
    }
  },
  {
    id: 4,
    title: "Radiation Effects on DNA Repair Mechanisms in Human Cells",
    authors: ["Dr. Maria Santos", "Dr. David Lee", "Dr. Jennifer Adams"],
    year: 2021,
    mission: "ISS National Lab",
    organism: "Human cell cultures",
    experimentType: "Radiation Biology",
    abstract: "Analysis of DNA damage and repair pathway efficiency in human cells exposed to space radiation environment.",
    keywords: ["radiation", "DNA repair", "space environment", "cellular response", "cancer risk"],
    connections: ["radiation-shielding", "pharmaceutical-countermeasures", "crew-health-monitoring"],
    summary: {
      plain: "Space radiation damages astronaut DNA more than radiation on Earth. Scientists are studying how cells fix this damage to develop better protection for long space missions.",
      technical: "Galactic cosmic radiation exposure resulted in 3.2-fold increase in double-strand breaks and 40% reduction in homologous recombination repair efficiency. p53 pathway activation was sustained for 72 hours post-exposure."
    }
  }
]

const mockGraphData = {
  nodes: [
    { id: 'arabidopsis', label: 'Arabidopsis thaliana', type: 'organism', color: '#FFD700' },
    { id: 'humans', label: 'Homo sapiens', type: 'organism', color: '#FFD700' },
    { id: 'microbes', label: 'Microbial Communities', type: 'organism', color: '#FFD700' },
    { id: 'plant-growth', label: 'Plant Growth Study', type: 'experiment', color: '#1E90FF' },
    { id: 'bone-density', label: 'Bone Density Study', type: 'experiment', color: '#1E90FF' },
    { id: 'microbial-dynamics', label: 'Microbial Dynamics', type: 'experiment', color: '#1E90FF' },
    { id: 'radiation-effects', label: 'Radiation Biology', type: 'experiment', color: '#1E90FF' },
    { id: 'iss', label: 'International Space Station', type: 'mission', color: '#FC3D21' },
    { id: 'artemis', label: 'Artemis Program', type: 'mission', color: '#FC3D21' },
    { id: 'cell-walls', label: 'Cell Wall Changes', type: 'result', color: '#28A745' },
    { id: 'bone-loss', label: 'Bone Mineral Loss', type: 'result', color: '#28A745' },
    { id: 'microbial-shift', label: 'Community Succession', type: 'result', color: '#28A745' },
    { id: 'dna-damage', label: 'DNA Repair Deficiency', type: 'result', color: '#28A745' }
  ],
  edges: [
    { source: 'arabidopsis', target: 'plant-growth' },
    { source: 'plant-growth', target: 'cell-walls' },
    { source: 'plant-growth', target: 'iss' },
    { source: 'humans', target: 'bone-density' },
    { source: 'bone-density', target: 'bone-loss' },
    { source: 'bone-density', target: 'artemis' },
    { source: 'microbes', target: 'microbial-dynamics' },
    { source: 'microbial-dynamics', target: 'microbial-shift' },
    { source: 'humans', target: 'radiation-effects' },
    { source: 'radiation-effects', target: 'dna-damage' },
    { source: 'radiation-effects', target: 'iss' }
  ]
}

export const searchAPI = {
  search: async (query, filters = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    let results = [...mockPublications]

    // Apply text search
    if (query) {
      results = results.filter(pub =>
        pub.title.toLowerCase().includes(query.toLowerCase()) ||
        pub.abstract.toLowerCase().includes(query.toLowerCase()) ||
        pub.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      )
    }

    // Apply filters
    if (filters.organism) {
      results = results.filter(pub =>
        pub.organism.toLowerCase().includes(filters.organism.toLowerCase())
      )
    }

    if (filters.experimentType) {
      results = results.filter(pub =>
        pub.experimentType.toLowerCase().includes(filters.experimentType.toLowerCase())
      )
    }

    if (filters.mission) {
      results = results.filter(pub =>
        pub.mission.toLowerCase().includes(filters.mission.toLowerCase())
      )
    }

    if (filters.year) {
      results = results.filter(pub => pub.year.toString() === filters.year)
    }

    return results
  },

  getGraph: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockGraphData
  },

  getSummary: async (publicationId) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const publication = mockPublications.find(pub => pub.id === publicationId)
    return publication?.summary || null
  },

  getTimeline: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockPublications.map(pub => ({
      year: pub.year,
      title: pub.title,
      mission: pub.mission,
      experimentType: pub.experimentType,
      id: pub.id
    }))
  }
}

export default api
