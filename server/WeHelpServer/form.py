from django import forms
from WeHelpServer.models import Post, Images



#frontend
# {% if form.is_multipart %}
#     <form enctype="multipart/form-data" method="post" action="/foo/">
# {% else %}
#     <form method="post" action="/foo/">
# {% endif %}
# {{ form }}
# </form>

#html
# <form action = "" method = "get">
# <label for="title">Title: </label>
# <input id="title" type="text" name="title" maxlength="512" required>

# <label for="body">Content: </label>
# <input id="body" type="text" name="body" maxlength="4000" required>

# <label for="picture">Title: </label>
# <input id="title" type="text" name="title" maxlength="512" required>
# </form>

class PostForm(forms.ModelForm):
    title = forms.CharField(lable="Please put your request title here.", max_lenth=512)
    body = forms.CharField(lable="Your content here.", max_length=4000)

    class Pform:
        model = Post
        fields = ('title', 'body',)


class ImagesForm(forms.ModelForm):
    image = forms.ImageField(label='Image')

    class Iform:
        model = Images
        fields = ('image',)