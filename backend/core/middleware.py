from django.urls import Resolver404, resolve


class SilentAppendSlashMiddleware:
    """APPEND_SLASH o‘rniga ichki rewrite.

    Next.js `/api/:path*` rewrite oxirgi slashni tashlaydi, Django esa
    301 bilan qayta qo‘yadi — brauzer ikkalasini quvib ERR_TOO_MANY_REDIRECTS
    oladi. Mos URL topilsa, path_info ni o‘zgartiramiz, redirect yo‘q.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path_info
        if path != '/' and not path.endswith('/'):
            last = path.rsplit('/', 1)[-1]
            if '.' not in last:
                try:
                    resolve(path)
                except Resolver404:
                    slashed = path + '/'
                    try:
                        resolve(slashed)
                    except Resolver404:
                        pass
                    else:
                        request.path_info = slashed
        return self.get_response(request)
