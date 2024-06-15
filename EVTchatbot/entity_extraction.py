import logging
import re
import spacy
from dateutil.relativedelta import relativedelta
from datetime import datetime, timedelta
from dateparser.search import search_dates
from nltk.corpus import wordnet

nlp = spacy.load("en_core_web_sm")

def extract_message_entities(message, include_synonyms=True):
    logging.debug(f"Received message: {message}")

    doc = nlp(message)
    logging.debug(f"Analyzing message: {message}")

    # Extract GPE entities
    keywords = [ent.text.lower() for ent in doc.ents if ent.label_ == 'GPE']
    logging.debug(f"Extracted GPE keywords: {keywords}")

    # Extract general keywords and lemmatize
    general_keywords = []
    for token in doc:
        if token.is_alpha and not token.is_stop:
            lemma = token.lemma_.lower()
            general_keywords.append(lemma)
    logging.debug(f"Extracted general keywords: {general_keywords}")
    keywords.extend(general_keywords)

    # Add synonyms
    if include_synonyms:
        all_keywords = set(keywords)
        synonyms = set()
        for word in all_keywords:
            word_synonyms = {lemma.name().lower() for syn in wordnet.synsets(word) for lemma in syn.lemmas()}
            synonyms.update(word_synonyms)
            logging.debug(f"Added synonyms for {word}: {', '.join(word_synonyms)}")
        all_keywords.update(synonyms)
        logging.debug(f"Keywords with synonyms: {', '.join(all_keywords)}")
    else:
        all_keywords = set(keywords)
        logging.debug(f"Keywords without synonyms: {', '.join(all_keywords)}")

    time_frame = get_time_frame(message)
    logging.debug(f"Extracted time frame: {time_frame}")

    price_pattern = r'\b\d+(\.\d+)?\s*BAM\b'
    prices = re.findall(price_pattern, message)
    logging.debug(f"Extracted prices: {prices}")

    return {'keywords': list(all_keywords), 'time_frame': time_frame, 'prices': prices}

def get_time_frame(message):
    logging.debug(f"Received message for time frame extraction: {message}")
    current_date = datetime.now()

    next_year_pattern = r'next year'
    next_month_pattern = r'next month'
    next_week_pattern = r'next week'
    in_days_pattern = r'in (\d+) days'
    in_weeks_pattern = r'in (\d+) weeks'
    in_months_pattern = r'in (\d+) months'

    if re.search(next_year_pattern, message.lower()):
        start_date = datetime(current_date.year + 1, 1, 1)
        end_date = datetime(current_date.year + 1, 12, 31)
        logging.debug(f"Matched 'next year': start_date={start_date}, end_date={end_date}")
        return (start_date, end_date)

    if re.search(next_month_pattern, message.lower()):
        start_date = current_date + relativedelta(months=+1)
        end_date = start_date + relativedelta(months=+1, days=-1)
        logging.debug(f"Matched 'next month': start_date={start_date}, end_date={end_date}")
        return (start_date, end_date)

    if re.search(next_week_pattern, message.lower()):
        start_date = current_date + timedelta(weeks=1)
        end_date = start_date + timedelta(days=6)
        logging.debug(f"Matched 'next week': start_date={start_date}, end_date={end_date}")
        return (start_date, end_date)

    days_match = re.search(in_days_pattern, message.lower())
    weeks_match = re.search(in_weeks_pattern, message.lower())
    months_match = re.search(in_months_pattern, message.lower())

    if days_match:
        days_ahead = int(days_match.group(1))
        target_date = current_date + timedelta(days=days_ahead)
        logging.debug(f"Matched 'in days': target_date={target_date}")
        return (target_date, target_date)

    if weeks_match:
        weeks_ahead = int(weeks_match.group(1))
        target_date = current_date + timedelta(weeks=weeks_ahead)
        logging.debug(f"Matched 'in weeks': target_date={target_date}")
        return (target_date, target_date)

    if months_match:
        months_ahead = int(months_match.group(1))
        target_date = current_date + relativedelta(months=+months_ahead)
        logging.debug(f"Matched 'in months': target_date={target_date}")
        return (target_date, target_date)

    dates_found = search_dates(message, settings={'PREFER_DATES_FROM': 'future', 'DATE_ORDER': 'DMY'})
    if dates_found:
        logging.debug(f"Matched date parser: dates_found={dates_found}")
        return (dates_found[0][1], dates_found[0][1])

    logging.debug("No time frame matched")
    return None

def preprocess_event_data(events, include_synonyms=True):
    processed_events = []
    for event in events:
        combined_text = f"{event['name']} {event['description']} {event['venue']} {event['category']} {event['genre']}".lower()
        doc = nlp(combined_text)
        general_keywords = [token.lemma_.lower() for token in doc if token.is_alpha and not token.is_stop]
        all_keywords = set(general_keywords)

        # Add synonyms
        if include_synonyms:
            synonyms = set()
            for word in all_keywords:
                word_synonyms = {lemma.name().lower() for syn in wordnet.synsets(word) for lemma in syn.lemmas()}
                synonyms.update(word_synonyms)
            all_keywords.update(synonyms)
        logging.debug(f"Processed event: {event['id']} with keywords: {', '.join(all_keywords)}")
        processed_events.append({'id': event['id'], 'keywords': all_keywords, 'original_text': combined_text})
    return processed_events
