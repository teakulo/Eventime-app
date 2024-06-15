import logging
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from models import db, AppEvent
from config import Config
from utils import get_random_events, get_matching_events
from intents import classify_intent
from entity_extraction import extract_message_entities
from format_events import format_events_info

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s',
                    handlers=[
                        logging.StreamHandler(),
                        logging.FileHandler('app.log', encoding='utf-8')
                    ])

first_request = True

@app.before_request
def initialize():
    global first_request
    if first_request:
        try:
            events_count = db.session.query(AppEvent).count()
            logging.debug(f"Successfully connected to the database. Found {events_count} events.")
        except Exception as e:
            logging.error(f"Error connecting to the database: {e}")
        first_request = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    try:
        user_message = str(request.form['user_message'])  # Ensure user_message is a string
        logging.debug(f"Received user_message: {user_message} (type: {type(user_message)})")
        intent = classify_intent(user_message)

        logging.debug(f"Classified Intent: {intent}")

        if intent == 'GREETING':
            response_html = "<p>Hello! How can I help you today?</p>"
        elif intent in ['SPECIFIC_INQUIRY', 'GENERAL_INQUIRY']:
            extracted_entities = extract_message_entities(user_message)
            logging.debug(f"Extracted entities: {extracted_entities}")
            if intent == 'GENERAL_INQUIRY':
                matching_events = get_random_events()
            else:
                matching_events = get_matching_events(extracted_entities)
            logging.debug(f"Matching events: {matching_events}")

            if matching_events:
                try:
                    response_html = format_events_info(matching_events)
                    logging.debug(f"Formatted response: {response_html} (type: {type(response_html)})")
                except Exception as e:
                    logging.error(f"Error formatting events info: {e}")
                    response_html = "<p>Error formatting events info.</p>"
            else:
                response_html = "<p>No matching events found.</p>"
        else:
            response_html = "<p>I'm not sure how to respond to that.</p>"

        return response_html, 200, {'Content-Type': 'text/html'}

    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return f"<p>Sorry, I encountered an error processing your request: {e}</p>", 200, {'Content-Type': 'text/html'}

if __name__ == '__main__':
    app.run(debug=True)

import logging
from models import AppEvent, db
from load_data import load_events_from_db, preprocess_event_data

def get_random_events():
    try:
        events = AppEvent.query.order_by(db.func.random()).limit(5).all()
        logging.debug(f"Random events retrieved: {events}")
        return [event_to_dict(event) for event in events]
    except Exception as e:
        logging.error(f"Error retrieving random events: {e}")
        return []

def get_matching_events(extracted_entities):
    try:
        events = load_events_from_db()
        processed_events = preprocess_event_data(events)
        matching_events = [event for event in processed_events if match_event(event, extracted_entities)]
        logging.debug(f"Matching events: {matching_events}")
        return matching_events
    except Exception as e:
        logging.error(f"Error retrieving matching events: {e}")
        return []

def match_event(event, extracted_entities):
    keywords = extracted_entities['keywords']
    time_frame = extracted_entities['time_frame']
    prices = extracted_entities['prices']

    combined_text = event.get('combined_text', '')
    logging.debug(f"Combined text before type check: {combined_text} (type: {type(combined_text)})")
    if not isinstance(combined_text, str):
        combined_text = str(combined_text)
    logging.debug(f"Combined text after type check: {combined_text} (type: {type(combined_text)})")

    matches_keywords = any(keyword in combined_text for keyword in keywords)
    matches_time_frame = match_time_frame(event, time_frame)
    matches_prices = match_prices(event, prices)

    logging.debug(f"Event {event['id']} matches keywords: {matches_keywords}, matches time frame: {matches_time_frame}, matches prices: {matches_prices}")

    return matches_keywords and matches_time_frame and matches_prices

def match_time_frame(event, time_frame):
    if not time_frame:
        return True
    event_start = event['start_time']
    event_end = event['end_time'] if event['end_time'] else event_start
    if not event_start or not event_end:
        return False
    start_match = time_frame[0] <= event_start <= time_frame[1]
    end_match = time_frame[0] <= event_end <= time_frame[1]
    return start_match or end_match

def match_prices(event, prices):
    if not prices:
        return True
    return any(price in str(event['price']) for price in prices)

def event_to_dict(event):
    event_dict = {
        'id': event.id,
        'name': event.name,
        'start_time': event.start_time,
        'end_time': event.end_time,
        'description': event.description,
        'venue': event.venue,
        'city': event.city,
        'category': event.category,
        'duration': event.duration,
        'genre': event.genre,
        'price': event.price,
        'combined_text': str(event.combined_text)
    }
    logging.debug(f"Event to dict: {event_dict}")
    return event_dict
