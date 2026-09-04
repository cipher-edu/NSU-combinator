from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.cms.models import Faculty, GalleryImage, Investor, News, Page, Partner, StaffMember
from apps.cohorts.models import Season, Track
from apps.users.models import User

FACULTIES = [
    ('fiz-mat', 'Fizika-matematika fakulteti', 'Faculty of Physics and Mathematics'),
    ('pedagogika', 'Pedagogika fakulteti', 'Faculty of Pedagogy'),
    ('xorijiy', 'Xorijiy tillar fakulteti', 'Faculty of Foreign Languages'),
    ('iqtisod', 'Iqtisodiyot fakulteti', 'Faculty of Economics'),
    ('tarix', 'Tarix fakulteti', 'Faculty of History'),
]

TRACKS = [
    ('edtech', "Ta'lim texnologiyalari", 'EdTech'),
    ('ai', 'Sun’iy intellekt', 'AI'),
    ('green', 'Yashil iqtisod', 'Green'),
    ('civic', 'Ijtimoiy loyiha', 'Civic'),
    ('other', 'Boshqa', 'Other'),
]

CURRICULUM = [
    {'week': 1, 'slug': 'w1', 'title_uz': 'Muammo va bir jumla', 'title_en': 'Problem in one line',
     'outcome_uz': '30 soniyalik pitch'},
    {'week': 2, 'slug': 'w2', 'title_uz': 'Foydalanuvchi suhbatlari', 'title_en': 'User interviews',
     'outcome_uz': 'Kamida 8 ta suhbat'},
    {'week': 3, 'slug': 'w3', 'title_uz': 'Birinchi versiya', 'title_en': 'First version',
     'outcome_uz': 'Ishlaydigan demo'},
    {'week': 4, 'slug': 'w4', 'title_uz': 'Fakultet va sanoat', 'title_en': 'Faculty & industry',
     'outcome_uz': '1 ta mentor fikri'},
    {'week': 5, 'slug': 'w5', 'title_uz': 'Birinchi foydalanuvchilar', 'title_en': 'First users',
     'outcome_uz': '5–10 haqiqiy foydalanuvchi'},
    {'week': 6, 'slug': 'w6', 'title_uz': "O'sish va o'lchov", 'title_en': 'Growth',
     'outcome_uz': '1 ta kanal'},
    {'week': 7, 'slug': 'w7', 'title_uz': 'Biznes modeli', 'title_en': 'Business model',
     'outcome_uz': 'Kim to‘laydi'},
    {'week': 8, 'slug': 'w8', 'title_uz': 'Jamoa va ulush', 'title_en': 'Team & equity',
     'outcome_uz': 'Cap table qoralama'},
    {'week': 9, 'slug': 'w9', 'title_uz': 'Investor tayyorgarligi', 'title_en': 'Investor readiness',
     'outcome_uz': 'Deck va moliyaviy model'},
    {'week': 10, 'slug': 'w10', 'title_uz': 'Demo Day', 'title_en': 'Demo Day',
     'outcome_uz': '3 daqiqalik sahna'},
]

STAFF = [
    ('ismatov', "Ulug'bek Ismatov", 'Dastur rahbari', 'Program lead', 1),
    ('ismailova', 'Laylo Ismailova', 'Operatsiya', 'Operations', 2),
    ('ismailov', 'Murodillo Ismailov', 'Hamjamiyat', 'Community', 3),
    ('cto', 'Makhsudkhon Ismatullaev', 'Texnik maslahatchi', 'Technical advisor', 4),
    ('cmo', 'Alisher Sultonov', 'Kommunikatsiya', 'Communications', 5),
    ('mentor-hub', 'Odil Raximjonov', 'Mentorlik muvofiqlashtiruvchisi', 'Mentor coordinator', 6),
]

INVESTORS = [
    ('yoqubov', 'Abdulaziz Yoqubov', 'CEO', 'Yoshlar Ventures', 1),
    ('karabayev', 'Muzaffar Karabayev', 'Founder & Investor', 'kpi.com', 2),
    ('olimov', 'Sirojiddin Olimov', 'CEO', 'Mutolaa', 3),
    ('paiziev', 'Akmal Paiziev', 'Founder', 'Numeo.ai', 4),
    ('latifov', 'Bahromjon Latifov', 'Head', 'Dock 2 Dock Freight', 5),
    ('kodirov', 'Islomjon Kodirov', 'Head', 'IKT Rishton', 6),
]

PARTNERS = [
    ('navdu', 'Navoiy davlat universiteti', 'https://nsuni.uz', 1),
    ('it-park', 'IT Park Uzbekistan', 'https://it-park.uz', 2),
    ('yoshlar', 'Yoshlar Ventures', '', 3),
    ('startup-garage', 'Startup Garage', '', 4),
    ('itpv', 'IT Park Ventures', '', 5),
    ('space', 'Space Coworking', '', 6),
    ('navoiy-it', 'Navoiy IT markazi', '', 7),
    ('texnopark', 'Navoiy texnoparki', '', 8),
]

