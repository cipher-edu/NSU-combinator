from rest_framework.permissions import BasePermission, SAFE_METHODS


def has_capability(user, cap: str) -> bool:
    if not user or not user.is_authenticated:
        return False
    if getattr(user, 'role', None) in ('admin', 'superadmin'):
        return True
    return user.capabilities.filter(capability=cap).exists()


class IsAdminOps(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('admin', 'superadmin')
        )


class IsSuperadmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'superadmin'
        )


class IsReviewer(BasePermission):
    def has_permission(self, request, view):
        return has_capability(request.user, 'reviewer') or IsAdminOps().has_permission(request, view)


class IsFacultyCap(BasePermission):
    def has_permission(self, request, view):
        return has_capability(request.user, 'faculty') or IsAdminOps().has_permission(request, view)


class IsTeamLead(BasePermission):
    """Object-level: team yoki application.team."""

    def has_object_permission(self, request, view, obj):
        team = getattr(obj, 'team', obj)
        return team.memberships.filter(
            user=request.user, role='lead', left_at__isnull=True
        ).exists()


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
