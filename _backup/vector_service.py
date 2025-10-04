import numpy as np
import faiss
import pickle
import os
from typing import List, Dict, Any
from transformers import AutoTokenizer, AutoModel
import torch

class VectorSearchService:
    def __init__(self, model_name: str = "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract"):
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self.index = None
        self.document_ids = []
        self.index_path = "vector_index.faiss"
        self.metadata_path = "vector_metadata.pkl"
        
    def initialize(self):
        """Initialize the model and tokenizer"""
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModel.from_pretrained(self.model_name)
            self.model.eval()
            
            # Load existing index if available
            self.load_index()
            return True
        except Exception as e:
            print(f"Failed to initialize vector search service: {e}")
            return False
    
    def encode_text(self, text: str) -> np.ndarray:
        """Encode text to vector representation"""
        try:
            inputs = self.tokenizer(text, return_tensors="pt", 
                                  max_length=512, truncation=True, padding=True)
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                embeddings = outputs.last_hidden_state.mean(dim=1)
            
            return embeddings.numpy().flatten()
        except Exception as e:
            print(f"Error encoding text: {e}")
            return np.zeros(768)  # Default BERT embedding size
    
    def build_index(self, documents: List[Dict[str, Any]]):
        """Build FAISS index from documents"""
        try:
            embeddings = []
            self.document_ids = []
            
            for doc in documents:
                # Combine title and abstract for better representation
                text = f"{doc['title']} {doc['abstract']}"
                embedding = self.encode_text(text)
                embeddings.append(embedding)
                self.document_ids.append(doc['id'])
            
            embeddings = np.array(embeddings).astype('float32')
            
            # Create FAISS index
            dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatIP(dimension)  # Inner product for similarity
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(embeddings)
            self.index.add(embeddings)
            
            # Save index and metadata
            self.save_index()
            
            print(f"Built index with {len(documents)} documents")
            return True
            
        except Exception as e:
            print(f"Error building index: {e}")
            return False
    
    def search(self, query: str, k: int = 10) -> List[Dict[str, Any]]:
        """Search for similar documents"""
        try:
            if self.index is None:
                return []
            
            # Encode query
            query_embedding = self.encode_text(query)
            query_embedding = np.array([query_embedding]).astype('float32')
            faiss.normalize_L2(query_embedding)
            
            # Search
            scores, indices = self.index.search(query_embedding, k)
            
            results = []
            for score, idx in zip(scores[0], indices[0]):
                if idx < len(self.document_ids):
                    results.append({
                        'document_id': self.document_ids[idx],
                        'similarity_score': float(score)
                    })
            
            return results
            
        except Exception as e:
            print(f"Error searching: {e}")
            return []
    
    def save_index(self):
        """Save FAISS index and metadata to disk"""
        try:
            if self.index is not None:
                faiss.write_index(self.index, self.index_path)
                
                with open(self.metadata_path, 'wb') as f:
                    pickle.dump(self.document_ids, f)
                    
        except Exception as e:
            print(f"Error saving index: {e}")
    
    def load_index(self):
        """Load FAISS index and metadata from disk"""
        try:
            if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
                self.index = faiss.read_index(self.index_path)
                
                with open(self.metadata_path, 'rb') as f:
                    self.document_ids = pickle.load(f)
                    
                print(f"Loaded index with {len(self.document_ids)} documents")
                return True
                
        except Exception as e:
            print(f"Error loading index: {e}")
            
        return False

# Initialize vector search service
vector_service = VectorSearchService()
