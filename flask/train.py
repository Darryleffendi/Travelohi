import tensorflow as tf
from tensorflow.keras import datasets, layers, models, losses
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
import os

import pandas as pd

df = pd.read_csv('train/_classes.csv')
df.columns = df.columns.str.strip()
df.columns = df.columns.str.lower()

image_labels = df.columns[1:]

df['label'] = df[image_labels].idxmax(axis=1)

df = df.drop(columns=['brazil', 'canada', 'finland', 'japan', 'united-kingdom', 'united_states', 'unlabeled'])

train_df, val_df = train_test_split(df, test_size=0.2)

train_datagen = ImageDataGenerator(rescale=1./255)
val_datagen = ImageDataGenerator(rescale=1./255)

image_directory = 'train/'

train_generator = train_datagen.flow_from_dataframe(
    dataframe=train_df,
    directory=image_directory,
    x_col='filename',
    y_col='label',
    target_size=(224, 224),
    batch_size=64,
    class_mode='categorical')

val_generator = val_datagen.flow_from_dataframe(
    dataframe=val_df,
    directory=image_directory,
    x_col='filename',
    y_col='label',
    target_size=(224, 224),
    batch_size=64,
    class_mode='categorical')

N = df['label'].nunique()

print(N)

model = models.Sequential()
model.add(layers.experimental.preprocessing.Resizing(224, 224, interpolation="bilinear", input_shape=(224, 224, 3)))
model.add(layers.Conv2D(96, 11, strides=4, padding='same'))
model.add(layers.BatchNormalization())
model.add(layers.Activation('relu'))
model.add(layers.MaxPooling2D(3, strides=2))
model.add(layers.Conv2D(256, 5, strides=4, padding='same'))
model.add(layers.BatchNormalization())
model.add(layers.Activation('relu'))
model.add(layers.MaxPooling2D(3, strides=2))
model.add(layers.Conv2D(384, 3, strides=4, padding='same'))
model.add(layers.Activation('relu'))
model.add(layers.Conv2D(384, 3, strides=4, padding='same'))
model.add(layers.Activation('relu'))
model.add(layers.Conv2D(256, 3, strides=4, padding='same'))
model.add(layers.Activation('relu'))
model.add(layers.Flatten())
model.add(layers.Dense(4096, activation='relu'))
model.add(layers.Dropout(0.5))
model.add(layers.Dense(4096, activation='relu'))
model.layers.pop() 
model.add(layers.Dense(N, activation='softmax')) 

model.summary()

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
history = model.fit(train_generator, epochs=10, validation_data=val_generator)

model.save('alexnet_model.h5')