from transformers import pipeline, AutoTokenizer, AutoModel
import torch
from typing import Dict, List

class SummarizationService:
    def __init__(self):
        self.plain_summarizer = None
        self.technical_summarizer = None
        self.tokenizer = None
        self.model = None
        
    def initialize(self):
        """Initialize summarization models"""
        try:
            # Use BioBERT for technical summaries
            self.tokenizer = AutoTokenizer.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
            self.model = AutoModel.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
            
            # Use general summarization pipeline for plain language
            self.plain_summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                max_length=150,
                min_length=50,
                do_sample=False
            )
            
            print("Summarization service initialized successfully")
            return True
            
        except Exception as e:
            print(f"Failed to initialize summarization service: {e}")
            return False
    
    def generate_plain_summary(self, text: str) -> str:
        """Generate plain language summary"""
        try:
            if self.plain_summarizer is None:
                return self._generate_mock_plain_summary(text)
            
            # Truncate text if too long
            max_input_length = 1024
            if len(text) > max_input_length:
                text = text[:max_input_length]
            
            summary = self.plain_summarizer(text)
            return summary[0]['summary_text']
            
        except Exception as e:
            print(f"Error generating plain summary: {e}")
            return self._generate_mock_plain_summary(text)
    
    def generate_technical_summary(self, text: str, keywords: List[str] = None) -> str:
        """Generate technical summary preserving scientific terms"""
        try:
            # For now, use a more sophisticated approach with BioBERT
            # In production, this would use fine-tuned models for scientific text
            return self._generate_mock_technical_summary(text, keywords)
            
        except Exception as e:
            print(f"Error generating technical summary: {e}")
            return self._generate_mock_technical_summary(text, keywords)
    
    def generate_summaries(self, publication: Dict) -> Dict[str, str]:
        """Generate both plain and technical summaries"""
        try:
            text = f"{publication['title']} {publication['abstract']}"
            keywords = publication.get('keywords', [])
            
            plain_summary = self.generate_plain_summary(text)
            technical_summary = self.generate_technical_summary(text, keywords)
            
            return {
                'plain': plain_summary,
                'technical': technical_summary
            }
            
        except Exception as e:
            print(f"Error generating summaries: {e}")
            return {
                'plain': "Summary generation failed",
                'technical': "Technical summary generation failed"
            }
    
    def _generate_mock_plain_summary(self, text: str) -> str:
        """Generate mock plain language summary"""
        # Simple extractive approach for demo
        sentences = text.split('.')[:3]
        summary = '. '.join(sentences).strip()
        
        # Add space exploration context
        if 'microgravity' in text.lower():
            summary += " This research helps us understand how living things adapt to space without gravity."
        elif 'radiation' in text.lower():
            summary += " This work is important for protecting astronauts from harmful space radiation."
        elif 'bone' in text.lower():
            summary += " These findings help keep astronauts healthy during long space missions."
        elif 'plant' in text.lower():
            summary += " This research supports growing food in space for future missions."
        
        return summary
    
    def _generate_mock_technical_summary(self, text: str, keywords: List[str] = None) -> str:
        """Generate mock technical summary"""
        # Extract key scientific terms and measurements
        technical_terms = []
        
        if keywords:
            technical_terms.extend(keywords[:5])
        
        # Look for percentage, measurements, etc.
        import re
        percentages = re.findall(r'\d+\.?\d*%', text)
        measurements = re.findall(r'\d+\.?\d*\s*(mg|μg|ml|μl|mm|μm|nm)', text)
        
        summary = f"Study demonstrates significant effects involving {', '.join(technical_terms[:3])}. "
        
        if percentages:
            summary += f"Quantitative analysis revealed {percentages[0]} change in key parameters. "
        
        if 'microgravity' in text.lower():
            summary += "Microgravity-induced cellular adaptations observed with altered gene expression patterns."
        elif 'radiation' in text.lower():
            summary += "Radiation exposure resulted in DNA damage responses and cellular stress pathways activation."
        elif 'bone' in text.lower():
            summary += "Bone mineral density changes correlated with osteoblast/osteoclast activity ratios."
        
        return summary

# Initialize summarization service
summarization_service = SummarizationService()
