from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/space_biology")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Publication(Base):
    __tablename__ = "publications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    authors = Column(JSON)  # List of author names
    year = Column(Integer, nullable=False, index=True)
    mission = Column(String, nullable=False, index=True)
    organism = Column(String, nullable=False, index=True)
    experiment_type = Column(String, nullable=False, index=True)
    abstract = Column(Text)
    keywords = Column(JSON)  # List of keywords
    connections = Column(JSON)  # List of connection IDs
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Summary(Base):
    __tablename__ = "summaries"
    
    id = Column(Integer, primary_key=True, index=True)
    publication_id = Column(Integer, nullable=False, index=True)
    plain_summary = Column(Text)
    technical_summary = Column(Text)
    generated_at = Column(DateTime, default=datetime.utcnow)

class GraphNode(Base):
    __tablename__ = "graph_nodes"
    
    id = Column(String, primary_key=True)
    label = Column(String, nullable=False)
    node_type = Column(String, nullable=False)  # organism, experiment, mission, result
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class GraphEdge(Base):
    __tablename__ = "graph_edges"
    
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(String, nullable=False)
    target_id = Column(String, nullable=False)
    relationship_type = Column(String)
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)
