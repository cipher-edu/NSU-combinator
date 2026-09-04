import re
import nh3

ALLOWED_TAGS = {
    'p', 'br', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'code', 'pre',
    'em', 'strong', 'b', 'i', 'u', 's', 'blockquote', 'img', 'hr', 'span',
    'iframe', 'video', 'audio', 'source', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'td', 'th', 'div',
}
ALLOWED_ATTR = {
    'a': {'href', 'title', 'target', 'download'},
    'img': {'src', 'alt', 'title'},
    'iframe': {'src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title'},
    'video': {'src', 'controls', 'width'},
    'audio': {'src', 'controls'},
    'source': {'src', 'type'},
    'td': {'colspan', 'rowspan'},
    'th': {'colspan', 'rowspan'},
    'div': {'class'},
    'p': {'class'},
}


_REL = 'https://nsu.media.local'


def sanitize_html(html: str) -> str:
    if not html:
        return ''
    prefixed = re.sub(
        r'((?:src|href)\s*=\s*["\'])(/media/)',
        rf'\1{_REL}\2',
        html,
        flags=re.I,
    )
    try:
        cleaned = nh3.clean(
            prefixed,
            tags=ALLOWED_TAGS,
            attributes=ALLOWED_ATTR,
            url_schemes={'http', 'https', 'mailto'},
            link_rel=None,
        )
    except Exception:
        cleaned = nh3.clean(prefixed, tags=ALLOWED_TAGS, url_schemes={'http', 'https', 'mailto'})
    return cleaned.replace(_REL + '/media/', '/media/')
