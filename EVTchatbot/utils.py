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

    matches_keywords = any(keyword in event['combined_text'] for keyword in keywords)
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
    return {
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
        'price': event.price
    }
