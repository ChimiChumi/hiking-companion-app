from firebase_admin import credentials
from json_decode import getRouteFeatures
from firebase_commands import FirestoreDB
from os import listdir
from os.path import isfile, join, exists
import threading

jsonDir = 'GEOJSON'
logFile = 'uploaded_files.log'

def read_uploaded_files():
    if exists(logFile):
        with open(logFile, 'r', encoding='utf-8') as file:
            return set(file.read().splitlines())
    return set()

def log_uploaded_file(filename):
    with open(logFile, 'a', encoding='utf-8') as file:
        file.write(filename + '\n')

def processJson(firestore, file, uploaded_files):
    if file in uploaded_files:
        print(f"Skipping {file} as it has already been uploaded.")
        return

    route, features = getRouteFeatures(file)
    routeId = firestore.insertRoute(route)
    index = 0
    for feature in features:
        if 'Symbol' in feature['properties'].keys():
            feature['properties']['Symbol'] = firestore.getIconReference(feature['properties']['Symbol'])
        feature['routeId'] = routeId
        if feature['geometry']['type'] == 'LineString':
            feature['LineIndex'] = index
            index += 1
        feature, route.bounds, route.routeLength = firestore.transformFeatureToFirestore(feature, route.bounds, route.routeLength)
        firestore.insertFeature(feature)
    firestore.insertRoute(route)
    log_uploaded_file(file)  # Log this file as uploaded after successful processing

def main(cred):
    firestore = FirestoreDB(cred)
    dirFile = f'./{jsonDir}'
    files = [join(dirFile, f) for f in listdir(dirFile) if isfile(join(dirFile, f))]
    uploaded_files = read_uploaded_files()
    threads = []

    for file in files:
        t = threading.Thread(target=processJson, args=(firestore, file, uploaded_files))
        t.start()
        threads.append(t)

    for thread in threads:
        thread.join()

if __name__ == '__main__':
    cred = credentials.Certificate("firebase-cert.json")
    main(cred)
