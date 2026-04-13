# app/services/email_service.py
import os
import requests

# ─────────────────────────────────────────────────────────────────────────────
# ACTIVE: EmailJS HTTP API (Works flawlessly on Render Free Tier)
# ─────────────────────────────────────────────────────────────────────────────

def send_otp_email(email: str, otp: str) -> bool:
    """
    Send OTP email using EmailJS REST API.
    """
    try:
        service_id = os.getenv("EMAILJS_SERVICE_ID")
        template_id = os.getenv("EMAILJS_TEMPLATE_ID")
        public_key = os.getenv("EMAILJS_PUBLIC_KEY")

        if not all([service_id, template_id, public_key]):
            print("EmailJS credentials missing in environment variables")
            return False

        # EmailJS REST API Payload
        payload = {
            "service_id": service_id,
            "template_id": template_id,
            "user_id": public_key,
            "template_params": {
                "email": email,      # Maps to {{email}} in "To Email" field
                "passcode": otp      # Maps to {{passcode}} in email Content body
            }
        }

        # Send request to EmailJS API natively bypassing SMTP blocks
        response = requests.post(
            "https://api.emailjs.com/api/v1.0/email/send",
            json=payload,
            headers={"Content-Type": "application/json"},
        )

        # EmailJS returns 200 OK on success
        if response.status_code == 200:
            print(f"OTP email sent successfully to {email} via EmailJS")
            return True
        else:
            print(f"Email error: {response.status_code} - {response.text}")
            return False

    except Exception as e:
        print(f"Email error: {e}")
        return False

# ─────────────────────────────────────────────────────────────────────────────
# LEARNING REFERENCE: Original Gmail SMTP implementation
# This works perfectly on localhost but Render free tier blocks SMTP ports.
# To use this locally: set EMAIL_USER and EMAIL_PASSWORD in your .env file.
# EMAIL_PASSWORD must be a Gmail App Password (not your regular Gmail password).
# How to get App Password: Google Account → Security → 2FA → App Passwords
# ─────────────────────────────────────────────────────────────────────────────

# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
#
# def send_otp_email(email, otp):
#     try:
#         smtp_server = "smtp.gmail.com"
#         smtp_port = 587                        # TLS port
#         sender_email = os.getenv("EMAIL_USER")
#         sender_password = os.getenv("EMAIL_PASSWORD")  # 16-char App Password
#
#         if not sender_email or not sender_password:
#             print("Email credentials not found in environment variables")
#             return False
#
#         subject = "Your Verification Code - CraftSathi"
#         body = f"""
#         <div style="font-family: Arial, sans-serif; max-width: 500px; ...">
#             <h2>CraftSathi</h2>
#             <div style="font-size: 32px; letter-spacing: 5px;">{otp}</div>
#             <p>This code expires in 5 minutes.</p>
#         </div>
#         """
#
#         msg = MIMEMultipart()
#         msg["From"] = f"CraftSathi <{sender_email}>"
#         msg["To"] = email
#         msg["Subject"] = subject
#         msg.attach(MIMEText(body, "html"))
#
#         # starttls() upgrades the plain connection to an encrypted TLS one
#         with smtplib.SMTP(smtp_server, smtp_port) as server:
#             server.starttls()
#             server.login(sender_email, sender_password)
#             server.send_message(msg)
#
#         print(f"OTP email sent successfully to {email}")
#         return True
#
#     except Exception as e:
#         print(f"Email error: {e}")
#         return False
