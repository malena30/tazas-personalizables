import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# Configuración de Email (SMTP por defecto para máxima compatibilidad)
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "hola@tazas.shop")

def send_email(to_email, subject, html_content):
    """
    Envía un correo electrónico en formato HTML.
    Si no hay credenciales configuradas, solo imprime en consola (modo desarrollo).
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        print("\n" + "="*50)
        print(f"SIMULACIÓN DE EMAIL (Desarrollo)")
        print(f"Para: {to_email}")
        print(f"Asunto: {subject}")
        print("-" * 20)
        print("Contenido HTML (Resumen):")
        print(html_content[:200] + "...")
        print("="*50 + "\n")
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_FROM
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(html_content, 'html'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error al enviar email: {e}")
        return False

def get_welcome_template(username):
    return f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb;">¡Bienvenido a Tazas.shop, {username}!</h2>
        <p>Estamos encantados de tenerte con nosotros. Ahora puedes empezar a diseñar tus propias tazas personalizadas.</p>
        <div style="margin: 30px 0;">
            <a href="http://localhost:3000/customizer" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Comenzar a Diseñar</a>
        </div>
        <p style="color: #666; font-size: 14px;">Si tienes alguna duda, responde a este correo.</p>
    </div>
    """

def get_order_confirmation_template(order_id, total_amount):
    return f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb;">Confirmación de Pedido</h2>
        <p>Hemos recibido tu pedido <strong>#{order_id[:8]}</strong> correctamente.</p>
        <p>Total a pagar: <strong>${total_amount:,.2f}</strong></p>
        <p>En cuanto el pago sea aprobado, comenzaremos con la producción de tu taza.</p>
        <div style="margin: 30px 0; padding: 15px; bg-color: #f9fafb; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #666;">Puedes seguir el estado de tu pedido en tu perfil.</p>
        </div>
    </div>
    """

def get_payment_success_template(order_id):
    return f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #10b981;">¡Pago Aprobado! 🎉</h2>
        <p>Tu pago para el pedido <strong>#{order_id[:8]}</strong> ha sido confirmado.</p>
        <p>¡Buenas noticias! Ya estamos preparando tu pedido para que llegue lo antes posible.</p>
        <p>Te notificaremos cuando el paquete esté en camino.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="text-align: center; color: #999; font-size: 12px;">Gracias por confiar en Tazas.shop</p>
    </div>
    """
