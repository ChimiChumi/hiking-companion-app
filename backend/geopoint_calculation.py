from math import radians,sin,pow,cos,atan2,sqrt
from google.cloud.firestore import GeoPoint
def getDistance(point1: GeoPoint, point2: GeoPoint):
  earthRadiusKm = 6371
  dLat = radians(point2.latitude-point1.latitude)
  dLon = radians(point2.longitude-point1.longitude)

  lat1 = radians(point1.latitude)
  lat2 = radians(point2.latitude)

  a = pow(sin(dLat/2),2) + pow(sin(dLon/2),2) * cos(lat1) * cos(lat2)

  c = 2 * atan2(sqrt(a),sqrt(1-a))
  return earthRadiusKm * c


def setBounds(bounds: list, point:GeoPoint):
  if len(bounds) < 2:
    tempPoint = GeoPoint(latitude=point.latitude,longitude=point.longitude)
    bounds.append(tempPoint)
    return bounds
  minPoint = bounds[0]
  maxPoint = bounds[1]

  if minPoint.latitude > point.latitude:
    minPoint.latitude = point.latitude
  if minPoint.longitude > point.longitude:
    minPoint.longitude = point.longitude

  if maxPoint.latitude < point.latitude:
    maxPoint.latitude = point.latitude
  if maxPoint.longitude < point.longitude:
    maxPoint.longitude = point.longitude

  return bounds


if __name__ == '__main__':
  points = [GeoPoint(1,1),GeoPoint(2,3),GeoPoint(3,2)]
  bounds = []
  for point in points:
    bounds = setBounds(bounds,point)
  for point in bounds:
    print(point.longitude,point.latitude)
