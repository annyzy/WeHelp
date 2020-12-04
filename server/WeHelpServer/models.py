from django.db import models
#from django.core.validators import int_list_validator

# === Models for WeHelp ===


# === User ===
class User(models.Model):
    """
    The User class defines the components of users
    1. ***coins*** - Specify the number of inapp currency that the users have
    2. ***icon*** - pictures of users' icons
    3. ***rating*** - users ratings
    4. ***num_rating*** - the number of rating that users received
    5. ***create_date*** - account signup date
    6. ***last_freecoin*** - coins earn by logging in
    7. ***email*** - email address of the account
    8. ***name*** - username
    9. ***chatList*** - message lists of users
    """

    coins = models.IntegerField()
    icon = models.CharField(max_length=4096)
    rating = models.FloatField()
    num_rating = models.IntegerField(default=0)
    create_date = models.DateTimeField()
    last_freecoin = models.DateTimeField(default=create_date)
    email = models.EmailField()
    name = models.CharField(max_length=64, default='')
    chatList = models.CharField(max_length=4096, default='')

# === Message ===
class Message(models.Model):
    """
    The Message class defines the components messages received.
    1. ***sender*** - specifies the sender of the messages
    2. ***message*** - message contents
    3. ***date*** - date of messages sent
    4. ***chat*** - chat messages
    """
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=1024)
    date = models.DateTimeField()
    chat = models.ForeignKey(
        'Chat', on_delete=models.CASCADE, related_name='chat_message')

# === Chat ===
class Chat(models.Model):
    """
    The Chat class defines components of a chat between two users.
    1. ***a*** - user a in the chat
    2. ***b*** - user b in the chat
    3. ***last_message*** -
    """
    a = models.ForeignKey(User, on_delete=models.CASCADE,
                          related_name='user_chat_a')
    b = models.ForeignKey(User, on_delete=models.CASCADE,
                          related_name='user_chat_b')
    last_message = models.ForeignKey(
        Message, on_delete=models.CASCADE, related_name='message_chat')


class Task(models.Model):
    """
    The Task class defines the components of a posted task
    1. ***user*** - user who posted the task
    2. ***title*** - title of the task
    3. ***body*** - the content of the task
    4. ***acceptor*** - the user who accepted the task
    5. ***images*** - images of the task
    6. ***datetime*** - posted date and time of the task
    7. ***active*** - active state of the task, whether the task is taken or not
    8. ***cost*** - coins provided for the task
    """
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='publish_task')
    title = models.CharField(max_length=128)
    body = models.CharField(max_length=4096)
    acceptor = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, related_name='accept_task')
    images = models.CharField(max_length=4096)
    datetime = models.DateTimeField()
    active = models.BooleanField()
    cost = models.IntegerField()
