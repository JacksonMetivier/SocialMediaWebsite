from flask import Flask, request, jsonify, send_file
from flask import render_template, flash, redirect, url_for
from flask_login import login_user, logout_user, login_required, UserMixin, current_user
import os
from werkzeug.urls import url_parse
from hashlib import md5
import logging
from logging.handlers import SMTPHandler
from flask_mail import Mail, Message
import jwt
from threading import Thread
from wtforms.validators import DataRequired, ValidationError, Email, EqualTo, Length
from flask_bootstrap import Bootstrap
from init import app, db
from init import login_manager
from models import User, Post, Files
import ast
from io import BytesIO, StringIO
import requests
import numpy as np
from datetime import datetime


def validate_username(data):
    user = User.query.filter_by(username=data['username']).first()
    if user is not None:
        return True
    else:
        return False


def validate_email(data):
    user = User.query.filter_by(email=data["email"]).first()
    if user is not None:
        return True
    else:
        return False


def error_handler(errors):
    errors['error'] = True
    response = jsonify(errors)
    response.status_code = 500
    return response


def succesful_response(message):
    message['error'] = False
    response = jsonify(message)
    response.status_code = 200
    return response


@app.route('/')
def home():
    return {'data': 'home page'}


@app.route('/files', methods=['GET', 'POST'])
def files():
    if request.method == "POST":
        if current_user.is_authenticated == True:
            try:
                pic_file = request.files['file']
                print(pic_file)
                new_file = Files(name=pic_file.filename,
                                 data=pic_file.read(), user=current_user)
                db.session.add(new_file)
                db.session.commit()
                print(pic_file.filename + 'saved!')
                return succesful_response({'message': 'Great Success!'})
            except:
                return succesful_response({'message': 'No picture selected'})
        return "Bad things"


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        decode_request = request.data.decode('utf8')
        data = ast.literal_eval(decode_request)
        errors = {}
        print(data)
        if validate_email(data):
            errors['email'] = 'Email is already registered'
            return error_handler(errors)

        user = User(
            first_name=data['firstName'],
            last_name=data['lastName'],
            where_from=data['whereFrom'],
            email=data['email'],
            phone=data['phone'],
            dob=datetime(int(data['yearOfBirth']), int(
                data['monthOfBirth']), int(data['dayOfBirth'])),
            about_me=data['aboutMe']
        )

        user.set_password(data['password2'])

        db.session.add(user)
        db.session.commit()

        login_user(user)

        return succesful_response({'message': 'Great Success!'})


@app.route('/register-validation', methods=['GET', 'POST'])
def register1():
    if request.method == "POST":
        decode_request = request.data.decode('utf8')
        data = ast.literal_eval(decode_request)
        errors = {}
        if validate_email(data):
            errors['email'] = 'Email is already registered'
            return error_handler(errors)
        return succesful_response({'message': 'Great Success!'})


@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if current_user is not None:
            if current_user.is_authenticated:
                return jsonify({"loggedIn": "User is already logged in.. and that okay.."})
        return jsonify({'message': 'A GET request was made...'})
    errors = {}
    if request.method == 'POST':
        if current_user.is_authenticated:
            return jsonify({"message": "User needs to be redirected somewhere"})
        decode_request = request.data.decode('utf8')
        data = ast.literal_eval(decode_request)
        print(data)
        user = User.query.filter_by(email=data['email']).first()
        if user is None or user.check_password(data['password']) is False:
            errors['login'] = 'Incorrect Email or Password'
            return error_handler(errors)
        else:
            login_user(user)
            return succesful_response({'message': 'Great Success!'})
        errors['login'] = 'An unknown error occured :(.'
        return error_handler(errors)


@app.route('/logout')
def logout():
    logout_user()
    return jsonify({'loggedIn': False})


@app.route('/blog', methods=['GET', 'POST'])
@login_required
def blog():
    if request.method == 'POST':
        decode_request = request.data.decode('utf8')
        data = ast.literal_eval(decode_request)
        post = Post(post=data["post"], user_id=current_user.id)
        db.session.add(post)
        db.session.commit()
        return succesful_response({'message': 'Great Success!'})
    if request.method == 'GET':
        posts = Post.query.order_by(Post.timestamp.desc()).all()
        data = []
        user_did_like = False
        user_did_dislike = False
        for post in posts:
            user = User.query.filter_by(id=post.user_id).first_or_404()
            for like in post.likes.all():
                if current_user.id == like.user_id:
                    user_did_like = True
                    user_did_dislike = False
            for dislike in post.dislikes.all():
                if current_user.id == dislike.user_id:
                    user_did_dislike = True
                    user_did_like = False

            data.append({
                'postId': post.id,
                'userId': user.id,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'post': post.post,
                'time': post.timestamp,
                'likes': len(post.likes.all()),
                'dislikes': len(post.dislikes.all()),
                'userDidLike':user_did_like,
                'userDidDislike':user_did_dislike
            })

            print(post)
        return {'data': data}


