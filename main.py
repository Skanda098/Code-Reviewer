from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
from deep_translator import GoogleTranslator

app = FastAPI()

# CORS Fix (Keep this exact setup!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeInput(BaseModel):
    language: str
    code: str

# --- THE CORE ENGINE ---
def translate_java_comments(code: str) -> str:
    # Initialize the translator to auto-detect language and output English
    translator = GoogleTranslator(source='auto', target='en')

    def replacer(match):
        comment = match.group(0)
        
        # Handle Single-Line Comments (//)
        if comment.startswith('//'):
            text = comment[2:] # Strip the '//'
            if text.strip():   # Only translate if it's not empty space
                translated = translator.translate(text)
                return f"// {translated}"
            return comment
            
        # Handle Multi-Line Comments (/* */)
        elif comment.startswith('/*'):
            text = comment[2:-2] # Strip the '/*' and '*/'
            if text.strip():
                translated = translator.translate(text)
                return f"/* {translated} */"
            return comment
            
        return comment

    # Regex magic: Matches // to end of line OR /* to */ across multiple lines
    pattern = r'(//.*?$|/\*.*?\*/)'
    regex = re.compile(pattern, re.MULTILINE | re.DOTALL)
    
    # This runs the 'replacer' function on every comment it finds
    translated_code = regex.sub(replacer, code)
    return translated_code

# --- THE API ENDPOINT ---
@app.post("/analyze")
async def analyze_code(input: CodeInput):
    try:
        # Run the core engine on the incoming code
        new_code = translate_java_comments(input.code)
        
        # Send the final code back to the frontend
        return {
            "status": "success", 
            "original_code": input.code,
            "translated_code": new_code
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}