from django.core.management.base import BaseCommand
from apps.layout.models import HeroSlide, SectionConfig, TopTicker, PlatformMetric, PartnerLogo

class Command(BaseCommand):
    help = "Saytning boshlang‘ich slaydlarini, bo‘limlar tartibini va sozlamalarini yuklaydi"

    def handle(self, *args, **options):
        self.stdout.write("Boshlang‘ich CMS ma’lumotlari yuklanmoqda...")

        # 1. Top Ticker
        TopTicker.objects.get_or_create(
            badge_text="NavDU 3-Mavsum",
            defaults={
                "message": "Inkubatsiya va Akseleratsiya Markazi: 45 kunlik intensiv dasturiga arizalar ochiq!",
                "action_text": "Ariza topshirish →",
                "action_url": "#apply",
                "is_active": True
            }
        )

        # 2. Hero Slides
        slides_data = [
            {
                "order": 1,
                "badge": "Navoiy Davlat Universiteti",
                "title": "Inkubatsiya va Akseleratsiya",
                "title_accent": "Markazi",
                "subtitle": "G‘oyadan Investitsiyagacha • 45 Kunlik Dastur",
                "description": "Universitet talabalari, yosh olimlari va tadqiqotchilarining innovatsion loyihalarini qo‘llab-quvvatlash uchun 24/7 kovorking, 3D prototiplash laboratoriyasi va $5,000 gacha dastlabki startap grantlari.",
                "highlights": ["100+ o‘rinli zamonaviy Kovorking", "3D Prototyping laboratoriyasi", "$5,000 gacha grantlar"],
                "cta_text": "Akseleratsiyaga ariza topshirish",
                "secondary_cta_text": "Dastur haqida batafsil",
                "cta_action": "apply",
                "image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80",
                "is_active": True
            },
            {
                "order": 2,
                "badge": "Talabalar Hamjamiyati",
                "title": "NavDU Startap",
                "title_accent": "Klubi",
                "subtitle": "Iqtidorli Yoshlar Platformasi • Co-Founder Matching",
                "description": "Universitetning eng faol talabalari, dasturchilari, dizaynerlari va yosh mutaxassislarini birlashtiruvchi erkin maydon. Birgalikda jamoa shakllantiring va haftalik meetup hamda vorkshoplarda qatnashing.",
                "highlights": ["1,500+ Faol a’zolar", "Haftalik yopiq meetup’lar", "Co-Founder matching tizimi"],
                "cta_text": "Startap klubiga qo‘shilish",
                "secondary_cta_text": "Jamoa qidirish",
                "cta_action": "team",
                "image_url": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80",
                "is_active": True
            },
            {
                "order": 3,
                "badge": "Yillik Universitet Hakatoni",
                "title": "NavDU InnoHack",
                "title_accent": "2026",
                "subtitle": "60 000 000 so‘m mukofot jamg‘armasi • 48 Soatlik bellashuv",
                "description": "Universitet miqyosidagi yillik eng katta texnologik bellashuv! AI va Ta’lim, Qishloq xo‘jaligi texnologiyalari, Yashil energetika va Sanoat avtomatizatsiyasi bo‘yicha kuch sinashing.",
                "highlights": ["48 Soat uzluksiz hakaton", "60 mln so‘m sovrin", "Respublika yetakchi mentorlari"],
                "cta_text": "Hakatonga ro‘yxatdan o‘tish",
                "secondary_cta_text": "Tadbirlar kalendari",
                "cta_action": "events",
                "image_url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&auto=format&fit=crop&q=80",
                "is_active": True
            },
            {
                "order": 4,
                "badge": "Sanoat Bilan Hamkorlik",
                "title": "NKMK va Korxonalar Bilan",
                "title_accent": "B2B Hamkorlik",
                "subtitle": "Haqiqiy Bozor va Investitsiyalar • Sanoat integratsiyasi",
                "description": "Navoiy kon-metallurgiya kombinati (NKMK), Navoiyazot va viloyat quyosh fotoelektr stansiyalari talabalarning innovatsion startaplarini to‘g‘ridan-to‘g‘ri amaliyotga joriy qiladi va sarmoyalaydi.",
                "highlights": ["B2B Shartnomalar", "NKMK Ishlab chiqarish amaliyoti", "$1M gacha sarmoya fondi"],
                "cta_text": "Startaplar portfelini ko‘rish",
                "secondary_cta_text": "Demo Day natijalari",
                "cta_action": "portfolio",
                "image_url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop&q=80",
                "is_active": True
            },
        ]

        for s in slides_data:
            HeroSlide.objects.get_or_create(order=s["order"], defaults=s)

        # 3. Sections layout
        sections_data = [
            ("hero_slider", "Bosh Slayder", 1),
            ("program_stages", "Dastur Bosqichlari (45 kun)", 2),
            ("portfolio_section", "Startaplar Katalogi & Leaderboard", 3),
            ("demo_day_section", "Demo Day Natijalari", 4),
            ("news_section", "Yangiliklar & Matbuot", 5),
            ("events_section", "Hakatonlar & Tadbirlar", 6),
            ("talent_pool_section", "Talent Pool & Hammuassislar", 7),
            ("playbook_section", "Startup Playbook", 8),
            ("partners_marquee", "Hamkorlar Marquee Aylanishi", 9),
        ]

        for key, title, order in sections_data:
            SectionConfig.objects.get_or_create(section_key=key, defaults={"custom_title": title, "order": order, "is_visible": True})

        # 4. Metrics
        metrics_data = [
            ("Jami Jalb Qilingan", "$975,000", "Demo Day & Grantlar", 1),
            ("Rezident Startaplar", "32+", "Akselerator bitiruvchilari", 2),
            ("Startap Klubi A’zolari", "1,500+", "Talabalar hamjamiyati", 3),
            ("Yillik Hakaton Sovrini", "60M UZS", "InnoHack 2026", 4),
        ]

        for label, val, sub, ord_idx in metrics_data:
            PlatformMetric.objects.get_or_create(label=label, defaults={"value": val, "subtitle": sub, "order": ord_idx})

        # 5. Partners
        partners_data = [
            ("NKMK Navoiy Metallurgiya", "SvgLogoNKMK", 1),
            ("Navoiyazot Kimyo Sanoati", "SvgLogoNavoiyazot", 2),
            ("IT Park Uzbekistan", "SvgLogoITPark", 3),
            ("Raqamli Texnologiyalar Vazirligi", "SvgLogoDigitalGov", 4),
            ("Oliy Ta’lim Vazirligi", "SvgLogoHigherEdu", 5),
            ("Aloqabank Ventures", "SvgLogoAloqabank", 6),
        ]

        for name, key, ord_idx in partners_data:
            PartnerLogo.objects.get_or_create(name=name, defaults={"logo_svg_key": key, "order": ord_idx, "is_active": True})

        self.stdout.write(self.style.SUCCESS("✓ Barcha CMS ma’lumotlari muvaffaqiyatli yuklandi!"))
