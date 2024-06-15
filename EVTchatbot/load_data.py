import logging
from models import AppEvent, db

def load_events_from_db():
    try:
        events = AppEvent.query.all()
        logging.debug(f"Loaded {len(events)} events from the database.")
        return events
    except Exception as e:
        logging.error(f"Error loading events from the database: {e}")
        return []

def preprocess_event_data(events):
    processed_events = []
    for event in events:
        combined_text = f"{event.name} {event.description} {event.venue} {event.genre} {event.category}"
        processed_events.append({
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
            'combined_text': combined_text.lower()
        })
        logging.debug(f"Processed event: {event.id} with combined text: {combined_text.lower()}")
    return processed_events

