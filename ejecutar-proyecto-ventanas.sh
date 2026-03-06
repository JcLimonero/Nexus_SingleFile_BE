#!/bin/bash
# Abre 3 ventanas de Terminal, cada una ejecutando BE, FE o DWH

PROJECT_ROOT="/Users/jclimonero/Developer/NexFileOne"

# Ventana 1: BE
osascript -e "
tell application \"Terminal\"
    do script \"cd $PROJECT_ROOT/BE && echo '🚀 BE - Backend (puerto 8083)' && php spark serve --host=0.0.0.0 --port=8083\"
    activate
end tell
"

sleep 0.5

# Ventana 2: FE
osascript -e "
tell application \"Terminal\"
    do script \"cd $PROJECT_ROOT/FE && echo '🚀 FE - Frontend (puerto 4200)' && npm start -- --port 4200\"
end tell
"

sleep 0.5

# Ventana 3: DWH
osascript -e "
tell application \"Terminal\"
    do script \"cd $PROJECT_ROOT/DWH && echo '🚀 DWH (puerto 8082)' && php spark serve --host=0.0.0.0 --port=8082\"
end tell
"

echo "✅ Abiertas 3 ventanas de Terminal: BE, FE y DWH"
