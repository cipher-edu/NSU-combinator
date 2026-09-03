import nh3

ALLOWED_TAGS = {'p', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'em', 'strong', 'blockquote'}
ALLOWED_ATTR = {'a': {'href', 'title'}}


def sanitize_html(html: str) -> str:
    if not html:
        return ''
    return nh3.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTR,
        url_schemes={'http', 'https', 'mailto'},
    )
