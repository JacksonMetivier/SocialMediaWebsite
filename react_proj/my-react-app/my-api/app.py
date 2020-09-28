from init import app
from config import Config

app.config['SECRET_KEY'] = 'tehe-hehe-jehe'
app.config.from_object(Config)
FLASK_APP = app

import models, routes

if __name__ == '__main__':
    app.run(debug='True')