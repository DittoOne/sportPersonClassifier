from flask import Flask, render_template, jsonify, request
import util
import os

app = Flask(__name__)

# Get the absolute path to the UI folder

@app.route('/', methods=['GET', 'POST'])
def classify_image():
    try:
        response = {}
        if request.method == 'POST':
            image_data = request.form['image_data']
            response = jsonify(util.classify_image(image_data))
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        else:
            return render_template("app.html", response=response)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    print("Starting Python Flask Server For Sports Celebrity Image Classification")
    util.load_saved_artifacts()
    # Specify the UI folder path as the template folder
    app.run(port=5000)
