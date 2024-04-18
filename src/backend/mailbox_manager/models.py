"""
Declare and configure the models for the People additional application : mailbox_manager
"""

from django.conf import settings
from django.core import validators
from django.db import models
from django.utils.translation import gettext_lazy as _

from core.models import BaseModel, RoleChoices


class MailDomain(BaseModel):
    """Domain names from which we will create email addresses (mailboxes)."""

    name = models.CharField(
        _("name"), max_length=150, null=False, blank=False, unique=True
    )

    class Meta:
        db_table = "people_mail_domain"
        verbose_name = _("Mail domain")
        verbose_name_plural = _("Mail domains")

    def __str__(self):
        return self.name


class MailDomainAccess(BaseModel):
    """Allow to manage users' accesses to mail domains."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mail_domain_accesses",
        null=False,
        blank=False,
    )
    domain = models.ForeignKey(
        MailDomain,
        on_delete=models.CASCADE,
        related_name="mail_domain_accesses",
        null=False,
        blank=False,
    )
    role = models.CharField(
        max_length=20, choices=RoleChoices.choices, default=RoleChoices.MEMBER
    )

    class Meta:
        db_table = "people_mail_domain_accesses"
        verbose_name = _("User/mail domain relation")
        verbose_name_plural = _("User/mail domain relations")
        unique_together = ("user", "domain")

    def __str__(self):
        return f"Access of user {self.user} on domain {self.domain}."


class Mailbox(BaseModel):
    """Mailboxes for users from mail domain."""

    local_part = models.CharField(
        _("local_part"),
        max_length=150,
        null=False,
        blank=False,
        validators=[validators.RegexValidator(regex="^[a-zA-Z0-9_.+-]+$")],
    )
    domain = models.ForeignKey(
        MailDomain,
        on_delete=models.CASCADE,
        related_name="mail_domain",
        null=False,
        blank=False,
    )
    secondary_email = models.EmailField(
        _("secondary email address"), null=False, blank=False
    )

    class Meta:
        db_table = "people_mail_box"
        verbose_name = _("Mailbox")
        verbose_name_plural = _("Mailboxes")
        unique_together = ("local_part", "domain")

    def __str__(self):
        return f"{self.local_part!s}@{self.domain.name:s}"
