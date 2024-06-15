import spacy
from spacy.matcher import Matcher
import logging
from entity_extraction import extract_message_entities

nlp = spacy.load("en_core_web_sm")
matcher = Matcher(nlp.vocab)

greet_pattern = [{"LOWER": {"IN": ["hi", "hello", "hey", "greetings"]}}]
matcher.add("GREETING", [greet_pattern])

def classify_intent(message):
    doc = nlp(message)
    matches = matcher(doc)

    for match_id, start, end in matches:
        span = doc[start:end]
        return nlp.vocab.strings[match_id]

    if message.strip().lower() == "events?":
        return 'GENERAL_INQUIRY'

    extracted_entities = extract_message_entities(message)
    if extracted_entities['keywords']:
        return 'SPECIFIC_INQUIRY'
    return 'GENERAL_INQUIRY'
