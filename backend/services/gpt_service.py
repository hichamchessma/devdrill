import os
import logging
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
if not client.api_key:
    logger.error("OPENAI_API_KEY environment variable not set")
    raise RuntimeError("OpenAI API key not configured")

def generate_pitch_content(profile: str) -> str:
    if not profile or len(profile.strip()) < 10:
        raise ValueError("Profile must contain meaningful content")

    prompt = f"""
    Tu es un coach carrière spécialisé pour les développeurs. À partir de ce profil : "{profile}", rédige un pitch oral prêt à l'emploi pour un entretien.
    Sois clair, confiant, met en avant les compétences et évite les listes techniques.
    """
    try:
        logger.info("Generating pitch content...")
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Tu es un expert des entretiens techniques."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=250,
            timeout=10
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Failed to generate pitch: {str(e)}")
        raise Exception(f"OpenAI API error: {str(e)}")

def generate_test_content(profile: str) -> str:
    if not profile or len(profile.strip()) < 10:
        raise ValueError("Profile must contain meaningful content")

    prompt = f"""
    À partir de ce profil développeur : "{profile}", génère des questions techniques pertinentes pour un entretien.
    Inclus des questions sur les langages, frameworks et concepts mentionnés.
    """
    try:
        logger.info("Generating test content...")
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Tu es un expert en évaluation technique."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500,
            timeout=10
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Failed to generate test content: {str(e)}")
        raise Exception(f"OpenAI API error: {str(e)}")
