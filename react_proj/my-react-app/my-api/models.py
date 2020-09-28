from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField
from flask_login import LoginManager, login_user, logout_user,login_required, UserMixin,current_user
from wtforms.validators import DataRequired, ValidationError, Email, EqualTo, Length
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from init import db

followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'))
)

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key = True)
    first_name = db.Column(db.String(24), index = True)
    last_name = db.Column(db.String(24), index = True)
    where_from = db.Column(db.String(50), index = True)
    email = db.Column(db.String(72), index = True)
    password_hash = db.Column(db.String(128))
    posts = db.relationship('Post', backref='user',lazy='dynamic')
    profile_picture = db.relationship('Files', backref = 'user')
    phone = db.Column(db.Unicode(255))
    dob = db.Column(db.DateTime)
    about_me = db.Column(db.String(200))
    liked = db.relationship(
        'PostLike',
        foreign_keys='PostLike.user_id',
        backref='user', lazy='dynamic')

    followed = db.relationship(
        'User', secondary = followers,
        primaryjoin = (followers.c.follower_id == id),
        secondaryjoin = (followers.c.followed_id == id),
        backref = db.backref('followers', lazy='dynamic'), lazy = 'dynamic')

    def like_post(self, post):
        if not self.has_liked_post(post):
            like = PostLike(user_id=self.id, post_id=post.id)
            db.session.add(like)

    def unlike_post(self, post):
        if self.has_liked_post(post):
            PostLike.query.filter_by(
                user_id=self.id,
                post_id=post.id).delete()

    def has_liked_post(self, post):
        return PostLike.query.filter(
            PostLike.user_id == self.id,
            PostLike.post_id == post.id).count() > 0

    def dislike_post(self, post):
        if not self.has_disliked_post(post):
            dislike = PostDislike(user_id=self.id, post_id=post.id)
            db.session.add(dislike)

    def undislike_post(self, post):
        if self.has_disliked_post(post):
            PostDislike.query.filter_by(
                user_id=self.id,
                post_id=post.id).delete()

    def has_disliked_post(self, post):
        return PostDislike.query.filter(
            PostDislike.user_id == self.id,
            PostDislike.post_id == post.id).count() > 0
       
    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)

    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)

    def is_following(self, user):
        return self.followed.filter(
            followers.c.followed_id == user.id).count() > 0

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return '<User {}>'.format(self.first_name)


class Post(db.Model):
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key = True)
    post = db.Column(db.String(10000))
    timestamp = db.Column(db.DateTime, index = True, default = datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    likes = db.relationship('PostLike', backref='post', lazy='dynamic')
    dislikes = db.relationship('PostDislike', backref='post', lazy='dynamic')

    def __repr__(self):
        return '<Post likes {}>'.format(self.likes.all())

class PostLike(db.Model):
    __tablename__ = 'post_like'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))

class PostDislike(db.Model):
    __tablename__ = 'post_dislike'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))

class Files(db.Model):
    __tablename__ = 'files'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(200))
    data = db.Column(db.LargeBinary)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<File {}>'.format(self.user_id)
