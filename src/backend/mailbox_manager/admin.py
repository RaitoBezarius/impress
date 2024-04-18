"""Admin classes and registrations for People's mailbox manager app."""

from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from mailbox_manager import models


@admin.register(models.MailDomain)
class MailDomainAdmin(admin.ModelAdmin):
    """Mail domain admin interface declaration."""

    list_display = (
        "name",
        "created_at",
        "updated_at",
    )
    search_fields = ("name",)
    readonly_fields = ["created_at"]


@admin.register(models.MailDomainAccess)
class MailDomainAccessAdmin(admin.ModelAdmin):
    """Admin for mail domain accesses model."""

    list_display = ("user", "domain")


@admin.register(models.Mailbox)
class MailboxAdmin(admin.ModelAdmin):
    """Admin for mailbox model."""

    list_display = ("__str__", "domain")
