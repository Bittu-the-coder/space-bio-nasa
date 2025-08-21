# NASA Space Biology Knowledge Engine

A futuristic dashboard for exploring space biology research with AI-powered insights, knowledge graphs, and interactive visualizations.

## 🚀 Features

- **Interactive Knowledge Graph**: Visualize connections between organisms, experiments, missions, and results
- **Timeline Visualization**: Explore experiments across years and missions with D3.js charts
- **AI-Powered Summaries**: Generate plain-language and technical summaries of research papers
- **Advanced Search**: Filter by organism, experiment type, mission, and year
- **NASA-Style UI**: Professional, clean design inspired by NASA's official website
- **Real-time Updates**: Live data synchronization and smooth animations

## 🛠 Technology Stack

### Frontend

- **React 18** with modern hooks and functional components
- **Tailwind CSS** with custom NASA-themed configuration
- **Framer Motion** for smooth animations and transitions
- **Cytoscape.js** for interactive graph visualization
- **D3.js** for timeline charts and data visualization
- **Vite** for fast development and building

### Backend

- **FastAPI** for high-performance API endpoints
- **PostgreSQL** for metadata and structured data
- **Neo4j** for knowledge graph storage
- **FAISS** for vector similarity search
- **HuggingFace Transformers** with BioBERT/SciBERT for AI summarization

## 📦 Installation

### Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL 13+
- Neo4j 5.0+

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
venv\\Scripts\\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
copy .env.example .env
# Edit .env with your configuration

# Start the API server
python main.py
```

## 🚦 Quick Start

1. **Start the backend server**:

   ```bash
   cd backend
   python main.py
   ```

2. **Start the frontend development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

## 🎨 Design System

The application uses a custom design system based on NASA's visual identity:

- **Colors**: NASA blue (#0B3D91), NASA red (#FC3D21), space gold (#FFD700)
- **Typography**: Orbitron for headings, Roboto for body text
- **Components**: Rounded cards, glass effects, smooth animations
- **Layout**: Grid-based, mobile-responsive design

## 📊 Features Overview

### Knowledge Graph

- Interactive node-link visualization
- Filter by node types (organisms, experiments, missions, results)
- Click nodes to view detailed information
- Dynamic layout with force-directed positioning

### Timeline View

- Stacked bar charts showing experiments by year
- Color-coded by experiment type
- Interactive selection and filtering
- Smooth transitions and hover effects

### AI Summaries

- **Plain Language**: Easy-to-understand summaries for general audiences
- **Technical**: Preserves scientific terminology and key findings
- **Space Relevance**: Highlights connections to human space exploration

### Search & Filtering

- Full-text search across titles, abstracts, and keywords
- Multi-dimensional filtering by organism, experiment type, mission, year
- Real-time results with smooth animations
- Export functionality for selected results

## 🔧 Configuration

### Tailwind Configuration

The design system is configured in `tailwind.config.js` using the theme from `style.json`:

```javascript
// Custom colors, fonts, spacing, and animations
// Based on NASA brand guidelines
```

### API Configuration

Backend endpoints in `backend/main.py`:

- `GET /api/search` - Search publications with filters
- `GET /api/graph` - Get knowledge graph data
- `GET /api/summary/{id}` - Get AI-generated summaries
- `GET /api/timeline` - Get timeline data

## 📱 Responsive Design

The dashboard is fully responsive with:

- Mobile-first approach
- Adaptive layouts for tablets and desktops
- Touch-friendly interactions
- Optimized performance on all devices

## 🤖 AI Features

### Summarization Models

- **BioBERT**: For biomedical text understanding
- **SciBERT**: For scientific literature processing
- **BART**: For general language summarization

### Vector Search

- **FAISS**: Fast similarity search
- **Sentence embeddings**: Semantic search capabilities
- **Real-time indexing**: Auto-update search index

## 🚀 Deployment

### Production Build

```bash
# Frontend
npm run build

# Backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker Deployment

```bash
# Build and run containers
docker-compose up -d
```

## 📄 License

MIT License - Built for educational and research purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🎯 Future Enhancements

- [ ] Real NASA data integration
- [ ] Advanced ML models for research recommendations
- [ ] Collaborative features for researchers
- [ ] 3D visualization modes
- [ ] Voice-controlled navigation
- [ ] Integration with NASA APIs

---

**Built with ❤️ for space biology research and exploration**