@app.route('/newPost', methods=['GET', 'POST'])
@login_required
def newPost():
    if request.method == 'GET':
        new_post = Post.query.filter_by(user_id=current_user.id).order_by(
            Post.timestamp.desc()).first()
        user = User.query.filter_by(id=new_post.user_id).first_or_404()
        data = {
            'postId': new_post.id,
            'userId': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'post': new_post.post,
            'time': new_post.timestamp,
        }
        return data


@app.route('/profile_picture/<_user_id>', methods=['GET'])
@login_required
def profile_picture(_user_id):
    if request.method == 'GET':
        if _user_id == 'none':
            profile_picture = Files.query.filter_by(
                user_id=current_user.id).first()
            if profile_picture is not None:
                return send_file(BytesIO(profile_picture.data), attachment_filename='picture.jpg')
            return send_file(StringIO(''),attachment_filename='dafault.txt')
        else:
            profile_picture = Files.query.filter_by(
                user_id=_user_id).first()
            if profile_picture is not None:
                return send_file(BytesIO(profile_picture.data), attachment_filename='picture.jpg')
            print('no picture')
            return send_file(StringIO(''),attachment_filename='dafault.txt')


@app.route('/profile/<_user_id>', methods=['GET'])
@login_required
def profile(_user_id):
        if request.method == 'GET':
            if _user_id == 'none':
                user = User.query.filter_by(id=current_user.id).first()
                posts = Post.query.filter_by(user_id=current_user.id).all()
                posts = [post.post for post in posts]
                data = {}
                data['email'] = user.email
                data['first_name'] = user.first_name
                data['last_name'] = user.last_name
                data['about_me'] = user.about_me
                data['phone'] = user.phone
                data['DOB'] = user.dob.strftime("%d %B, %Y")
                data['where_from'] = user.where_from
                return data
            else:
                user = User.query.filter_by(id=_user_id).first()
                posts = Post.query.filter_by(user_id=_user_id).all()
                posts = [post.post for post in posts]
                data = {}
                data['email'] = user.email
                data['first_name'] = user.first_name
                data['last_name'] = user.last_name
                data['about_me'] = user.about_me
                data['phone'] = user.phone
                data['DOB'] = user.dob.strftime("%d %B, %Y")
                data['where_from'] = user.where_from
                return data

@app.route('/follow/<_user_id>', methods = ['GET', 'POST'])
@login_required
def follow(_user_id):
    if request.method == 'POST':
        user = user.query.filter_by(id = _user_id).first_or_404()
        if user == current_user:
            return error_handler({'message':"You can't follow yourself!"})
        current_user.follow(user)
        db.session.coimmit()
        return succesful_response({'message': 'Great Success!'})
    if request.method == 'GET':
        followed = current_user.followed
        print(followed)
        return ':)'




@app.route('/profile_posts/<_user_id>', methods=['GET'])
@login_required
def profile_posts(_user_id):
    if request.method == 'GET':
        if _user_id == 'none':
            posts = Post.query.filter_by(user_id=current_user.id).order_by(
                Post.timestamp.desc()).all()
            data = []
            for post in posts:
                data.append({
                    'postId': post.id,
                    'firstName': current_user.first_name,
                    'lastName': current_user.last_name,
                    'post': post.post,
                    'time': post.timestamp,
                })
            return {'data': data}
        else:
            posts = Post.query.filter_by(user_id=_user_id).order_by(
                Post.timestamp.desc()).all()
            data = []
            user = User.query.filter_by(id=_user_id).first_or_404()
            for post in posts:
                data.append({
                    'postId': post.id,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'post': post.post,
                    'time': post.timestamp,
                })
            return {'data': data}

@app.route('/like/<int:post_id>/<action>', methods=['GET', 'POST'])
@login_required
def like_action(post_id, action):
    post = Post.query.filter_by(id=post_id).first_or_404()
    if request.method == 'POST':
        if action == 'like':
            if current_user.has_disliked_post(post):
                current_user.undislike_post(post)
                db.session.commit()

            if current_user.has_liked_post(post):
                current_user.unlike_post(post)
                db.session.commit()

            else:
                print('like')
                current_user.like_post(post)
                db.session.commit()

            return succesful_response({'message': 'Great Success!'})

        if action == 'dislike':
            if current_user.has_liked_post(post):
                current_user.unlike_post(post)
                db.session.commit()

            if current_user.has_disliked_post(post):
                current_user.undislike_post(post)
                db.session.commit()

            else:
                current_user.dislike_post(post)
                db.session.commit()

            return succesful_response({'message': 'Great Success!'})

    if request.method == 'GET':
        if current_user.has_liked_post(post):
            liked = True
            disliked = False
        elif current_user.has_disliked_post(post):
            liked = False
            disliked = True
        else:
            liked = False
            disliked = False

        data = {
            'likes': post.likes.count(),
            'dislikes': post.dislikes.count(),
            'liked': liked,
            'disliked': disliked
        }
        return data

# @app.route('/profile/<', methods=['GET', 'POST'])
# @login_required
# def like_action(post_id, action):