class MultiServiceRouter:
    """
    Yagona Super Admin uchun barcha bazalarni (cms_db, apps_db, events_db)
    tegishli modellarga mos ravishda yo'naltiruvchi router.
    """
    route_app_labels = {
        'applications': 'apps_db',
        'events': 'events_db',
    }

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return self.route_app_labels[model._meta.app_label]
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return self.route_app_labels[model._meta.app_label]
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in self.route_app_labels:
            return db == self.route_app_labels[app_label]
        return db == 'default'
