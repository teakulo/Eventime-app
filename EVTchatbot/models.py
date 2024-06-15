from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class AppEvent(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=True)
    description = db.Column(db.Text, nullable=True)
    venue = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False)
    duration = db.Column(db.Integer, nullable=True)
    genre = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=True)
