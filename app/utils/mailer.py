import smtplib
import ssl
from email.message import EmailMessage
from typing import Optional

from config.settings import (
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM,
    SMTP_TLS,
    SMTP_STARTTLS,
)


def send_email(to_email: str, subject: str, html_body: str, text_body: Optional[str] = None) -> None:
    if not SMTP_HOST or not SMTP_PORT or not SMTP_FROM:
        raise RuntimeError("SMTP settings are not configured. Please set SMTP_* env vars.")

    message = EmailMessage()
    message["From"] = SMTP_FROM
    message["To"] = to_email
    message["Subject"] = subject
    if text_body:
        message.set_content(text_body)
    message.add_alternative(html_body, subtype="html")

    # Chọn chế độ dựa vào env hoặc theo port phổ biến
    use_ssl = SMTP_TLS or (not SMTP_STARTTLS and SMTP_PORT == 465)
    use_starttls = SMTP_STARTTLS or (not SMTP_TLS and SMTP_PORT == 587)

    def send_via_ssl():
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as smtp:
            if SMTP_USER and SMTP_PASSWORD:
                smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(message)

    def send_via_starttls():
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.ehlo()
            smtp.starttls(context=ssl.create_default_context())
            smtp.ehlo()
            if SMTP_USER and SMTP_PASSWORD:
                smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(message)

    def send_plain():
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            if SMTP_USER and SMTP_PASSWORD:
                smtp.login(SMTP_USER, SMTP_PASSWORD)
            smtp.send_message(message)

    try:
        if use_ssl:
            send_via_ssl()
        elif use_starttls:
            send_via_starttls()
        else:
            send_plain()
    except ssl.SSLError:
        # Thử chế độ khác khi gặp lỗi SSL thường thấy (WRONG_VERSION_NUMBER,...)
        if use_ssl:
            send_via_starttls()
        elif use_starttls:
            send_via_ssl()
        else:
            # fallback cuối
            send_via_starttls()


