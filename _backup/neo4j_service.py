from neo4j import GraphDatabase
import os
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class Neo4jService:
    def __init__(self):
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD", "password")
        self.driver = None
    
    def connect(self):
        try:
            self.driver = GraphDatabase.driver(
                self.uri, 
                auth=(self.user, self.password)
            )
            return True
        except Exception as e:
            print(f"Failed to connect to Neo4j: {e}")
            return False
    
    def close(self):
        if self.driver:
            self.driver.close()
    
    def create_organism_node(self, organism_id: str, name: str, metadata: Dict[str, Any] = None):
        with self.driver.session() as session:
            query = """
            CREATE (o:Organism {id: $organism_id, name: $name, metadata: $metadata})
            RETURN o
            """
            result = session.run(query, organism_id=organism_id, name=name, metadata=metadata or {})
            return result.single()
    
    def create_experiment_node(self, experiment_id: str, title: str, experiment_type: str, metadata: Dict[str, Any] = None):
        with self.driver.session() as session:
            query = """
            CREATE (e:Experiment {id: $experiment_id, title: $title, type: $experiment_type, metadata: $metadata})
            RETURN e
            """
            result = session.run(query, 
                               experiment_id=experiment_id, 
                               title=title, 
                               experiment_type=experiment_type, 
                               metadata=metadata or {})
            return result.single()
    
    def create_mission_node(self, mission_id: str, name: str, metadata: Dict[str, Any] = None):
        with self.driver.session() as session:
            query = """
            CREATE (m:Mission {id: $mission_id, name: $name, metadata: $metadata})
            RETURN m
            """
            result = session.run(query, mission_id=mission_id, name=name, metadata=metadata or {})
            return result.single()
    
    def create_relationship(self, from_id: str, to_id: str, relationship_type: str):
        with self.driver.session() as session:
            query = f"""
            MATCH (a {{id: $from_id}}), (b {{id: $to_id}})
            CREATE (a)-[r:{relationship_type}]->(b)
            RETURN r
            """
            result = session.run(query, from_id=from_id, to_id=to_id)
            return result.single()
    
    def get_graph_data(self, filters: Dict[str, Any] = None) -> Dict[str, List]:
        with self.driver.session() as session:
            # Get all nodes
            node_query = """
            MATCH (n)
            RETURN n.id as id, n.name as name, n.title as title, 
                   labels(n)[0] as type, n.metadata as metadata
            """
            nodes_result = session.run(node_query)
            
            nodes = []
            for record in nodes_result:
                node = {
                    "id": record["id"],
                    "label": record["name"] or record["title"] or record["id"],
                    "type": record["type"].lower(),
                    "metadata": record["metadata"] or {}
                }
                nodes.append(node)
            
            # Get all relationships
            edge_query = """
            MATCH (a)-[r]->(b)
            RETURN a.id as source, b.id as target, type(r) as relationship
            """
            edges_result = session.run(edge_query)
            
            edges = []
            for record in edges_result:
                edge = {
                    "source": record["source"],
                    "target": record["target"],
                    "relationship": record["relationship"]
                }
                edges.append(edge)
            
            return {"nodes": nodes, "edges": edges}

# Initialize Neo4j service
neo4j_service = Neo4jService()
