import cv2
import numpy as np

img = cv2.imread('./test/test.jpg')
m = np.ndarray.mean(img)

gray_scale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
th1, img_bin = cv2.threshold(gray_scale, m, 225, cv2.THRESH_BINARY)

x,y,_ = img.shape
w, h = 640, 480;
x_cen = int(x / 2) - int(w / 2)
y_cen = int(y / 2) - int(h / 2)

crop_img = img[int(y_cen):int(y_cen + h), int(x_cen):int(x_cen + w)]

cv2.imwrite('./test/processed.jpg', crop_img)
