#!/bin/sh

dir=$(
    cd "${0%[/\\]*}" >/dev/null
    pwd
)

if [ -d /proc/cygdrive ]; then
    case $(which php) in
    $(readlink -n /proc/cygdrive)/*)
        # We are in Cygwin using Windows php, so the path must be translated
        dir=$(cygpath -m "$dir")
        ;;
    esac
fi

EDITOR=vim
PASSWD=/etc/passwd
RED='\033[0;41;30m'
STD='\033[0;0;39m'

export npm_config_devdir=./tmp/.gyp

clean_git_history() {
    git checkout --orphan latest_branch
    git add -A
    git commit -am "Fifth Impact, Re-index Repository"
    git branch -D master
    git branch -m master
    git push -f origin master
}

tweak_npm() {
    npm set progress=false
    npm config set python libs/Windows/python2.7
    node-gyp --python libs/Windows/python2.7
    node-gyp configure --msvs_version=2015
}

switch_dist() {
    git remote set-url origin https://github.com/dimaslanjaka/universal-framework.git
}

switch_dev() {
    git remote set-url origin https://github.com/dimaslanjaka/dev-universal-framework.git
}

update() {
    composer update -o
    npm update
    types-installer install
}

backup() {
    DATE=$(date +"%d-%b-%Y")
    cd /root
    tar --exclude='./htdocs/tmp' --exclude='./htdocs/src/Session/sessions' --exclude='./htdocs/vendor' --exclude='./htdocs/node_modules' --exclude='./htdocs/processed' -zcvf backup-$DATE.tgz /root/htdocs
}

reset_iptables() {
    iptables -P INPUT ACCEPT
    iptables -P OUTPUT ACCEPT
    iptables -P FORWARD ACCEPT
    iptables -F INPUT
    iptables -F OUTPUT
    iptables -F FORWARD
    iptables -F
}
#snyk test --file=package.json --exclude=src,tmp,vendor,node_modules
install() {
    apt-get install dh-autoreconf -y
    npm install --ignore-scripts
    composer install --no-scripts
}

refresh() {
    sync
    if [ $(dpkg-query -W -f='${Status}' polipo 2>/dev/null | grep -c "ok installed") -eq 0 ]; then
        apt-get install polipo -y
    fi
    polipo -x
    echo 3 >/proc/sys/vm/drop_caches
    swapoff -a && swapon -a
    printf '\n%s\n\n' 'Ram-cache and Swap Cleared'
    if [ -f /opt/lampp/xampp ]; then
        /opt/lampp/xampp restart
    fi
    free -h
}

pause() {
    read -p "Press [Enter] key to continue..." fackEnterKey
}

show_menus() {
    clear
    echo "~~~~~~~~~~~~~~~~~~~~~"
    echo "   Library builder   "
    echo "~~~~~~~~~~~~~~~~~~~~~"
    echo "1. Single compiler"
    echo "2. Install Production"
    echo "3. refresh (linux)"
    echo "0. Exit"
}

read_options() {
    local choice
    read -p "Enter choice [ 1 - 3] " choice
    case $choice in
    1)
        tsc -p tsconfig.build.json
        tsc -p tsconfig.precompiler.json
        tsc -p tsconfig.compiler.json
        #pause
        ;;
    2)
        #clean_git_history
        ;;
    3) refresh ;;
    0) exit 0 ;;
    *) echo -e "${RED}Error...${STD}" && sleep 2 ;;
    esac
}

# ----------------------------------------------
# Trap CTRL+C, CTRL+Z and quit singles
# ----------------------------------------------
# trap '' SIGINT SIGQUIT SIGTSTP

# -----------------------------------
# Step #4: Main logic - infinite loop
# ------------------------------------
while true; do
    show_menus
    read_options
done
