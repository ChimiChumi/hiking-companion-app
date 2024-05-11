import firebase_admin
from firebase_admin import firestore,storage
from google.cloud.firestore_v1.base_query import FieldFilter
from firebase_convert import PointConvert,LineStringConvert,PolygonConvert
import models
from json_decode import main
from google.type.latlng_pb2 import LatLng
class FirestoreDB:

  def __init__(self,cred):
    self.cred = cred
    self.storage_link = 'hiking-navigation.appspot.com'
    firebase_admin.initialize_app(cred)
    self.db = firestore.client()
    self.fb_storage = storage.bucket(name=self.storage_link)


  def getRouteCollection(self):
    return self.db.collection(models.Route.collectionName())

  def getFeatureCollection(self):
    return self.db.collection(models.Feature.collectionName())

  def checkIfRouteExistsByName(self,routeName):
    # Check if document name will be the route name or random generated id then it will need to be retested
    routes_ref = self.getRouteCollection()
    query_ref = routes_ref.where(filter=FieldFilter(models.Route.nameField(), "==",routeName))
    docs = query_ref.stream()
    for doc in docs:
      return doc.id
    return None

  def chechIfFeatureExistsByRouteId(self,routeId,type,title):
    feature_ref = self.getFeatureCollection()
    query_ref = feature_ref.where(filter=FieldFilter('routeId',"==",routeId)).where(filter=FieldFilter('geometry.type',"==",type)).where(filter=FieldFilter('properties.Title',"==",title))
    docs = query_ref.stream()
    for doc in docs:
      return doc.id
    return None

  def transformFeatureToFirestore(self, feature,bounds,totalDistance: float):
    feature_type = feature['geometry']['type']
    if feature_type == "Point":
      result = PointConvert(feature,bounds)
      return result[0],result[1],totalDistance
    elif feature_type == "LineString":
      return LineStringConvert(feature,bounds,totalDistance)
    elif feature_type == "Polygon":
      result = PolygonConvert(feature,bounds)
      return result[0],result[1],totalDistance
    return feature,bounds,totalDistance

  def insertRoute(self,route: models.Route):
    route_dic = route.to_dict()
    routes_ref = self.getRouteCollection()
    id = self.checkIfRouteExistsByName(route.name)
    routes_ref = self.getRouteCollection()
    if id is not None:
      routes_ref.document(id).set(route_dic)
    else:
      timestamp, doc_ref =routes_ref.add(route_dic)
      id = doc_ref.id
    print('{} route was added'.format(route.name))
    return id

  def insertFeature(self,feature: models.Feature):
    feature_ref = self.getFeatureCollection()
    feature_ref.add(feature)

  def insert(self,feature):
    feature_ref = self.getFeatureCollection()
    feature_ref.add(feature)

  def getIconReference(self,iconName):
    if iconName == '0' or '':
      iconName = "general"
    blob = self.fb_storage.get_blob('icons/{}.png'.format(iconName))
    if blob is not None:
      return blob.name
    return ''




if __name__ == '__main__':
  from firebase_admin import credentials
  from json_decode import getRouteFeatures
  cred = credentials.Certificate("hiking-navigation-firebase-adminsdk-s3ero-e505f6f98c.json")


  firestore = FirestoreDB(cred)
  feature = main('inebolu_ersizler_ipsinne_kanyon_kastamonu.json')
  # feature["properties"]['Symbol'] = firestore.getIconReference(feature["properties"]['Symbol'])
  # feature['properties'].pop('URL',None)
  route, features = getRouteFeatures('inebolu_ersizler_ipsinne_kanyon_kastamonu.json')
  for feature in features:
    if feature['geometry']['type'] != "Polygon":
      continue
    print(firestore.transformFeatureToFirestore(feature))

  #result =firestore.chechIfFeatureExistsByRouteId(feature['routeId'],feature['geometry']['type'],feature['properties']['Title'])
  #print(result)
  #firestore.insert(feature)
  #Works as expected
  #print(firestore.check_if_route_existsByName('example3'))
