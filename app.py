

import re
from flask import Flask, request, jsonify
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
from data import qa_pairs
app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

nlp = spacy.load("en_core_web_sm")

questions = [pair["question"] for pair in qa_pairs]
answers = [pair["answer"] for pair in qa_pairs]
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(questions)

def preprocess_input(query):
    pattern = r'([A-Za-z])(\s+)(unit|Unit)s?\b'
    processed_query = re.sub(pattern, r'\1\3', query)
    processed_query = processed_query.replace("ju", "Jahangirnagar University")
    return processed_query

def get_most_relevant_answer(query, questions, answers, tfidf_matrix):
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, tfidf_matrix)
    max_similarity = similarities.max()
    if max_similarity < 0.1:
        return "Sorry, I couldn't find a relevant answer to your question."
    most_similar_question_index = similarities.argmax()
    return answers[most_similar_question_index]

@app.route('/api/chatbot', methods=['POST'])

def chatbot():

    user_question = request.json.get('question')
    if not user_question:
        return jsonify({'error': 'Something is wrong! Try Again'})
    processed_question = preprocess_input(user_question)
    answer = get_most_relevant_answer(processed_question, questions, answers, tfidf_matrix)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)
