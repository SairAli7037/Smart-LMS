# Generated by Django 5.2 on 2025-05-23 15:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0006_alter_courseenrollment_course'),
    ]

    operations = [
        migrations.AddField(
            model_name='submission',
            name='is_archived',
            field=models.BooleanField(default=False),
        ),
    ]
