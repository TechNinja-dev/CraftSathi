import re
from openai import OpenAI
from dotenv import load_dotenv
import os
import base64
from app.db.mongodb import user_col,images_col,users_dash_col
import datetime
import requests
from huggingface_hub import InferenceClient
import random
load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def generate_caption(image_bytes, content_type, userId=None ):
    """
    Generate 5 different social media captions for the product image
    """
    base64_image = base64.b64encode(image_bytes).decode("utf-8")
    
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "http://localhost:3000",
                "X-OpenRouter-Title": "Social Media Caption Generator",
            },
            extra_body={},
            model="google/gemma-3-4b-it:free",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Analyze this handmade craft product image and generate 5 different social media captions. Each caption should be:
1. Short, engaging, and ready to post
2. Include relevant emojis
3. Target different angles: storytelling, educational, sales-focused, inspirational, and casual

Format each caption clearly with a number and emoji header. Keep each caption under 200 characters.

Examples of style:
- 🎨 **Caption 1:** [caption text]
- 📖 **Caption 2:** [caption text]
- 🛍️ **Caption 3:** [caption text]
- ✨ **Caption 4:** [caption text]
- 💫 **Caption 5:** [caption text]

Generate captions based on what you see in the image."""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{content_type};base64,{base64_image}"
                            }
                        }
                    ]
                }
            ]
        )
        
        raw_response = completion.choices[0].message.content
        captions = process_description(raw_response)
        
        # Increment total_captions_generated counter in users_dash
        print(userId)
        if userId:
            users_dash_col.update_one(
                {"u_Id": userId},
                {"$inc": {"total_captions_generated": 5}},  # Increment by 5 captions
                upsert=True
            )
            print("Saved captions to DB")
        
        return captions
        
    except Exception as e:
        print(e)
        return [
            f"Handcrafted artisan piece 🎨✨ #Handmade",
            f"Unique cultural treasure 🌸 #ArtisanMade",
            f"Beautiful craftsmanship 🛍️💕 #SupportLocal",
            f"Tradition meets art ✨ #FolkArt",
            f"Perfect addition to your home 🏠 #Handcrafted"
        ]

def process_description(raw_text):
    """
    Process raw API response into 5 clean social media captions
    """
    captions = []
    lines = raw_text.split('\n')
    
    for line in lines:
        line = line.strip()
        if line and any(emoji in line for emoji in ['🎨', '📖', '🛍️', '✨', '💫', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']):
            # Clean up the caption
            caption = re.sub(r'^\*\*?|\[[^\]]*\]|\([^)]*\)', '', line)
            caption = re.sub(r'^[0-9]\.\s*', '', caption)
            caption = re.sub(r'^[🎨📖🛍️✨💫1️⃣2️⃣3️⃣4️⃣5️⃣]\s*', '', caption)
            caption = caption.strip()
            caption=caption[14:]
            if caption and len(caption) > 5:
                captions.append(caption)
    
    # Fallback captions if parsing failed
    if len(captions) < 3:
        captions = [
            "Handcrafted with love and tradition 🎨✨ #Handmade #Artisan",
            "Bringing culture to life, one piece at a time 🌸 #FolkArt #Tradition",
            "Unique. Beautiful. Made for you 🛍️💕 #SupportArtisans #Craft",
            "Every piece tells a story 📖✨ #ArtisanMade #Handcrafted",
            "Add a touch of tradition to your space 🏠🎨 #HomeDecor #Culture"
        ]
    
    return captions[:5]



def generate_image(prompt, userId=None):
    """
    Enhance user prompt using AI, then fetch craft images from Pexels API
    """
    try:
        ensured=prompt_filter(prompt)
        if ensured!=True:
            return {"message":ensured}
        # Step 1: Enhance the user prompt using OpenRouter
        enhanced_prompt = enhance_prompt_with_ai(prompt)
        print(f"Original prompt: {prompt}")
        print(f"Enhanced prompt: {enhanced_prompt}")
        
        # Get Model and API key
        pollen_key = os.getenv("pollen_key")
        model=os.getenv("pollen_model")
        
        if not pollen_key:
            print("API_KEY not found in environment variables")
            return None
        
        # Searching with enhanced prompt
        encoded_query = requests.utils.quote(enhanced_prompt)
        
        response = requests.get(
            f"https://gen.pollinations.ai/image/{encoded_query}?model={model}&width=1024&height=1024&seed=0&enhance=false&key={pollen_key}",
            timeout=30
        )
        
        if response.status_code == 200:
            image_url = f"https://gen.pollinations.ai/image/{encoded_query}?model={model}&width=1024&height=1024&seed=0&enhance=false&key={pollen_key}"
            
            print(f"✅ Image generated successfully: {image_url}")
            
            if image_url:
                # Save to database if userId provided
                if userId and image_url:
                    print("Got user",userId,"image_url",image_url)
                    user_doc = user_col.find_one({"u_Id": userId})
                    print(user_doc)
                    if user_doc:
                        print("Saving to DB")
                        images_col.insert_one({
                            "user_id": user_doc["_id"],
                            "prompt": prompt,
                            "enhanced_prompt": enhanced_prompt,
                            "image_url": image_url,
                            "created_at": datetime.datetime.utcnow()
                        })
                        print("saved to DB")
                        
                        # Increment total_images_generated counter in users_dash
                        users_dash_col.update_one(
                            {"u_Id": userId},
                            {"$inc": {"total_images_generated": 1}},
                            upsert=True
                        )
                        print("Counter incremented in users_dash")
                
                return image_url
            else:
                print(f"No images found for query: {enhanced_prompt}")
                return None
        else:
            print(f"API error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Image generation error: {str(e)}")
        return None

def prompt_filter(prompt):
    nsfw=os.getenv("NSFW_KEYWORDS").split(',')
    people=os.getenv("PEOPLE_KEYWORDS").split(",")
    banned_domain=os.getenv("BANNED_DOMAINS").split(",")
    craft_keywords=os.getenv("CRAFT_KEYWORDS")
    # 🚫 Block NSFW immediately
    prompt_lower=prompt.lower()
    if any(word in prompt_lower for word in nsfw):
        return "Sorry, we cannot generate this type of content."
    
    # 🚫 Block people-related prompts (unless craft context)
    if any(word in prompt_lower for word in people):
        if not any(word in prompt_lower for word in craft_keywords):
            return "Sorry, we only support craft and handmade product related images."
        
    # 🚫 Block unrelated domains
    if any(word in prompt_lower for word in banned_domain):
        return "Sorry, please provide a craft or handmade related prompt."
    
    # 🚫 If no craft context at all → reject
    if not any(word in prompt_lower for word in craft_keywords):
        return "Sorry, this tool only supports craft and art related prompts."
    
    return True
    


def enhance_prompt_with_ai(user_prompt):
    """
    Use OpenRouter with Gemma 3B to enhance the user prompt for better Pexels search results
    """
    try:
        # Gemma 3B doesn't support system messages, so we combine everything in user message
        enhancement_prompt = f"""Convert this craft/artisan product description into a clear, natural, and visually descriptive image prompt for high-quality craft photos.

            Rules:
            - Return ONLY the final prompt, no explanations
            - Keep it concise but in full sentence form
            - Do NOT use comma-separated keywords
            - Preserve the original meaning and intent
            - Slightly enhance with relevant visual details (materials, colors, style)
            - Keep it suitable for image generation

            User description: {user_prompt}

            Enhanced prompt:"""
        
        response = client.chat.completions.create(
            model="google/gemma-3-4b-it:free",
            messages=[
                {
                    "role": "user",
                    "content": enhancement_prompt
                }
            ],
            max_tokens=50,
            temperature=0.7
        )
        
        enhanced_query = response.choices[0].message.content.strip()
        
        # Clean up the response (remove quotes, extra spaces, newlines)
        enhanced_query = enhanced_query.strip('"').strip("'").strip()
        
        # If the enhancement fails or returns empty, use original prompt
        if not enhanced_query or len(enhanced_query) < 3:
            print(f"Enhancement returned empty, using original prompt")
            enhanced_query = user_prompt
        
        return enhanced_query
        
    except Exception as e:
        print(f"Prompt enhancement error: {str(e)}")
        return user_prompt  # Fallback to original prompt