import os
os.environ["KERAS_BACKEND"] = "jax"

print("[1/5] Importing imutils...")
import imutils
print("[2/5] Importing cv2...")
import cv2
print("[3/5] Importing numpy...")
import numpy as np
print("[4/5] Importing keras...")
import keras
print("[5/5] Importing displayemote...")
from web_display import update_display, change_display
print("All imports done.")

# parameters for loading data and images
detection_model_path = 'haarcascade_files/haarcascade_frontalface_default.xml'
emotion_model_path = 'models/_mini_XCEPTION.102-0.66.hdf5'

print("Loading face detection model...")
face_detection = cv2.CascadeClassifier(detection_model_path)
print("Loading emotion model...")
emotion_classifier = keras.models.load_model(emotion_model_path, compile=False)
print("Models loaded.")
EMOTIONS = ["angry" ,"disgust","scared", "happy", "sad", "surprised",
 "neutral"]

print("Starting webcam...")
camera = cv2.VideoCapture(0)
if not camera.isOpened():
    print("ERROR: Could not open webcam.")
    exit(1)
print("Webcam ready. Press 'q' to quit.")
while True:
    frame = camera.read()[1]
    #reading the frame
    frame = imutils.resize(frame,width=300)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_detection.detectMultiScale(gray,scaleFactor=1.1,minNeighbors=5,minSize=(30,30),flags=cv2.CASCADE_SCALE_IMAGE)
    
    # canvas = np.zeros((250, 300, 3), dtype="uint8")
    # frameClone = frame.copy()
    if len(faces) > 0:
        faces = sorted(faces, reverse=True,
        key=lambda x: (x[2] - x[0]) * (x[3] - x[1]))[0]
        (fX, fY, fW, fH) = faces
        roi = gray[fY:fY + fH, fX:fX + fW]
        roi = cv2.resize(roi, (64, 64))
        roi = roi.astype("float") / 255.0
        roi = np.expand_dims(roi, axis=-1) if roi.ndim == 2 else roi
        roi = np.expand_dims(roi, axis=0)

        preds = emotion_classifier.predict(roi)[0]
        emotion_probability = float(np.max(preds))
        label = EMOTIONS[preds.argmax()]
    else: continue

    # for (i, (emotion, prob)) in enumerate(zip(EMOTIONS, preds)):
    #             text = "{}: {:.2f}%".format(emotion, prob * 100)
    #             w = int(prob * 300)
    #             cv2.rectangle(canvas, (7, (i * 35) + 5),
    #             (w, (i * 35) + 35), (0, 0, 255), -1)
    #             cv2.putText(canvas, text, (10, (i * 35) + 23),
    #             cv2.FONT_HERSHEY_SIMPLEX, 0.45,
    #             (255, 255, 255), 2)
    #             cv2.putText(frameClone, label, (fX, fY - 10),
    #             cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
    #             cv2.rectangle(frameClone, (fX, fY), (fX + fW, fY + fH),
    #                           (0, 0, 255), 2)

    # cv2.imshow('Face Cam :)', frameClone)

    change_display(label, emotion_probability)
    update_display(frame)
    # cv2.imshow("Probabilities", canvas)
    cv2.waitKey(1)

camera.release()
# cv2.destroyAllWindows()
