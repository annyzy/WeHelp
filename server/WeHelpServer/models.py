from django.db import models
#from django.core.validators import int_list_validator
from django.template.defaultfilters import slugify


class User(models.Model):
    coins = models.IntegerField()
    icon = models.CharField(max_length=4096)
    rating = models.FloatField()
    num_rating = models.IntegerField(default=0)
    create_date = models.DateTimeField()
    last_freecoin = models.DateTimeField(default=create_date)
    email = models.EmailField()
    name = models.CharField(max_length=64, default='')
    #chatList = models.CharField(validators=int_list_validator)
    chatList = models.CharField(max_length=4096, default='')


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=1024)
    date = models.DateTimeField()
    chat = models.ForeignKey(
        'Chat', on_delete=models.CASCADE, related_name='chat_message')


class Chat(models.Model):
    a = models.ForeignKey(User, on_delete=models.CASCADE,
                          related_name='user_chat_a')
    b = models.ForeignKey(User, on_delete=models.CASCADE,
                          related_name='user_chat_b')
    last_message = models.ForeignKey(
        Message, on_delete=models.CASCADE, related_name='message_chat')
    #message_list = models.CharField(validator=int_list_validator)
<<<<<<< HEAD
=======
    message_list = models.CharField(max_length=4096)


class Post(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(lable = 'Please put your request title here.', max_lenth=512)
    body = models.CharField(lable = 'Your content here.', max_length=4000)
    #pictures = forms.ImageField(max_length=4095)


def get_image_filename(instance, filename):
    title = instance.post.title
    slug = slugify(title)
    return "post_images/%s-%s" % (slug, filename)


class Images(models.Model):
    post = models.ForeignKey(Post, default=None)
    image = models.ImageField(upload_to=get_image_filename, verbose_name='Image')

>>>>>>> post tasks
