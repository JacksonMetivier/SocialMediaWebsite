from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate 
import os
from flask_login import LoginManager
from flask_bootstrap import Bootstrap
from config import Config

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tehe-hehe-jehe'
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app,db)
bootstrap = Bootstrap(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

import models, routes