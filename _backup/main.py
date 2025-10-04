from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NASA Space Biology Knowledge Engine API",
    description="API for space biology research data and AI-powered insights",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class Publication(BaseModel):
    id: int
    title: str
    authors: List[str]
    year: int
    mission: str
    organism: str
    experimentType: str
    abstract: str
    keywords: List[str]
    connections: List[str]

class Summary(BaseModel):
    plain: str
    technical: str

class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    color: str

class GraphEdge(BaseModel):
    source: str
    target: str

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class SearchFilters(BaseModel):
    organism: Optional[str] = None
    experimentType: Optional[str] = None
    mission: Optional[str] = None
    year: Optional[str] = None

class TimelineItem(BaseModel):
    year: int
    title: str
    mission: str
    experimentType: str
    id: int

# Mock data (in production, this would come from databases)
mock_publications = [
    {
        "id": 1,
        "title": "Effects of Microgravity on Plant Cell Walls and Growth Patterns",
        "authors": ["Dr. Sarah Johnson", "Dr. Mike Chen", "Dr. Lisa Rodriguez"],
        "year": 2023,
        "mission": "ISS Expedition 68",
        "organism": "Arabidopsis thaliana",
        "experimentType": "Botanical Research",
        "abstract": "This study investigates how microgravity conditions aboard the International Space Station affect plant cell wall composition and growth patterns in Arabidopsis thaliana. Results show significant changes in cellulose organization and altered gravitropic responses.",
        "keywords": ["microgravity", "plant biology", "cell walls", "ISS", "space agriculture"],
        "connections": ["cell-wall-proteins", "gravitropism", "space-farming"]
    },
    {
        "id": 2,
        "title": "Bone Density Changes in Astronauts During Long-Duration Spaceflight",
        "authors": ["Dr. Robert Kim", "Dr. Emma Thompson", "Dr. James Wilson"],
        "year": 2022,
        "mission": "Artemis Analog",
        "organism": "Homo sapiens",
        "experimentType": "Human Physiology",
        "abstract": "Comprehensive analysis of bone mineral density changes in astronauts during 6-month missions, with implications for Mars exploration preparedness.",
        "keywords": ["bone density", "astronauts", "long-duration flight", "osteoporosis", "countermeasures"],
        "connections": ["calcium-metabolism", "exercise-protocols", "mars-mission-prep"]
    },
    {
        "id": 3,
        "title": "Microbial Community Dynamics in Closed-Loop Life Support Systems",
        "authors": ["Dr. Ana Martinez", "Dr. Kevin Park", "Dr. Rachel Green"],
        "year": 2023,
        "mission": "ECLSS Testing",
        "organism": "Mixed microbial communities",
        "experimentType": "Astrobiology",
        "abstract": "Investigation of microbial ecosystem stability and succession patterns in spacecraft environmental control systems over extended periods.",
        "keywords": ["microbiome", "life support", "biofilms", "spacecraft hygiene", "closed ecosystems"],
        "connections": ["water-recycling", "air-purification", "crew-health"]
    },
    {
        "id": 4,
        "title": "Radiation Effects on DNA Repair Mechanisms in Human Cells",
        "authors": ["Dr. Maria Santos", "Dr. David Lee", "Dr. Jennifer Adams"],
        "year": 2021,
        "mission": "ISS National Lab",
        "organism": "Human cell cultures",
        "experimentType": "Radiation Biology",
        "abstract": "Analysis of DNA damage and repair pathway efficiency in human cells exposed to space radiation environment.",
        "keywords": ["radiation", "DNA repair", "space environment", "cellular response", "cancer risk"],
        "connections": ["radiation-shielding", "pharmaceutical-countermeasures", "crew-health-monitoring"]
    }
]

mock_summaries = {
    1: {
        "plain": "Scientists studied how plants grow differently in space without gravity. They found that plant cell walls become weaker and plants grow in unusual directions, which could affect future space farming efforts.",
        "technical": "Microgravity exposure resulted in 40% reduction in cellulose crystallinity, altered pectin methylesterification patterns, and dysregulated auxin transport mechanisms affecting gravitropic responses in Arabidopsis seedlings."
    },
    2: {
        "plain": "Astronauts lose bone strength during long space missions, similar to osteoporosis on Earth. This research helps develop exercise programs to keep astronauts healthy for future trips to Mars.",
        "technical": "Astronauts experienced 1.5% monthly bone mineral density loss in weight-bearing bones, with trabecular bone showing greater susceptibility than cortical bone. ARED exercise protocols mitigated 60% of expected bone loss."
    },
    3: {
        "plain": "Researchers studied bacteria and other microbes that grow in spacecraft air and water systems. Understanding these tiny organisms helps keep astronauts healthy and life support systems working properly.",
        "technical": "Microbial diversity decreased 35% over 180 days in closed systems, with Proteobacteria and Firmicutes dominating. Biofilm formation on surfaces increased antimicrobial resistance by 3-fold, requiring enhanced cleaning protocols."
    },
    4: {
        "plain": "Space radiation damages astronaut DNA more than radiation on Earth. Scientists are studying how cells fix this damage to develop better protection for long space missions.",
        "technical": "Galactic cosmic radiation exposure resulted in 3.2-fold increase in double-strand breaks and 40% reduction in homologous recombination repair efficiency. p53 pathway activation was sustained for 72 hours post-exposure."
    }
}

