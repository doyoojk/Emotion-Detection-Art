from ast import If
from cProfile import label
import random
from turtle import*
from threading import Thread

EMOTIONS = ["angry" ,"disgust","scared", "happy", "sad", "surprised",
 "neutral"]

class Display(): 
    def __init__(self):
        self.emotion = 'happy'
        self.size = random.randint(1,300)
        self.shape = "circle"
        setup()

        self.turtle = Turtle()
        self.emotion_colors = {
            'happy': ["yellow", "pink", "light sky blue", "light cyan", "lemon chiffon"], 
            'sad': ["navy", "purple", "dark green", "dark slate gray"],
            'disgust' : ["green", "purple"],
            'scared' : ["black", "purple", "midnight blue"],
            'surprised' : ["pink", "orange", "yellow", "green", "white"],
            'neutral' : ["light gray", "dark gray", "light slate gray"],
            'angry' : ["red", "maroon", "crimson"]
        }

        self.emotion_size = {
            'happy': 300, 
            'sad': 100,
            'disgust' : 300,
            'scared' : 100,
            'surprised' : 600,
            'neutral' : 200,
            'angry' : 500
        }

        self.emotion_shape = {
            'happy': "circle", 
            'sad': "square",
            'disgust' : "hexagon",
            'scared' : "circle",
            'surprised' : "circle",
            'neutral' : "square",
            'angry' : "hexagon"
        }

    def set_emotion(self, emotion): 
        if emotion in self.emotion_colors: 
            self.emotion = emotion
    def set_size(self, size):
        if size in self.emotion_size:
            self.size = size
    def set_shape(self, shape):
        if shape in self.emotion_shape:
            self.shape = shape

    def update(self): 
        t1 = self.turtle
        t1.up()

        t1.speed(0)
        x = random.randint(-300,300)
        y = random.randint(-300,300)

        shape_size = random.randint(1,self.emotion_size[self.size])
        shape_color = random.choice(self.emotion_colors[self.emotion])
        shape = self.emotion_shape[self.emotion]

        t1.goto(x,y)
        t1.down()
        t1.color(shape_color)
        t1.begin_fill()
        if (shape == "circle"):
            t1.circle(shape_size)
        elif (shape == "square"):
            for i in range(4):
                t1.forward(shape_size)
                t1.left(90)
        elif (shape == "hexagon"):
            for i in range(6):
                t1.forward(shape_size)
                t1.left(300)
        t1.end_fill()

        #puts pen back up 
        t1.up()
        
    
d = Display()

def change_display(label):
    d.set_emotion(label)
    d.set_size(label)
    d.set_shape(label)

def update_display(): 
    d.update()

        