from rest_framework import serializers
from .models import Application, ApplicationEvent
from .schema import step_progress


class ApplicationEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationEvent
        fields = ('id', 'from_status', 'to_status', 'note', 'created_at')


class ApplicationSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    track_slug = serializers.CharField(source='track.slug', read_only=True)
    season_slug = serializers.CharField(source='season.slug', read_only=True)
    has_deck = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()
    current_step = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    events = ApplicationEventSerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = (
            'id', 'season', 'season_slug', 'team', 'team_name', 'track', 'track_slug',
            'faculty', 'status', 'submitted_at',
            'problem', 'solution', 'stage', 'why_us', 'faculty_endorsement_name',
            'demo_url', 'video_url', 'has_deck', 'extra', 'answers', 'current_step',
            'progress', 'events', 'created_at', 'updated_at',
        )
        read_only_fields = (
            'id', 'season', 'team', 'faculty', 'status', 'submitted_at', 'created_at', 'updated_at',
        )

    def get_has_deck(self, obj):
        return bool(obj.pitch_deck)

    def _extra(self, obj):
        return obj.extra if isinstance(obj.extra, dict) else {}

    def get_answers(self, obj):
        return (self._extra(obj).get('answers') or {})

    def get_current_step(self, obj):
        return int(self._extra(obj).get('current_step') or 1)

    def get_progress(self, obj):
        return step_progress(self.get_answers(obj))

    def validate_problem(self, value):
        if value and len(value) > 4000:
            raise serializers.ValidationError('4000 belgidan oshmasin')
        return value

    def validate_solution(self, value):
        if value and len(value) > 4000:
            raise serializers.ValidationError('4000 belgidan oshmasin')
        return value

    def validate_extra(self, value):
        if value is None:
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError('extra obyekt bo‘lsin')
        return value

    def update(self, instance, validated_data):
        incoming = validated_data.pop('extra', None)
        if incoming is not None:
            extra = instance.extra if isinstance(instance.extra, dict) else {}
            answers = extra.get('answers') or {}
            if isinstance(incoming.get('answers'), dict):
                answers = {**answers, **incoming['answers']}
            if 'current_step' in incoming:
                extra['current_step'] = incoming['current_step']
            extra['answers'] = answers
            instance.extra = extra
            a = answers
            if a.get('problem'):
                instance.problem = a['problem']
            if a.get('solution'):
                instance.solution = a['solution']
            if a.get('why_us'):
                instance.why_us = a['why_us']
            if a.get('product_stage'):
                instance.stage = a['product_stage']
            demo = str(a.get('demo_url') or '').strip()
            if demo.startswith('http://') or demo.startswith('https://'):
                instance.demo_url = demo
            video = str(a.get('video_url') or '').strip()
            if video.startswith('http://') or video.startswith('https://'):
                instance.video_url = video
            if a.get('endorsement'):
                instance.faculty_endorsement_name = str(a['endorsement'])[:150]
            if a.get('track'):
                instance.track_id = a['track']
            if a.get('one_liner') and instance.team_id:
                team = instance.team
                if not team.one_liner_uz:
                    team.one_liner_uz = str(a['one_liner'])[:240]
                    team.save(update_fields=['one_liner_uz'])
        return super().update(instance, validated_data)
