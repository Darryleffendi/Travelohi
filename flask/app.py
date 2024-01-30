from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
from werkzeug.utils import secure_filename 

UPLOAD_FOLDER = 'upload'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

@app.route('/')
def hello_world():
    return jsonify({
        'message' : ''
    })

@app.route('/media/upload', methods=['POST'])
def upload_media():
    if 'file' not in request.files:
        return jsonify({
          'message' : 'media not provided'
        }, 400)
    file = request.files['file']
    if file.filename == '':
        return jsonify({
        'message' : 'file not provided'
        }, 400)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({
          'message' : predict_image(preprocess_image(os.path.join(app.config['UPLOAD_FOLDER'], filename)))
        })

def predict_image(image):
    loaded_model = tf.keras.models.load_model('alexnet_model.h5')

    prediction = loaded_model.predict(image)
    # predicted_class_index = np.argmax(prediction,axis=1)
    return prediction

def preprocess_image(image_path):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, axis=0)  # Create a batch
    img_array /= 255.0  # Rescale the same way as training data
    return img_array

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[-1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='8080', debug=True)