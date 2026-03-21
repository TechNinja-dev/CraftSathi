# app/services/email_service.py
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_otp_email(email, otp):
    """
    Send OTP email using Gmail SMTP with App Password
    """
    try:
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = os.getenv("EMAIL_USER")
        sender_password = os.getenv("EMAIL_PASSWORD")  # This should be the 16-char App Password
        
        if not sender_email or not sender_password:
            print("Email credentials not found in environment variables")
            return False
        
        # Create message
        subject = "Your Verification Code - CraftSathi"
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
        
        msg = MIMEMultipart()
        msg["From"] = f"CraftSathi <{sender_email}>"
        msg["To"] = email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        print(f"OTP email sent successfully to {email}")
        return True
        
    except Exception as e:
        print(f"Email error: {e}")
        return False


