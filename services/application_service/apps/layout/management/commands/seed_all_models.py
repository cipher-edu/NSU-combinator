from django.core.management.base import BaseCommand
from apps.layout.models import (
    HeroSlide, SectionConfig, TopTicker, PlatformMetric, PartnerLogo, Startup,
    NewsArticle, Mentor, CoFounderVacancy, Story, PlaybookGuide
)

class Command(BaseCommand):
    help = "Barcha yangi modellar (News, Mentor, Vacancy, Story, Playbook) uchun boshlang‘ich ma’lumotlarni yuklash"

    def handle(self, *args, **options):
        self.stdout.write("Barcha modellar ma’lumotlari yuklanmoqda...")

        # 1. Yangiliklar (NewsArticle)
        if NewsArticle.objects.count() == 0:
            NewsArticle.objects.create(
                title='NavDU talabalari "InnoHack 2026" hakatoni uchun 60 mln so‘m mukofot jamg‘armasini e’lon qildi',
                slug='navdu-innohack-2026-60-mln-som-mukofot',
                category='Hakatonlar',
                excerpt='Universitetning eng iqtidorli dasturchilari va tadqiqotchilari 48 soat davomida sun’iy intellekt, yashil energetika va agrotexnologiyalar bo‘yicha bellashadilar.',
                content='Navoiy davlat universiteti Inkubatsiya va akseleratsiya markazi hamda Startap Klubi hamkorligida yillik eng katta texnologik tadbir — "NavDU InnoHack 2026" start olmoqda.\n\nUshbu hakatonning bosh maqsadi — viloyatdagi mavjud agrar, sanoat va ekologik muammolarni talabalarning IT va muhandislik yechimlari orqali hal etishdir.',
                cover_image='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
                author_name='Azizbek Rahmatov',
                author_role='NavDU Axborot xizmati rahbari',
                date_str='12 Mart, 2026',
                read_time='3 daqiqa',
                featured=True,
                tags=['Hakaton', 'InnoHack', 'NavDU', 'Mukofot']
            )
            NewsArticle.objects.create(
                title='Navoiy kon-metallurgiya kombinati (NKMK) talabalar startaplarini moliyalashtirish bo‘yicha 1.2 mlrd so‘mlik memorandum imzoladi',
                slug='nkmk-navdu-startap-memorandum-1-2-mlrd',
                category='Hamkorlik',
                excerpt='Kombinat rahbariyati va NavDU ma’muriyati o‘rtasida sanoat chiqindilarini qayta ishlash va energetikani tejovchi talabalar loyihalarini joriy etishga kelishildi.',
                content='Bugun Navoiy davlat universiteti Bosh binosida Navoiy kon-metallurgiya kombinati (NKMK) innovatsiyalar departamenti vakillari bilan kengaytirilgan uchrashuv bo‘lib o‘tdi.\n\nTalabalar va yosh olimlarning amaliy startap ishlanmalarini sanoatga joriy qilish uchun 1 milliard 200 million so‘mlik innovatsion grant fondi tashkil etildi.',
                cover_image='https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
                author_name='Dilnoza Boboyeva',
                author_role='Inkubatsiya markazi koordinatori',
                date_str='10 Mart, 2026',
                read_time='4 daqiqa',
                featured=True,
                tags=['NKMK', 'Investitsiya', 'Sanoat', 'B2B']
            )
            NewsArticle.objects.create(
                title='NavDU Inkubatsiya markazida 3-mavsum qabuli boshlandi: 45 kunlik intensiv dastur va $1,000 stipendiya',
                slug='navdu-inkubatsiya-3-mavsum-qabul-boshlandi',
                category='Akseleratsiya',
                excerpt='Har bir saralangan jamoa 24/7 kovorking, 3 mahal bepul ovqat, 3D prototiplash laboratoriyasi va xalqaro mentorlar ko‘magi bilan ta’minlanadi.',
                content='Universitetning barcha fakultetlari talabalari, magistrantlari va yosh tadqiqotchilari uchun 3-mavsum akseleratsiya dasturiga rasmiy arizalar qabuli e’lon qilindi.\n\nUshbu mavsumda jami 25 ta istiqbolli startap saralab olinadi.',
                cover_image='https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
                author_name='Jasur Shodiyev',
                author_role='Inkubatsiya markazi rahbari',
                date_str='08 Mart, 2026',
                read_time='3 daqiqa',
                featured=False,
                tags=['Akseleratsiya', 'Qabul', 'NavDU', 'Grant']
            )
            self.stdout.write("✓ Yangiliklar yuklandi")

        # 2. Mentorlar (Mentor)
        if Mentor.objects.count() == 0:
            Mentor.objects.create(
                name='Dr. Otabek Jo‘rayev',
                title='Axborot texnologiyalari kafedrasi mudiri, Dotsent',
                organization='Navoiy davlat universiteti',
                bio='Sun’iy intellekt, katta hajmdagi ma’lumotlar va ilmiy startaplar bo‘yicha 15 yillik tajribaga ega olim.',
                avatar='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
                expertise=['AI & ML', 'Ilmiy grantlar', 'Texnik arxitektura'],
                available_slots=['Seshanba 15:00', 'Payshanba 16:00'],
                rating=4.9,
                reviews_count=42,
                telegram='@ojorayev_navdu'
            )
            Mentor.objects.create(
                name='Azamat Shokirov',
                title='Senior Tech Lead & Startap maslahatchisi',
                organization='UzCombinator Mentor',
                bio='Startaplarni noldan $100K+ investitsiyaga yetkazish bo‘yicha amaliy tajribaga ega arxitektor.',
                avatar='https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
                expertise=['MVP qurish', 'Masshtablash', 'Pitch Deck'],
                available_slots=['Chorshanba 19:00', 'Juma 18:00'],
                rating=5.0,
                reviews_count=48,
                telegram='@azamat_shokirov'
            )
            Mentor.objects.create(
                name='Nilufar Ergasheva',
                title='Marketing va Growth direktori',
                organization='E-commerce guruhi',
                bio='Raqamli marketing, CustDev va startaplar PR strategiyasi bo‘yicha ekspert.',
                avatar='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
                expertise=['SMM & PR', 'CustDev', 'Mijozlarni jalb qilish'],
                available_slots=['Dushanba 14:00', 'Payshanba 14:00'],
                rating=4.8,
                reviews_count=31,
                telegram='@nilufar_growth'
            )
            self.stdout.write("✓ Mentorlar yuklandi")

        # 3. Co-Founder Vakansiyalari (CoFounderVacancy)
        if CoFounderVacancy.objects.count() == 0:
            CoFounderVacancy.objects.create(
                startup_name='AgroSmart Drip',
                startup_logo='🌱',
                category='AgroTech & Eco',
                role_title='Mobile Developer (Flutter / React Native)',
                required_skills=['Flutter', 'REST API', 'Bluetooth BLE', 'Figma'],
                description='IoT sensorlaridan keladigan ma’lumotlarni fermerlarga chiroyli ko‘rsatib turuvchi mobil ilova ishlab chiqishimiz kerak. Dala sharoitida oflayn ishlash muhim.',
                commitment_type='Erkin grafik',
                faculty='Fizika-matematika yoki IT fakulteti',
                contact_telegram='@jamshid_agro'
            )
            CoFounderVacancy.objects.create(
                startup_name='EduMentor AI',
                startup_logo='🤖',
                category='AI & EdTech',
                role_title='UI/UX Dizayner (Figma)',
                required_skills=['Figma', 'Web Design', 'Design Systems'],
                description='Talabalar uchun o‘quv platformamiz interfeysini foydalanuvchiga juda sodda va chiroyli qilib qayta loyihalash kerak.',
                commitment_type='Yarim stavka',
                faculty='San’atshunoslik yoki IT fakulteti',
                contact_telegram='@malika_edutech'
            )
            CoFounderVacancy.objects.create(
                startup_name='EcoQuyosh',
                startup_logo='☀️',
                category='GreenTech & Energy',
                role_title='3D Modellashtiruvchi & Robototexnik',
                required_skills=['AutoCAD / SolidWorks', '3D Printing', 'Arduino'],
                description='Quyosh panellarini tozalovchi robottimizning yangi yengil korpusi va g‘ildiraklarini 3D printerda chop etish kerak.',
                commitment_type='To‘liq stavka',
                faculty='Fizika va texnologik ta’lim',
                contact_telegram='@bekzod_robotics'
            )
            self.stdout.write("✓ Vakansiyalar yuklandi")

        # 4. Muvaffaqiyat Hikoyalari (Story)
        if Story.objects.count() == 0:
            Story.objects.create(
                title='AgroSmart qanday qilib Navoiy cho‘lida 40% suvni tejab, $140,000 investitsiya jalb qildi?',
                excerpt='Fizika-matematika fakultetidagi laboratoriyadan boshlangan g‘oyamiz qanday qilib 18 ta fermer xo‘jaligiga yetib bordi?',
                content='Startap g‘oyasi bizda Karmana tumanidagi fermer amakimning pomidor dalasida suv taqsimoti tufayli qo‘shnilar o‘rtasidagi janjalni ko‘rganimda tug‘ilgan.\n\nNavoiy viloyatida yozda harorat +45 darajadan oshadi va har bir tomchi suv hisobli. UzCombinator NavDU akseleratoriga kelganimizda, mentorlarimiz bizga dalaga chiqib fermerlar bilan gaplashishni maslahat berdilar.\n\n3 haftada suv sarfi 38% ga qisqardi! Demo Day 2025 da esa biz investorlardan $140,000 miqdorida sarmoya jalb qildik.',
                author_name='Jamshid Nurmatov',
                author_role='AgroSmart Drip asoschisi',
                author_avatar='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                startup_name='AgroSmart Drip',
                date_str='02.03.2026',
                read_time='4 daqiqa',
                tags=['Tajriba', 'AgroTech', 'Investitsiya']
            )
            Story.objects.create(
                title='1-kursda startap boshlash: Xatolarim, uyqusiz tunlar va birinchi 3,800 talaba',
                excerpt='Dasturchisiz boshlangan loyihamiz qanday qilib universitetning eng mashhur AI ta’lim platformasiga aylandi?',
                content='Universitetga endi kirganimda eng katta muammo — o‘zbek tilidagi sifatli ilmiy manbalarning yo‘qligi edi. Oddiy Telegram bot shaklida birinchi prototipni 2 kechada yasab ko‘rdim.\n\nUzCombinator Co-founder matching orqali jamoamizga kuchli dasturchi topdik. Hozir platformamizda 3,800 dan ortiq faol talaba bor va Demo Day da $150,000 investitsiya oldik.',
                author_name='Malika Karimova',
                author_role='EduMentor AI asoschisi',
                author_avatar='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                startup_name='EduMentor AI',
                date_str='25.02.2026',
                read_time='5 daqiqa',
                tags=['AI', 'EdTech', 'Talabalar']
            )
            self.stdout.write("✓ Muvaffaqiyat hikoyalari yuklandi")

        # 5. Startup Playbook (PlaybookGuide)
        if PlaybookGuide.objects.count() == 0:
            PlaybookGuide.objects.create(
                category='G‘oya',
                title='G‘oyani tekshirish va Muammoni tasdiqlash (Problem Validation)',
                read_time='6 daqiqa',
                summary='Dasturlashni boshlashdan oldin, odamlar haqiqatan ham sizning yechimingiz uchun to‘lashga tayyormi yoki yo‘qligini aniqlash usullari.',
                author='Jasur Shodiyev',
                author_role='NavDU Inkubatsiya Markazi rahbari',
                key_takeaway='Odamlardan "Mening g‘oyam yoqdimi?" deb so‘ramang. Ularning o‘tmishdagi haqiqiy xatti-harakatlari va xarajatlarini so‘rang.',
                checklist=[
                    'Kamida 20 nafar potentsial mijoz bilan yuzma-yuz "Mom Test" suhbati o‘tkazing',
                    'Muammo hozir qanday va qancha mablag‘ sarflab hal qilinayotganini aniqlang',
                    'Hech qanday kod yozmasdan, bitta sahifali Landing Page orqali kutish ro‘yxatini to‘plang',
                    'Mijozlardan muammoning oylik zararini hisoblang'
                ],
                detailed_content=[
                    'Ko‘pchilik yangi boshlovchi startapchilar qiladigan eng katta xato — avval mahsulotni 6 oy davomida kodlash, keyin esa hech kimga kerak emasligini bilib qolishdir.',
                    'Y Combinator falsafasiga ko‘ra, har qanday startap g‘oyasi avvalo "Muammo borligini isbotlash"dan boshlanishi shart.'
                ],
                order=1
            )
            PlaybookGuide.objects.create(
                category='MVP',
                title='MVP (Minimum Viable Product) yaratish qoidalari',
                read_time='8 daqiqa',
                summary='Mukammallikka intilmasdan, 3-4 hafta ichida birinchi ishchi prototipni bozorga chiqarish formulasi.',
                author='Otabek Mirzayev',
                author_role='NavDU Tech Mentor • Ex-IT Park',
                key_takeaway='Agar birinchi versiyangizdan uyalmasangiz, demak, uni bozorga juda kech chiqargansiz. (Reid Hoffman)',
                checklist=[
                    'Faqat 1 ta asosiy funksiyani (Core Feature) tanlang',
                    'No-code yoki tayyor shablonlardan foydalaning (Supabase, Firebase, Tailwind)',
                    'Birinchi haftadayoq real foydalanuvchiga berib ko‘ring'
                ],
                detailed_content=[
                    'MVP ning maqsadi — barcha orzuingizdagi funksiyalarni sig‘dirish emas, balki gipotezani eng kam xarajat bilan tekshirishdir.'
                ],
                order=2
            )
            PlaybookGuide.objects.create(
                category='Grantlar',
                title='Universitet va Davlat grantlarini yutish strategiyasi',
                read_time='10 daqiqa',
                summary='Oliy ta’lim vazirligi va Innovatsiya agentligi grantlariga ariza topshirish, smeta tuzish va himoya qilish sirlari.',
                author='Dr. Otabek Jo‘rayev',
                author_role='Axborot texnologiyalari kafedrasi mudiri',
                key_takeaway='Hakamlar faqat texnologiyaga emas, balki loyihaning iqtisodiy samaradorligi va o‘zini oqlashiga baho beradilar.',
                checklist=[
                    'Loyiha smetasini asosli qilib 100% ochiq ko‘rsating',
                    'NKMK yoki boshqa sanoat hamkoridan kafolat xati oling',
                    'Ilmiy yangilik va patent olish salohiyatini ta’kidlang'
                ],
                detailed_content=[
                    'Har yili NavDU da startaplar uchun 50 mln dan 200 mln so‘mgacha grant tanlovlari o‘tkaziladi.'
                ],
                order=3
            )
            self.stdout.write("✓ Playbook qo‘llanmalari yuklandi")

        self.stdout.write(self.style.SUCCESS("✓ Barcha yangi modellar muvaffaqiyatli yuklandi!"))