mock_graph_data = {
    "nodes": [
        {"id": "arabidopsis", "label": "Arabidopsis thaliana", "type": "organism", "color": "#FFD700"},
        {"id": "humans", "label": "Homo sapiens", "type": "organism", "color": "#FFD700"},
        {"id": "microbes", "label": "Microbial Communities", "type": "organism", "color": "#FFD700"},
        {"id": "plant-growth", "label": "Plant Growth Study", "type": "experiment", "color": "#1E90FF"},
        {"id": "bone-density", "label": "Bone Density Study", "type": "experiment", "color": "#1E90FF"},
        {"id": "microbial-dynamics", "label": "Microbial Dynamics", "type": "experiment", "color": "#1E90FF"},
        {"id": "radiation-effects", "label": "Radiation Biology", "type": "experiment", "color": "#1E90FF"},
        {"id": "iss", "label": "International Space Station", "type": "mission", "color": "#FC3D21"},
        {"id": "artemis", "label": "Artemis Program", "type": "mission", "color": "#FC3D21"},
        {"id": "cell-walls", "label": "Cell Wall Changes", "type": "result", "color": "#28A745"},
        {"id": "bone-loss", "label": "Bone Mineral Loss", "type": "result", "color": "#28A745"},
        {"id": "microbial-shift", "label": "Community Succession", "type": "result", "color": "#28A745"},
        {"id": "dna-damage", "label": "DNA Repair Deficiency", "type": "result", "color": "#28A745"}
    ],
    "edges": [
        {"source": "arabidopsis", "target": "plant-growth"},
        {"source": "plant-growth", "target": "cell-walls"},
        {"source": "plant-growth", "target": "iss"},
        {"source": "humans", "target": "bone-density"},
        {"source": "bone-density", "target": "bone-loss"},
        {"source": "bone-density", "target": "artemis"},
        {"source": "microbes", "target": "microbial-dynamics"},
        {"source": "microbial-dynamics", "target": "microbial-shift"},
        {"source": "humans", "target": "radiation-effects"},
        {"source": "radiation-effects", "target": "dna-damage"},
        {"source": "radiation-effects", "target": "iss"}
    ]
}

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "NASA Space Biology Knowledge Engine API",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/search", response_model=List[Publication])
async def search_publications(
    query: Optional[str] = Query(None, description="Search query"),
    organism: Optional[str] = Query(None, description="Filter by organism"),
    experimentType: Optional[str] = Query(None, description="Filter by experiment type"),
    mission: Optional[str] = Query(None, description="Filter by mission"),
    year: Optional[str] = Query(None, description="Filter by year")
):
    """
    Search publications with optional filters
    """
    try:
        logger.info(f"Search request: query={query}, filters={organism, experimentType, mission, year}")
        
        results = mock_publications.copy()
        
        # Apply text search
        if query:
            query_lower = query.lower()
            results = [
                pub for pub in results
                if (query_lower in pub["title"].lower() or
                    query_lower in pub["abstract"].lower() or
                    any(query_lower in keyword.lower() for keyword in pub["keywords"]))
            ]
        
        # Apply filters
        if organism:
            results = [pub for pub in results if organism.lower() in pub["organism"].lower()]
        
        if experimentType:
            results = [pub for pub in results if experimentType.lower() in pub["experimentType"].lower()]
        
        if mission:
            results = [pub for pub in results if mission.lower() in pub["mission"].lower()]
        
        if year:
            results = [pub for pub in results if str(pub["year"]) == year]
        
        logger.info(f"Search completed: {len(results)} results found")
        return results
        
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during search")

@app.get("/api/graph", response_model=GraphData)
async def get_knowledge_graph(
    organism: Optional[str] = Query(None),
    experimentType: Optional[str] = Query(None),
    mission: Optional[str] = Query(None),
    year: Optional[str] = Query(None)
):
    """
    Get knowledge graph data with optional filters
    """
    try:
        logger.info("Knowledge graph request received")
        
        # In production, this would filter the graph based on the parameters
        # For now, return the mock data
        
        return mock_graph_data
        
    except Exception as e:
        logger.error(f"Graph error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching graph")

@app.get("/api/summary/{publication_id}", response_model=Summary)
async def get_summary(publication_id: int):
    """
    Get AI-generated summary for a specific publication
    """
    try:
        logger.info(f"Summary request for publication {publication_id}")
        
        if publication_id not in mock_summaries:
            raise HTTPException(status_code=404, detail="Publication not found")
        
        summary = mock_summaries[publication_id]
        return summary
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Summary error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while generating summary")

@app.get("/api/timeline", response_model=List[TimelineItem])
async def get_timeline():
    """
    Get timeline data for experiments
    """
    try:
        logger.info("Timeline request received")
        
        timeline_data = [
            {
                "year": pub["year"],
                "title": pub["title"],
                "mission": pub["mission"],
                "experimentType": pub["experimentType"],
                "id": pub["id"]
            }
            for pub in mock_publications
        ]
        
        return sorted(timeline_data, key=lambda x: x["year"])
        
    except Exception as e:
        logger.error(f"Timeline error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching timeline")

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "api": "operational",
            "database": "operational",  # Would check actual DB in production
            "vector_db": "operational"  # Would check FAISS in production
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
