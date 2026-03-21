# Emotion-Detection-Art

An interactive art installation that detects facial emotions in real time via webcam and generates dynamic visual art using Python Turtle graphics.

<div align="center">
  <img src="https://github.com/doyoojk/Emotion-Detection-Art/blob/main/EmotionDetectionEX.gif">
</div>

## How It Works

1. **Face Detection** - OpenCV's Haar Cascade classifier detects faces from a live webcam feed.
2. **Emotion Classification** - A pre-trained Mini-XCEPTION CNN classifies detected faces into one of 7 emotions: `angry`, `disgust`, `scared`, `happy`, `sad`, `surprised`, `neutral`.
3. **Art Generation** - The detected emotion is mapped to a color palette and shape, which are rendered on screen via Python Turtle.

```
Webcam → Face Detection (Haar Cascade) → Emotion CNN → Turtle Graphics
```

## Tech Stack

- **ML Framework**: TensorFlow / Keras
- **Computer Vision**: OpenCV (Haar Cascade face detection)
- **CNN Architecture**: Mini-XCEPTION (SeparableConv2D residual modules, ~66% validation accuracy on FER2013)
- **Art Rendering**: Python Turtle (Tkinter)
- **Pre-trained Model**: Mini-XCEPTION (~66% validation accuracy on [FER2013](https://www.kaggle.com/datasets/msambare/fer2013))

## Project Structure

```
Emotion-Detection-Art/
├── Emotion/
│   ├── real_time_video.py            # Main entry point — live detection + art
│   ├── displayemote.py               # Emotion → art rendering logic
│   ├── requirements.txt
│   ├── models/
│   │   └── _mini_XCEPTION.102-0.66.hdf5  # Pre-trained model weights
│   └── haarcascade_files/
│       └── haarcascade_frontalface_default.xml
└── README.md
```

## Setup

### Prerequisites

- Python 3.x
- A webcam

### Installation

```bash
git clone https://github.com/doyoojk/Emotion-Detection-Art.git
cd Emotion-Detection-Art
pip install -r Emotion/requirements.txt
```

> **Note**: Dependency versions in `requirements.txt` are pinned to older releases. On newer systems (Python 3.10+, Apple Silicon), you may need to relax version constraints or install compatible builds of TensorFlow/Keras.

## Usage

```bash
cd Emotion
python real_time_video.py
```

This opens your webcam, displays detected faces with emotion labels and probability bars, and renders Turtle graphics based on the dominant emotion.

## Model Details

The pre-trained model is **Mini-XCEPTION**, a lightweight variant of the Xception architecture optimized for real-time inference:

- 4 residual blocks with depthwise separable convolutions
- L2 regularization (0.01)
- Input: 48x48 grayscale face crops
- Output: 7-class softmax
- Trained on FER2013 (35,887 images), ~66% validation accuracy
