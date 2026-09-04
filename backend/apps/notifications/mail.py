from django.conf import settings
from django.core.mail import EmailMultiAlternatives


def send_html_email(to_email: str, subject: str, text: str, html: str | None = None):
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    if html:
        msg.attach_alternative(html, 'text/html')
    msg.send(fail_silently=False)


def otp_html(code: str) -> str:
    return f"""
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#fafaf9;color:#0a0a0a">
      <p style="color:#fb6a00;font-weight:700;letter-spacing:.2em;font-size:11px;text-transform:uppercase">NSU startup-club</p>
      <h1 style="font-size:22px;margin:12px 0">Kirish kodi</h1>
      <p>NavDU startap akseleratoriga kirish uchun quyidagi kodni kiriting:</p>
      <p style="font-size:32px;letter-spacing:.2em;font-weight:700;background:#fff;border-radius:12px;padding:16px;text-align:center">{code}</p>
      <p style="color:#52525b;font-size:13px">Kod 10 daqiqa amal qiladi. Agar so‘ramagan bo‘lsangiz, e’tiborsiz qoldiring.</p>
    </div>
    """


def welcome_html() -> str:
    return """
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <p style="color:#fb6a00;font-weight:700">NSU startup-club</p>
      <h1 style="font-size:22px">Xush kelibsiz</h1>
      <p>Email tasdiqlandi. Keyingi qadam: kabinetda profilni to‘ldiring va Telegram botni ulang — shunda dastur xabarlari sizga yetib boradi.</p>
    </div>
    """
