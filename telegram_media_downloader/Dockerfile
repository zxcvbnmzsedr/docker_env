FROM python:3.9.13-alpine
RUN apk update
RUN apk add wget
RUN apk add unzip

RUN wget https://github.com/Dineshkarthik/telegram_media_downloader/archive/refs/tags/v2.0.2.zip -O src.zip
RUN unzip src.zip
RUN mv telegram_media_downloader-2.0.2 /usr/src/app
WORKDIR /usr/src/app
RUN  pip install --no-cache-dir -r requirements.txt


CMD [ "python3", "./media_downloader.py" ]