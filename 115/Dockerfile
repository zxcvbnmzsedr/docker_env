FROM jlesage/baseimage-gui:debian-10


ENV APP_NAME="disk115"
ENV DISPLAY_WIDTH="1100"
ENV DISPLAY_HEIGHT="800"

COPY root /
COPY startapp.sh /startapp.sh
RUN apt-get update  &&  apt-get install -y wget libnss3 libxss1 desktop-file-utils libasound2 ttf-wqy-zenhei libgtk-3-0 libgbm1 libnotify4 xdg-utils libsecret-common libsecret-1-0 libindicator3-7 libdbusmenu-glib4 libdbusmenu-gtk3-4 libappindicator3-1
RUN wget https://down.115.com/client/115pc/lin/115pc_1.0.6.7.deb /115pc_1.0.6.7.deb
RUN dpkg -i  /115pc_1.0.6.7.deb  \
&&  rm  /115pc_1.0.6.7.deb
RUN  sed -i 's@usr\/bin\/x11vnc  \\@usr\/bin\/x11vnc  \\\n                    -noxdamage \\@'   /etc/services.d/x11vnc/run   \
&&  install_app_icon.sh https://raw.githubusercontent.com/zxcvbnmzsedr/docker_env/master/115/icon/img.png  \
# fix window decorations
&&  sed -i 's@<decor>no<\/decor>@<decor>yes<\/decor>@g'  /etc/xdg/openbox/rc.xml  \
# fix dpkg
&&  sed -i '/messagebus/d' /var/lib/dpkg/statoverride
