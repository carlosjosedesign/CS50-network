from django.contrib import admin
from .models import User, Post, Comment, Like, Profile, Following

# Register your models here.
class ProfileAdmin(admin.TabularInline):
    """Creates an inline for Profile to hook it to User admin page"""
    model = Profile

class UserAdmin(admin.ModelAdmin):
    """Contains User model admin page config + Profile hooked"""
    list_display = ("id", "username", "email", "password")
    # Hook Profile to User admin page
    inlines = [ProfileAdmin]


class PostAdmin(admin.ModelAdmin):
    """Contains Post model admin page config"""
    list_display = ("id", "user", "content", "date")

class CommentAdmin(admin.ModelAdmin):
    """Contains Comment model admin page config"""
    list_display = ("id", "user", "post", "content", "date")

class LikeAdmin(admin.ModelAdmin):
    """Contains Like model admin page config"""
    list_display = ("id", "user", "post", "comment")

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Like, LikeAdmin)
admin.site.register(Following)
