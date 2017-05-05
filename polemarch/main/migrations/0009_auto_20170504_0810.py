# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-04 08:10
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_auto_20170503_0516'),
    ]

    operations = [
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.AutoField(max_length=20, primary_key=True, serialize=False)),
                ('playbook', models.CharField(max_length=256)),
                ('start_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('stop_time', models.DateTimeField(blank=True, null=True)),
                ('raw_stdout', models.TextField()),
                ('raw_inventory', models.TextField()),
                ('status', models.CharField(max_length=50)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', related_query_name='history', to='main.Project')),
            ],
            options={
                'default_related_name': 'history',
            },
        ),
        migrations.AlterField(
            model_name='typespermissions',
            name='groups',
            field=models.ManyToManyField(blank=True, null=True, related_name='related_objects', related_query_name='related_objects', to='main.Group'),
        ),
        migrations.AlterField(
            model_name='typespermissions',
            name='hosts',
            field=models.ManyToManyField(blank=True, null=True, related_name='related_objects', related_query_name='related_objects', to='main.Host'),
        ),
        migrations.AlterField(
            model_name='typespermissions',
            name='inventories',
            field=models.ManyToManyField(blank=True, null=True, related_name='related_objects', related_query_name='related_objects', to='main.Inventory'),
        ),
        migrations.AlterField(
            model_name='typespermissions',
            name='periodic_tasks',
            field=models.ManyToManyField(blank=True, null=True, related_name='related_objects', related_query_name='related_objects', to='main.PeriodicTask'),
        ),
        migrations.AlterField(
            model_name='typespermissions',
            name='projects',
            field=models.ManyToManyField(blank=True, null=True, related_name='related_objects', related_query_name='related_objects', to='main.Project'),
        ),
        migrations.AlterField(
            model_name='typespermissions',
            name='tasks',
            field=models.ManyToManyField(blank=True, null=True, related_name='related_objects', related_query_name='related_objects', to='main.Task'),
        ),
        migrations.AlterIndexTogether(
            name='history',
            index_together=set([('id', 'project', 'playbook', 'status', 'start_time', 'stop_time')]),
        ),
    ]
