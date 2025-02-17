# Generated by Django 3.0.5 on 2020-12-01 05:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coins', models.IntegerField()),
                ('icon', models.CharField(max_length=4096)),
                ('rating', models.FloatField()),
                ('num_rating', models.IntegerField(default=0)),
                ('create_date', models.DateTimeField()),
                ('last_freecoin', models.DateTimeField(default=models.DateTimeField())),
                ('email', models.EmailField(max_length=254)),
                ('name', models.CharField(default='', max_length=64)),
                ('chatList', models.CharField(default='', max_length=4096)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128)),
                ('body', models.CharField(max_length=4096)),
                ('images', models.CharField(max_length=4096)),
                ('datetime', models.DateTimeField()),
                ('activate', models.BooleanField()),
                ('cost', models.IntegerField()),
                ('acceptor', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='accept_task', to='WeHelpServer.User')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='publish_task', to='WeHelpServer.User')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=1024)),
                ('date', models.DateTimeField()),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat_message', to='WeHelpServer.Chat')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='WeHelpServer.User')),
            ],
        ),
        migrations.AddField(
            model_name='chat',
            name='a',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_chat_a', to='WeHelpServer.User'),
        ),
        migrations.AddField(
            model_name='chat',
            name='b',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_chat_b', to='WeHelpServer.User'),
        ),
        migrations.AddField(
            model_name='chat',
            name='last_message',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='message_chat', to='WeHelpServer.Message'),
        ),
    ]
