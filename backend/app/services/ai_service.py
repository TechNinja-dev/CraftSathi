import re
from openai import OpenAI
from dotenv import load_dotenv
import os
import base64


load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def generate_caption(image_bytes, content_type):
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
        return process_description(raw_response)
        
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

    response = client.chat.completions.create(
        model="stabilityai/stable-diffusion-xl",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    image_base64 = response.choices[0].message.content

    image_url = f"data:image/png;base64,{image_base64}"

    if userId:
        user_doc = user_col.find_one({"u_Id": userId})
        if user_doc:
            images_col.insert_one({
                "user_id": user_doc["_id"],
                "prompt": prompt,
                "image_url": image_url,
                "created_at": datetime.datetime.utcnow()
            })

    return image_url


# import requests

# HF_API = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
# HF_TOKEN = os.getenv("HF_TOKEN")

# def generate_image(prompt, userId=None):

#     headers = {"Authorization": f"Bearer {HF_TOKEN}"}

#     response = requests.post(
#         HF_API,
#         headers=headers,
#         json={"inputs": prompt}
#     )

#     image_bytes = response.content
#     base64_image = base64.b64encode(image_bytes).decode("utf-8")

#     image_url = f"data:image/png;base64,{base64_image}"

#     return image_url