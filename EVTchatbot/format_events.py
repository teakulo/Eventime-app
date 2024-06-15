import dateparser
import logging

def format_events_info(events):
    formatted_events = "<table style='width:100%; border-collapse: collapse;'>"
    formatted_events += "<tr style='background-color: #f2f2f2;'><th>Name</th><th>Date</th><th>Venue</th><th>City</th><th>Category</th></tr>"

    for event in events:
        start_date = event.get('start_time')
        logging.debug(f"Start date before type check: {start_date} (type: {type(start_date)})")

        if not isinstance(start_date, str):
            start_date = str(start_date)

        logging.debug(f"Start date after type check: {start_date} (type: {type(start_date)})")

        try:
            start_date_str = dateparser.parse(start_date).strftime('%d-%m-%Y') if start_date else 'Unknown date'
        except Exception as e:
            logging.error(f"Error parsing date: {e}")
            start_date_str = 'Invalid date'

        formatted_events += "<tr style='border-bottom: 1px solid #ddd;'>"
        formatted_events += f"<td>{event.get('name', 'Unnamed Event')}</td>"
        formatted_events += f"<td>{start_date_str}</td>"
        formatted_events += f"<td>{event.get('venue', 'Unknown venue')}</td>"
        formatted_events += f"<td>{event.get('city', 'Unknown city')}</td>"
        formatted_events += f"<td>{event.get('category', 'N/A')}</td>"
        formatted_events += "</tr>"

    formatted_events += "</table>"
    return formatted_events
