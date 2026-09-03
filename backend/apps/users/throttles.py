from rest_framework.throttling import SimpleRateThrottle


class AuthEmailThrottle(SimpleRateThrottle):
    scope = 'auth'

    def get_cache_key(self, request, view):
        email = (request.data.get('email') or '').lower()
        ident = f'{self.get_ident(request)}:{email}'
        return self.cache_format % {'scope': self.scope, 'ident': ident}


class OtpVerifyThrottle(SimpleRateThrottle):
    scope = 'otp_verify'

    def get_cache_key(self, request, view):
        return self.cache_format % {'scope': self.scope, 'ident': self.get_ident(request)}
