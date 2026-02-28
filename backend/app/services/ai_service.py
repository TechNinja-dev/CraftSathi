import os
import base64
import datetime
import google.generativeai as genai
from google.genai import types
from app.db.mongodb import user_col, images_col

def generate_caption(image_bytes, content_type):
    genai.configure(api_key=os.getenv("IMG_API_KEY"))
    model = genai.GenerativeModel("gemini-pro-vision")

    response = model.generate_content([
        {
            "mime_type": content_type,
            "data": image_bytes
        },
        "Generate a professional product description for this item."
    ])

    return response.text


def generate_image(prompt, userId=None):
    client = genai.Client(api_key=os.getenv("IMG2_API_KEY"))

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[types.Part.from_text(text=prompt)],
        config=types.GenerateContentConfig(response_modalities=["IMAGE"])
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            base64_image = base64.b64encode(part.inline_data.data).decode("utf-8")
            mime_type = part.inline_data.mime_type
            image_url = f"data:{mime_type};base64,{base64_image}"

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

    return None