NEWS = [
    ('qanday-ariza', 'NSU startup-club 1-mavsumiga qabul: nima kerak?',
     'How to get into NSU startup-club Season 1',
     '<p>Jamoa, muammo va nima uchun aynan NavDU — shu uch savolga aniq javob yozing. Prezentatsiya shart emas.</p>'),
    ('demo-day-nima', 'Demo Day nima va zalda kim o‘tiradi?',
     'What is Demo Day',
     '<p>Dekanat, mentorlar va tashqi investorlar. Uch daqiqa: muammo, yechim, so‘rov.</p>'),
    ('mentorlik', 'Mentorlik qanday ishlaydi: professor + sanoat',
     'How mentorship works',
     '<p>Har jamoaga bitta asosiy mentor. Haftalik maqsad — kabinetda qoladi.</p>'),
    ('fakultet-mentor', 'Fakultet professori qanday mentor bo‘ladi?',
     'How a faculty professor mentors',
     '<p>Soha bilimini mahsulot savoliga aylantirish. Haftada bir uchrashuv, bitta aniq maqsad.</p>'),
    ('navoiy-sanoat', 'Navoiy sanoati va talaba startaplari',
     'Navoi industry and student startups',
     '<p>Kon, kimyo, energetika — universitet yonidagi real buyurtmachi. G‘oyani shu yerda tekshirish mumkin.</p>'),
    ('birinchi-jamoa', 'Birinchi jamoa qanday yig‘iladi?',
     'How the first team forms',
     '<p>Uch kishi yetadi: kim quradi, kim mijoz bilan gaplashadi, kim hisob yuritadi.</p>'),
    ('sahna-qorquvi', 'Sahna qo‘rquvi: uch daqiqani qanday mashq qilamiz',
     'Stage fright: how we rehearse three minutes',
     '<p>Hikoyani kabinetda o‘n marta aytasiz. Demo Day’da zal yangi bo‘lmaydi.</p>'),
    ('ulush-talaba', 'Talaba jamoasida ulushni qanday yozamiz',
     'How student teams write equity',
     '<p>Do‘stlikka emas, qilgan ishga. Cap table qoralamasi 8-haftada stolga tushadi.</p>'),
    ('nega-navdu', 'Nega aynan NavDU startup-club?',
     'Why NSU startup-club',
     '<p>Toshkent akseleratori emas — universitet ichidagi 10 hafta. Yuzma-yuz, mentor yonida.</p>'),
    ('investor-savol', 'Investor zalda nima so‘raydi?',
     'What investors ask in the room',
     '<p>Kim to‘laydi, nima o‘zgardi, keyingi 90 kun. Uch savolga uch daqiqada javob.</p>'),
    ('haftalik-maqsad', 'Haftalik maqsad nima uchun yozma qoladi',
     'Why the weekly goal stays written down',
     '<p>Og‘zaki kelishuv unutiladi. Kabinetdagi yozuv juma kuni tekshiriladi.</p>'),
]


SEED_DIR = Path(settings.BASE_DIR) / 'seed_media'

NEWS_COVER_FILES = {
    'qanday-ariza': SEED_DIR / 'news' / 'qanday-ariza.jpg',
    'demo-day-nima': SEED_DIR / 'news' / 'demo-day-nima.jpg',
    'mentorlik': SEED_DIR / 'news' / 'mentorlik.jpg',
    'fakultet-mentor': SEED_DIR / 'moments' / '15.jpg',
    'navoiy-sanoat': SEED_DIR / 'moments' / '18.jpg',
    'birinchi-jamoa': SEED_DIR / 'moments' / '05.jpg',
    'sahna-qorquvi': SEED_DIR / 'moments' / '19.jpg',
    'ulush-talaba': SEED_DIR / 'moments' / '13.jpg',
    'nega-navdu': SEED_DIR / 'moments' / '18.jpg',
    'investor-savol': SEED_DIR / 'moments' / '17.jpg',
    'haftalik-maqsad': SEED_DIR / 'moments' / '01.jpg',
}


def _attach(instance, field_name, path: Path):
    if not path.is_file():
        return
    field = getattr(instance, field_name)
    if field:
        return
    with path.open('rb') as fh:
        field.save(path.name, File(fh), save=True)


