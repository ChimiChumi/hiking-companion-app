from google.cloud.firestore import GeoPoint
from geopoint_calculation import getDistance,setBounds
from elevation_requests import getElavation

def PointConvert(feature,bounds):
  long,lat = feature['geometry']['coordinates']
  point = GeoPoint(latitude=lat,longitude=long)
  feature['geometry']['coordinates'] = point
  bounds = setBounds(bounds,point)
  return feature,bounds


def LineStringConvert(feature,bounds,totalDistance):
  geopoints = []
  elevation = []
  point1 = None
  point2 = None
  for long,lat in feature['geometry']['coordinates']:
    
    point = GeoPoint(latitude=lat,longitude=long)
    bounds = setBounds(bounds,point)
    geopoints.append(point)
    elevation.append(getElavation(long,lat))
    if point1 is None:
      point1 = point
    else:
      point2 = point
      totalDistance += getDistance(point1,point2)
      point1 = point2
  feature['geometry']['coordinates'] = geopoints
  feature['elevation'] = elevation
  return feature,bounds,totalDistance

def PolygonConvert(feature,bounds):
  polygons = {}
  for index,polygon in enumerate(feature['geometry']['coordinates']):
    geopoints = []
    for long,lat in polygon:
      point = GeoPoint(latitude=lat,longitude=long)
      geopoints.append(point)
      bounds = setBounds(bounds,point)
    polygons[str(index)] = geopoints
  feature['geometry']['coordinates'] = polygons
  return feature,bounds

if __name__ == '__main__':
  coordinates  = [3,1]
