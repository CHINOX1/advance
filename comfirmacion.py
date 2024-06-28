import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_confirmation_email(to_email, date, time):
    from_email = "your_email@example.com"
    password = "your_email_password"

    subject = "Confirmación de Cita"
    body = f"Su cita para el día {date} a las {time} ha sido confirmada."

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.example.com', 587)
        server.starttls()
        server.login(from_email, password)
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print(f"Error sending email: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 4:
        print("Usage: python send_confirmation.py <to_email> <date> <time>")
    else:
        send_confirmation_email(sys.argv[1], sys.argv[2], sys.argv[3])