class Command(BaseCommand):
    help = 'Dastlabki admin, CMS, mavsum va treklarni yaratadi'

    def handle(self, *args, **options):
        email = settings.SEED_ADMIN_EMAIL
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'name': settings.SEED_ADMIN_NAME,
                'role': User.Role.SUPERADMIN,
                'is_staff': True,
                'is_superuser': True,
                'consent_pd_at': timezone.now(),
            },
        )
        if created:
            user.set_password(settings.SEED_ADMIN_PASSWORD)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Superadmin yaratildi: {email}'))
        else:
            self.stdout.write(f'Superadmin mavjud: {email}')

        for slug, uz, en in FACULTIES:
            Faculty.objects.get_or_create(slug=slug, defaults={'name_uz': uz, 'name_en': en})

        season, _ = Season.objects.get_or_create(
            slug='s1-2026',
            defaults={
                'name_uz': '1-mavsum 2026',
                'name_en': 'Season 1 2026',
                'status': Season.Status.APPLICATIONS_OPEN,
                'is_current': True,
                'apply_opens_at': timezone.now(),
                'program_weeks': 10,
                'stats_override': {'applications': 0, 'accepted': 0, 'seasons': 1},
                'curriculum': CURRICULUM,
            },
        )
        season.curriculum = CURRICULUM
        season.is_current = True
        if season.status == Season.Status.DRAFT:
            season.status = Season.Status.APPLICATIONS_OPEN
        season.save()
        for slug, uz, en in TRACKS:
            Track.objects.get_or_create(season=season, slug=slug, defaults={'name_uz': uz, 'name_en': en})

        Page.objects.get_or_create(
            slug='about',
            defaults={
                'title_uz': 'Dastur haqida',
                'title_en': 'About',
                'body_uz': '<p>NSU startup-club — Navoiy davlat universitetining startap akseleratori. '
                           'Talaba jamoalari 10 haftada g‘oyadan Demo Day’gacha o‘tadi.</p>',
                'is_published': True,
            },
        )

        StaffMember.objects.filter(slug='admin').delete()
        for slug, name, uz, en, order in STAFF:
            StaffMember.objects.update_or_create(
                slug=slug,
                defaults={'name': name, 'title_uz': uz, 'title_en': en, 'order': order, 'is_published': True},
            )
        for slug, name, title, org, order in INVESTORS:
            Investor.objects.update_or_create(
                slug=slug,
                defaults={'name': name, 'title_uz': title, 'org': org, 'order': order, 'is_published': True},
            )
        for slug, name, url, order in PARTNERS:
            Partner.objects.update_or_create(
                slug=slug, defaults={'name': name, 'url': url, 'order': order, 'is_published': True}
            )
        now = timezone.now()
        for slug, uz, en, body in NEWS:
            news, _ = News.objects.update_or_create(
                slug=slug,
                defaults={
                    'title_uz': uz, 'title_en': en, 'body_uz': body, 'body_en': body,
                    'is_published': True, 'published_at': now,
                },
            )
            cover = NEWS_COVER_FILES.get(slug)
            if cover:
                _attach(news, 'cover', cover)

        for slug, _name, uz, _en, _order in STAFF:
            staff = StaffMember.objects.filter(slug=slug).first()
            if staff:
                _attach(staff, 'photo', SEED_DIR / 'team' / f'{slug}.jpg')
        for slug, _name, _title, _org, _order in INVESTORS:
            inv = Investor.objects.filter(slug=slug).first()
            if inv:
                _attach(inv, 'photo', SEED_DIR / 'investors' / f'{slug}.jpg')

        for i in range(1, 20):
            slug = f'moment-{i:02d}'
            placement = ''
            if i == 3:
                placement = GalleryImage.Placement.ABOUT
            elif i == 19:
                placement = GalleryImage.Placement.DEMO
            img, _ = GalleryImage.objects.update_or_create(
                slug=slug,
                defaults={
                    'caption_uz': f'Moment {i:02d}',
                    'order': i,
                    'placement': placement,
                    'show_in_gallery': True,
                    'is_published': True,
                },
            )
            _attach(img, 'image', SEED_DIR / 'moments' / f'{i:02d}.jpg')

        apply_hero, _ = GalleryImage.objects.update_or_create(
            slug='apply-hero',
            defaults={
                'caption_uz': 'Ariza banner',
                'order': 100,
                'placement': GalleryImage.Placement.APPLY,
                'show_in_gallery': False,
                'is_published': True,
            },
        )
        _attach(apply_hero, 'image', SEED_DIR / 'apply-hero.jpg')
        og, _ = GalleryImage.objects.update_or_create(
            slug='og',
            defaults={
                'caption_uz': 'Open Graph',
                'order': 101,
                'placement': GalleryImage.Placement.OG,
                'show_in_gallery': False,
                'is_published': True,
            },
        )
        _attach(og, 'image', SEED_DIR / 'og.jpg')

        self.stdout.write(self.style.SUCCESS('Seed tayyor'))
