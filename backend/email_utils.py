import os
import smtplib
import resend
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# Configuraci├│n de Email
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "onboarding@resend.dev") # Default Resend domain

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

def send_email(to_email, subject, html_content):
    """
    Env├¡a un correo electr├│nico en formato HTML.
    Prioriza Resend si hay una API Key, de lo contrario usa SMTP.
    Si no hay credenciales, solo simula el env├¡o.
    """
    print(f"­ƒôº Intentando enviar email a: {to_email}")
    print(f"   Asunto: {subject}")
    print(f"   RESEND_API_KEY configurada: {'S├¡' if RESEND_API_KEY else 'No'}")
    print(f"   EMAIL_FROM: {EMAIL_FROM}")
    
    # 1. Intentar con Resend (Recomendado para producci├│n)
    if RESEND_API_KEY:
        try:
            result = resend.Emails.send({
                "from": EMAIL_FROM,
                "to": to_email,
                "subject": subject,
                "html": html_content
            })
            print(f"   Ô£à Email enviado con Resend! Result: {result}")
            return True
        except Exception as e:
            print(f"   ÔØî Error con Resend: {e}")
            # Si falla Resend, intentamos con SMTP si est├í configurado

    # 2. Intentar con SMTP (Fallback)
    if SMTP_USER and SMTP_PASSWORD:
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
            print(f"   Ô£à Email enviado con SMTP!")
            return True
        except Exception as e:
            print(f"   ÔØî Error con SMTP: {e}")
            return False

    # 3. Modo Simulaci├│n (Desarrollo)
    print(f"   ÔÜá´©Å MODO SIMULACI├ôN - No hay credenciales de email configuradas")
    return True

def get_welcome_template(username):
    return f"""
    <div style="background-color: #FAFAF5; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #E5E7EB;">
            <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px;">KYATHOS</h1>
            </div>
            <div style="padding: 40px 30px; text-align: center;">
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">┬íHola, {username}! ­ƒæï</h2>
                <p style="color: #4B5563; line-height: 1.6; font-size: 16px;">Estamos encantados de tenerte en nuestra comunidad de amantes del dise├▒o. Ahora pod├®s empezar a crear tus propias tazas exclusivas.</p>
                <div style="margin: 35px 0;">
                    <a href="{os.getenv('FRONTEND_URL', 'https://tazas-personalizables.vercel.app')}/customizer" 
                       style="background-color: #D4A373; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                        Comenzar a Dise├▒ar
                    </a>
                </div>
                <p style="color: #9CA3AF; font-size: 13px; margin-top: 40px;">Si ten├®s alguna duda, simplemente respond├® a este correo.</p>
            </div>
        </div>
    </div>
    """

def get_order_confirmation_template(order_id, total_amount):
    return f"""
    <div style="background-color: #FAFAF5; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #E5E7EB;">
            <div style="background-color: #D4A373; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 900; letter-spacing: -0.5px;">PEDIDO RECIBIDO</h1>
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; text-align: center;">┬íGracias por tu compra!</h2>
                <p style="color: #4B5563; line-height: 1.6; font-size: 16px; text-align: center;">Hemos recibido tu pedido correctamente. Estamos ansiosos por empezar a producir tus tazas.</p>
                
                <div style="margin: 30px 0; background-color: #F9FAFB; padding: 25px; border-radius: 16px; border: 1px solid #F3F4F6;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #6B7280; font-size: 14px;">N┬║ de Pedido:</span>
                        <strong style="color: #1a1a1a; font-size: 14px; font-family: monospace;">#{order_id[:8].upper()}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid #E5E7EB; padding-top: 12px; margin-top: 12px;">
                        <span style="color: #1a1a1a; font-weight: 900;">Total:</span>
                        <strong style="color: #D4A373; font-size: 20px; font-weight: 900;">${total_amount:,.2f}</strong>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="{os.getenv('FRONTEND_URL', 'https://tazas-personalizables.vercel.app')}/orders" 
                       style="background-color: #1a1a1a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 900; display: inline-block; font-size: 13px; text-transform: uppercase;">
                        Ver mi pedido
                    </a>
                </div>
            </div>
        </div>
    </div>
    """

def get_payment_success_template(order_id):
    return f"""
    <div style="background-color: #FAFAF5; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #E5E7EB;">
            <div style="background-color: #10b981; padding: 40px; text-align: center;">
                <div style="font-size: 50px; margin-bottom: 20px;">Ô£¿</div>
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900;">┬íPAGO APROBADO!</h1>
            </div>
            <div style="padding: 40px 30px; text-align: center;">
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px; font-weight: 900;">┬íBuenas noticias!</h2>
                <p style="color: #4B5563; line-height: 1.6; font-size: 16px;">Confirmamos el pago de tu pedido <strong>#{order_id[:8].upper()}</strong>.</p>
                <p style="color: #4B5563; line-height: 1.6; font-size: 16px;">Ya estamos moviendo hilos para que tu taza personalizada empiece a tomar forma.</p>
                <p style="color: #9CA3AF; font-size: 13px; margin-top: 40px;">Te avisaremos cuando est├® en camino. ┬íGracias por confiar en nosotros!</p>
            </div>
        </div>
    </div>
    """

def get_password_reset_template(reset_url):
    return f"""
    <div style="background-color: #FAFAF5; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #E5E7EB;">
            <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
                <h1 style="color: #D4A373; margin: 0; font-size: 20px; font-weight: 900;">KYATHOS RECUPERACI├ôN</h1>
            </div>
            <div style="padding: 40px 30px; text-align: center;">
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">┬┐Olvidaste tu contrase├▒a?</h2>
                <p style="color: #4B5563; line-height: 1.6; font-size: 16px;">No pasa nada, nos pasa a todos. Hac├® click abajo para crear una nueva.</p>
                <div style="margin: 35px 0;">
                    <a href="{reset_url}" 
                       style="background-color: #D4A373; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 900; display: inline-block; font-size: 14px;">
                        Restablecer Contrase├▒a
                    </a>
                </div>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 40px; font-style: italic;">Este enlace expira en 60 minutos por seguridad.</p>
            </div>
        </div>
    </div>
    """
