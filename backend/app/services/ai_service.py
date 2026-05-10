import re
import requests
from dotenv import load_dotenv
import os
import base64
from app.db.mongodb import user_col,images_col,users_dash_col,videos_col
import datetime
import requests
import random
load_dotenv()

# Unified Pollinations API for Text and Vision
POLLEN_TEXT_URL = "https://gen.pollinations.ai/v1/chat/completions"

def generate_caption(image_bytes, content_type, userId=None ):
    """
    Generate 5 different social media captions for the product image
    """
    base64_image = base64.b64encode(image_bytes).decode("utf-8")
    
    try:
        headers = {
            "Authorization": f"Bearer {os.getenv('pollen_caption')}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "mistral-large",
            "messages": [
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
        }
        
        response = requests.post(POLLEN_TEXT_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        raw_response = data["choices"][0]["message"]["content"]
        captions = process_description(raw_response)
        
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
            caption=caption[19:]
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
            # Convert downloaded image to Base64 Data URI and store in image_url variable
            image_url = f"data:image/jpeg;base64,{base64.b64encode(response.content).decode('utf-8')}"
            
            print("✅ Image generated successfully and converted to Base64")
            
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
        
        headers = {
            "Authorization": f"Bearer {os.getenv('pollen_caption')}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "openai",
            "messages": [
                {
                    "role": "user",
                    "content": enhancement_prompt
                }
            ],
            "max_tokens": 50,
            "temperature": 0.7
        }
        
        response = requests.post(POLLEN_TEXT_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        enhanced_query = data["choices"][0]["message"]["content"].strip()
        
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

def enhance_video_prompt(user_prompt):
    """
    Use OpenRouter with Gemma 3B to enhance the user prompt for better Pexels search results
    """
    try:
        enhancement_prompt = f"""Convert this craft/artisan product description into a clear, natural, and visually descriptive search query for high-quality stock videos on Pexels.

            Rules:
            - Return ONLY the final search query, no explanations
            - Keep it concise, 2-5 keywords maximum
            - Focus on visually prominent subjects (e.g., 'pottery making', 'painting canvas', 'wood carving in workshop')
            - Do NOT use sentences

            User description: {user_prompt}

            Search query:"""
        
        headers = {
            "Authorization": f"Bearer {os.getenv('pollen_caption')}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "openai",
            "messages": [
                {
                    "role": "user",
                    "content": enhancement_prompt
                }
            ],
            "max_tokens": 20,
            "temperature": 0.7
        }
        
        response = requests.post(POLLEN_TEXT_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        enhanced_query = data["choices"][0]["message"]["content"].strip()
        enhanced_query = enhanced_query.strip('"').strip("'").strip()
        
        if not enhanced_query or len(enhanced_query) < 2:
            print(f"Enhancement returned empty, using original prompt")
            enhanced_query = user_prompt
        
        return enhanced_query
        
    except Exception as e:
        print(f"Video prompt enhancement error: {str(e)}")
        return user_prompt

def generate_video(prompt, userId=None):
    """
    Enhance user prompt using AI, then generate a video advertisement from Pexels API.
    """
    try:
        ensured = prompt_filter(prompt)
        if ensured != True:
            return {"message": ensured}
            
        enhanced_prompt = enhance_video_prompt(prompt)
        print(f"Original video prompt: {prompt}")
        print(f"Enhanced video prompt: {enhanced_prompt}")
        
        video_key = os.getenv("video_key")
        if not video_key:
            print("video_key not found in environment variables")
            return None
            
        encoded_query = requests.utils.quote(enhanced_prompt)
        url = f"https://api.pexels.com/videos/search?query={encoded_query}&per_page=1"
        
        headers = {
            "Authorization": video_key
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("videos") and len(data["videos"]) > 0:
                video_files = data["videos"][0].get("video_files", [])
                if video_files:
                    # Select the first available video file Link
                    video_url = video_files[0]["link"]
                    print(f"✅ Video generated successfully: {video_url}")
                    
                    if video_url and userId:
                        print("Got user", userId, "video_url", video_url)
                        user_doc = user_col.find_one({"u_Id": userId})
                        if user_doc:
                            print("Saving Video to DB")
                            videos_col.insert_one({
                                "user_id": user_doc["_id"],
                                "prompt": prompt,
                                "enhanced_prompt": enhanced_prompt,
                                "video_url": video_url,
                                "created_at": datetime.datetime.utcnow()
                            })
                            print("Saved Video to DB")
                            
                            users_dash_col.update_one(
                                {"u_Id": userId},
                                {"$inc": {"total_videos_generated": 1}},
                                upsert=True
                            )
                            print("Video counter incremented in users_dash")
                    
                    return video_url
            print(f"No videos found for query: {enhanced_prompt}")
            return None
        else:
            print(f"API error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Video generation error: {str(e)}")
        return None