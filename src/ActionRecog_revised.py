#!/usr/bin/env python
# coding: utf-8

# In[1]:
#from IPython import get_ipython
import mediapipe as mp # Import mediapipe
import cv2 # Import opencv
import time
from socketIO_client_nexus  import SocketIO, LoggingNamespace
from sklearn.metrics import accuracy_score # Accuracy metrics
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
#get_ipython().system('pip install mediapipe opencv-python pandas scikit-learn')


# In[2]:


import mediapipe as mp # Import mediapipe
import cv2 # Import opencv


# In[3]:


mp_drawing = mp.solutions.drawing_utils # Drawing helpers
mp_holistic = mp.solutions.holistic # Mediapipe Solutions


# In[32]:

def on_connect():
    print('connect')

def on_disconnect():
    print('disconnect')

def on_reconnect():
    print('reconnect')

def on_aaa_response(*args):
    print('on_aaa_response', args)

socketIO = SocketIO('localhost', 3000, LoggingNamespace)
socketIO.on('connect', on_connect)
socketIO.on('disconnect', on_disconnect)
socketIO.on('reconnect', on_reconnect)
socketIO.on('resp', on_aaa_response)

cap = cv2.VideoCapture(0) #현재 웹캠이 장치 0에 연결되어 있음을 의미. 연결상태에 따라 바뀌어야 할 수도 있음. 윈도우에서는 0, 맥에서는 2가 잘 작동
# print(cap.isOpened())
# Initiate holistic model
with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
    
    while cap.isOpened(): #웹캠이 연결되어 있는지 지속적 확인
        ret, frame = cap.read() #웹캠에서 피드를 읽고 프래임 가져옴.
        # print(ret)
        # Recolor Feed
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False        
        
        # Make Detections (가장 중요한 라인임)
        results = holistic.process(image)
        start = time.time()
        while results.face_landmarks == None:
            # print("works")
            time_c = time.time() - start
            if time_c >= 10:
                print("Emergency!")
                break


      #  print(results.face_landmarks)
        
        # face_landmarks, pose_landmarks, left_hand_landmarks, right_hand_landmarks
        
        # Recolor image back to BGR(blue,green,red) for rendering
        image.flags.writeable = True   
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
#         # 1. Draw face landmarks
#         mp_drawing.draw_landmarks(image, results.face_landmarks, mp_holistic.FACE_CONNECTIONS, 
#                                  mp_drawing.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1),
#                                  mp_drawing.DrawingSpec(color=(80,256,121), thickness=1, circle_radius=1)
#                                  )
                
        # 2. Right hand
        mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
                                 mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
                                 mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
                                 )

        # 3. Left Hand
        mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
                                 mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4),
                                 mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
                                 )

        # 4. Pose Detections
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS, 
                                 mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4),
                                 mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
                                 )
                        
        cv2.imshow('Raw Webcam Feed', image)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
# In[34]:


import csv
import os
import numpy as np

from sklearn.pipeline import make_pipeline 
from sklearn.preprocessing import StandardScaler 

from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier



with open('cooking_action.pkl', 'rb') as f: #rb=read binary
    model = pickle.load(f)


# In[18]:


model


# In[20]:


cap = cv2.VideoCapture(0)
# Initiate holistic model
with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
    
    while cap.isOpened():
        ret, frame = cap.read()
        
        # Recolor Feed
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False        
        
        # Make Detections
        results = holistic.process(image)
        start = time.time()
        # Detect emergency situation
        while results.face_landmarks == None:
            #print("works")
            time_c = time.time() - start
            if time_c >= 5:
                cv2.putText(image, 'EMERGENCY!'
                            , (80, 270), cv2.FONT_HERSHEY_SIMPLEX, 2.5, (255,0,0), 3, cv2.LINE_AA)
                break
        
        # pose_landmarks, left_hand_landmarks, right_hand_landmarks
        
        # Recolor image back to BGR for rendering
        image.flags.writeable = True   
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # 1. Right hand
        mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
                                 mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
                                 mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
                                 )

        # 2. Left Hand
        mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
                                 mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4),
                                 mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
                                 )

        # 3. Pose Detections
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS, 
                                 mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4),
                                 mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
                                 )
        # Export coordinates
        try:
            # Extract Pose landmarks
            pose = results.pose_landmarks.landmark
            pose_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility]
                                      for landmark in pose]).flatten())

            # Concate rows
            row = pose_row #+face_row

            # Make Detections
            X = pd.DataFrame([row])
            # body_language_class = model.predict(X)[0]
            body_language_prob = model.predict_proba(X)[0]
            print(round(body_language_prob[np.argmax(body_language_prob)], 2))
            if round(body_language_prob[np.argmax(body_language_prob)], 2) > 0.8:
                body_language_class = model.predict(X)[0]
                print(body_language_class)
                # print(body_language_class, body_language_prob,
                      #str(round(body_language_prob[np.argmax(body_language_prob)], 2)))
            else:
                body_language_class = "others"
                print(body_language_class)
                #print(body_language_class, body_language_prob,
                      #str(round(body_language_prob[np.argmax(body_language_prob)], 2)))
            socketIO.emit('gesture', body_language_class)
            coords = tuple(np.multiply(
                         np.array(
                             (results.pose_landmarks.landmark[mp_holistic.PoseLandmark.LEFT_EAR].x, 
                              results.pose_landmarks.landmark[mp_holistic.PoseLandmark.LEFT_EAR].y))                         , [640,480]).astype(int)) #text가 왼쪽 귀에 붙어서 따라다니게 함
            
            cv2.rectangle(image, 
                       (coords[0], coords[1]+5), 
                       (coords[0]+len(body_language_class)*20, coords[1]-30), (245, 117, 16), -1) #class text 보여주는 파란 박스
            cv2.putText(image, body_language_class, coords, 
                     cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA) #화면상에 예측한 class text로 보여줌
            
#             # Get status box
            cv2.rectangle(image, (0,0), (250, 60), (245, 117, 16), -1)
            
#             # Display Class
            cv2.putText(image, 'CLASS'
                         , (95,12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
            cv2.putText(image, body_language_class.split(' ')[0]
                         , (90,40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
            
#             # Display Probability
            cv2.putText(image, 'PROB'
                         , (15,12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
            cv2.putText(image, str(round(body_language_prob[np.argmax(body_language_prob)],2))
                         , (10,40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
            
        except:
            pass
                        
        cv2.imshow('Raw Webcam Feed', image)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()

from socketIO_client_nexus  import SocketIO, LoggingNamespace

def on_connect():
    print('connect')

def on_disconnect():
    print('disconnect')

def on_reconnect():
    print('reconnect')

def on_aaa_response(*args):
    print('on_aaa_response', args)

socketIO = SocketIO('localhost', 3000, LoggingNamespace)
socketIO.on('connect', on_connect)
socketIO.on('disconnect', on_disconnect)
socketIO.on('reconnect', on_reconnect)
socketIO.on('resp', on_aaa_response)

# Listen
socketIO.emit('file', body_language_class)
socketIO.wait(seconds=1)


