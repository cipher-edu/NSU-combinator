from rest_framework.renderers import JSONRenderer


class UnifiedJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context.get('response')
        if response is None:
            return super().render(data, accepted_media_type, renderer_context)

        if response.status_code < 400:
            payload = {'success': True, 'data': data}
        elif isinstance(data, dict):
            payload = {
                'success': False,
                'code': data.get('code', 'ERROR'),
                'message': data.get('message', 'Xato yuz berdi'),
                'errors': data.get('errors'),
            }
        else:
            payload = {'success': False, 'code': 'ERROR', 'message': str(data)}
        return super().render(payload, accepted_media_type, renderer_context)
