import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_test_content(stack: str, level: str) -> str:
    # Placeholder for GPT-4o API call
    return f"Generated test for {stack} at {level} level."

def generate_pitch_content(profile: str) -> str:
    # Placeholder for GPT-4o API call
    return f"Generated pitch for profile: {profile}."
