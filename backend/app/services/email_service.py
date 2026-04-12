# app/services/email_service.py
import os
import requests

# ─────────────────────────────────────────────────────────────────────────────
# ACTIVE: Resend HTTP API (works on Render free tier)
# Render blocks outbound SMTP (ports 25, 465, 587), so we use HTTP instead.
# Sign up at resend.com → get API key → add RESEND_API_KEY to Render env vars.
# ─────────────────────────────────────────────────────────────────────────────

def send_otp_email(email: str, otp: str) -> bool:
    """
    Send OTP email using Resend HTTP API (works on Render free tier).
    """
    try:
        api_key = os.getenv("RESEND_API_KEY")
        sender_email = os.getenv("EMAIL_USER", "onboarding@resend.dev")

        if not api_key:
            print("RESEND_API_KEY not found in environment variables")
            return False

        body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #4F46E5; text-align: center;">CraftSathi</h2>
            <h3 style="color: #333; text-align: center;">Your Verification Code</h3>
            <p style="color: #666; text-align: center;">Use the code below to verify your email:</p>
            <div style="font-size: 32px; font-weight: bold; color: #4F46E5; padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center; letter-spacing: 5px;">
                {otp}
            </div>
            <p style="color: #666; text-align: center; margin-top: 20px;">This code will expire in <strong>5 minutes</strong>.</p>
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #999; font-size: 10px; text-align: center;">CraftSathi - Your Craft, Powered by AI</p>
        </div>
        """

        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": f"CraftSathi <{sender_email}>",
                "to": [email],
                "subject": "Your Verification Code - CraftSathi",
                "html": body,
            },
        )

        if response.status_code in (200, 201):
            print(f"OTP email sent successfully to {email}")
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
