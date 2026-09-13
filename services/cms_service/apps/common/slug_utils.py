import re
import unicodedata

# Barcha turdagi apostroflar (o', g' va tutuq belgilari uchun)
APOSTROPHE_CHARS = r"['’‘ʻʼ`´]"

CYRILLIC_TO_LATIN = {
    'ў': 'o', 'Ў': 'o', 'ғ': 'g', 'Ғ': 'g', 'қ': 'q', 'Қ': 'q', 'ҳ': 'h', 'Ҳ': 'h',
    'ч': 'ch', 'Ч': 'ch', 'ш': 'sh', 'Ш': 'sh', 'щ': 'shch', 'Щ': 'shch',
    'ю': 'yu', 'Ю': 'yu', 'я': 'ya', 'Я': 'ya', 'ё': 'yo', 'Ё': 'yo',
    'ц': 'ts', 'Ц': 'ts', 'ж': 'j', 'Ж': 'j',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'з': 'z',
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e',
    'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'З': 'z',
    'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n', 'О': 'o',
    'П': 'p', 'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Х': 'x',
    'Ъ': '', 'Ы': 'y', 'Ь': '', 'Э': 'e',
    'ә': 'a', 'і': 'i', 'ң': 'n', 'ү': 'u', 'ұ': 'u', 'һ': 'h', 'ө': 'o',
}


def uzbek_slugify(text: str, max_length: int = 200) -> str:
    """
    O'zbek, Kirill va Lotin harflaridagi har qanday sarlavhani
    chiroyli, SEO-friendly va xavfsiz URL slug formatiga o'tkazuvchi funksiya.

    Masalan:
    - "NavDU Inkubatsiya 3-Mavsum: 45 kunlik dastur va $1,000 grant!"
      -> "navdu-inkubatsiya-3-mavsum-45-kunlik-dastur-va-1000-grant"
    - "G‘oyadan Investitsiyagacha: Navoiy cho‘lida AgroSmart loyihasi"
      -> "goyadan-investitsiyagacha-navoiy-cholida-agrosmart-loyihasi"
    - "O‘zbekiston va Sun'iy Intellekt"
      -> "ozbekiston-va-suniy-intellekt"
    """
    if not text:
        return ""

    s = str(text).strip()

    # 1. O'zbek harflari: o', O', g', G' apostroflarini to'g'ridan-to'g'ri 'o' va 'g' ga aylantirish
    s = re.sub(r'[oO]' + APOSTROPHE_CHARS, 'o', s)
    s = re.sub(r'[gG]' + APOSTROPHE_CHARS, 'g', s)

    # 2. Kirill alifbosini lotinchaga o'girish
    for cyr, lat in CYRILLIC_TO_LATIN.items():
        s = s.replace(cyr, lat)

    # 3. So'z o'rtasidagi tutuq belgilari va boshqa qolgan apostroflarni olib tashlash (ta'lim -> talim)
    s = re.sub(APOSTROPHE_CHARS, '', s)

    # 4. Raqamlar orasidagi vergullarni olib tashlash: 1,000 -> 1000
    s = re.sub(r'(\d),(\d)', r'\1\2', s)

    # 5. Unicode normalizatsiyasi (urg'u va diakritik belgilarni tozalash)
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode('utf-8')

    # 6. Harf va raqam bo'lmagan barcha belgilarni defis (-) ga almashtirish
    s = re.sub(r'[^a-zA-Z0-9]+', '-', s)

    # 7. Ketma-ket kelgan bir nechta defislarni bitta defisga qisqartirish va chetlarni tozalash
    s = re.sub(r'-+', '-', s).strip('-').lower()

    # 8. Max length cheklovi
    if len(s) > max_length:
        s = s[:max_length].rstrip('-')

    return s


def generate_unique_slug(instance, source_text: str, slug_field_name: str = 'slug', max_length: int = 200) -> str:
    """
    Model obyekti uchun takrorlanmas (unique) slug hosil qiladi.
    Agar bazada aynan shunday slug mavjud bo'lsa, oxiriga ketma-ket '-1', '-2' raqamlarini qo'shadi.
    Multi-database routing (cms_db, events_db, apps_db) to'liq qo'llab-quvvatlanadi.
    """
    base_slug = uzbek_slugify(source_text, max_length=max_length - 10)
    if not base_slug:
        base_slug = instance.__class__.__name__.lower()

    candidate = base_slug
    model_class = instance.__class__

    try:
        from django.db import router
        db = (getattr(instance, '_state', None) and instance._state.db) or router.db_for_read(model_class, instance=instance)
    except Exception:
        db = 'default'

    counter = 1
    while True:
        qs = model_class.objects.using(db).filter(**{slug_field_name: candidate})
        if instance.pk:
            qs = qs.exclude(pk=instance.pk)
        
        if not qs.exists():
            return candidate

        candidate = f"{base_slug}-{counter}"
        counter += 1
