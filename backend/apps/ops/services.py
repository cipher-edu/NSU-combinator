import re
from django.conf import settings
from django.db.models import F
from django.utils import timezone
from django.utils.text import slugify

from apps.users.models import User
from .models import Campaign, CampaignHit, Lead


def unique_slug(model, base, field='slug'):
    raw = slugify(base) or 'item'
    raw = raw[:40]
    slug = raw
    i = 1
    while model.objects.filter(**{field: slug}).exists():
        i += 1
        slug = f'{raw}-{i}'
    return slug


def unique_code(base):
    raw = re.sub(r'[^a-z0-9-]', '', (slugify(base) or 'c'))[:28] or 'c'
    code = raw
    i = 1
    while Campaign.objects.filter(code=code).exists():
        i += 1
        code = f'{raw}-{i}'[:32]
    return code


def record_hit(campaign: Campaign, request=None, user=None):
    ip = None
    ua = ''
    if request is not None:
        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))
        if ip:
            ip = ip.split(',')[0].strip()
        ua = (request.META.get('HTTP_USER_AGENT') or '')[:300]
    CampaignHit.objects.create(campaign=campaign, ip=ip or None, user_agent=ua, user=user)
    Campaign.objects.filter(pk=campaign.pk).update(clicks=F('clicks') + 1)
    campaign.refresh_from_db(fields=['clicks'])
    return campaign


def campaign_redirect(campaign: Campaign) -> str:
    if campaign.destination == Campaign.Destination.TELEGRAM:
        bot = (settings.TELEGRAM_BOT_USERNAME or '').lstrip('@')
        if bot:
            return f'https://t.me/{bot}?start=c_{campaign.code}'
    return f'/apply?src={campaign.code}'


def get_or_create_lead(*, email, defaults=None):
    email = (email or '').strip().lower()
    if not email:
        return None, False
    defaults = defaults or {}
    lead = Lead.objects.filter(email=email).exclude(status=Lead.Status.CONVERTED).order_by('-created_at').first()
    if lead:
        changed = False
        for k, v in defaults.items():
            if v and not getattr(lead, k):
                setattr(lead, k, v)
                changed = True
        if changed:
            lead.save()
        return lead, False
    existing = Lead.objects.filter(email=email, status=Lead.Status.CONVERTED).first()
    if existing and not defaults.get('force_new'):
        return existing, False
    defaults.pop('force_new', None)
    lead = Lead.objects.create(email=email, **defaults)
    return lead, True


def attribute_user(user: User, code: str):
    if not code:
        return None
    campaign = Campaign.objects.filter(code=code, is_active=True).first()
    source = campaign.channel if campaign else Lead.Source.SITE
    if source not in Lead.Source.values:
        source = Lead.Source.SITE
    lead, _ = get_or_create_lead(
        email=user.email,
        defaults={
            'name': user.name,
            'phone': user.phone,
            'faculty': user.faculty,
            'affiliation': user.affiliation,
            'campaign': campaign,
            'source': source,
            'status': Lead.Status.CONTACTED,
            'converted_user': user,
        },
    )
    return lead


def convert_lead(lead: Lead, actor=None):
    user = User.objects.filter(email=lead.email).first()
    if not user:
        extra = {}
        if lead.affiliation:
            extra['affiliation'] = lead.affiliation
        if lead.faculty_id:
            extra['faculty_id'] = lead.faculty_id
        user = User.objects.create_user(
            email=lead.email,
            name=lead.name or lead.email.split('@')[0],
            phone=lead.phone,
            **extra,
        )
    lead.status = Lead.Status.CONVERTED
    lead.converted_user = user
    lead.converted_at = timezone.now()
    if actor and not lead.owner_id:
        lead.owner = actor
    lead.save()
    return lead, user


def ingest_leads():
    created = 0
    incomplete = User.objects.filter(role='applicant', is_active=True)
    for user in incomplete.iterator():
        if user.profile_complete:
            continue
        _, is_new = get_or_create_lead(
            email=user.email,
            defaults={
                'name': user.name,
                'phone': user.phone,
                'faculty': user.faculty,
                'affiliation': user.affiliation,
                'source': Lead.Source.INGEST,
                'status': Lead.Status.NEW,
                'converted_user': user,
                'idea': 'Profil tugallanmagan',
            },
        )
        if is_new:
            created += 1

    from apps.applications.models import Application

    drafts = Application.objects.filter(status='draft').select_related('team')
    for app in drafts:
        lead_m = app.team.memberships.filter(role='lead', left_at__isnull=True).select_related('user').first()
        if not lead_m:
            continue
        u = lead_m.user
        _, is_new = get_or_create_lead(
            email=u.email,
            defaults={
                'name': u.name,
                'phone': u.phone,
                'faculty': u.faculty,
                'affiliation': u.affiliation,
                'source': Lead.Source.INGEST,
                'status': Lead.Status.NURTURING,
                'converted_user': u,
                'idea': f'Draft ariza: {app.team.name}',
            },
        )
        if is_new:
            created += 1
    return created
