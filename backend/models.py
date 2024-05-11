from dataclasses import dataclass
from google.cloud.firestore import GeoPoint


@dataclass
class Route:
  name: str
  description: str
  tags: list
  bounds: list
  routeLength: float

  def to_dict(self):
    return {Route.nameField():self.name,
            Route.descriptionField():self.description,
            Route.tagsField():self.tags,
            Route.boundsField():self.bounds,
            Route.routeLengthField():self.routeLength
            }

  def nameField():
    return 'name'

  def descriptionField():
    return 'description'

  def tagsField():
    return 'tags'

  def boundsField():
    return 'bounds'

  def routeLengthField():
    return 'routeLength'

  def featureIdField():
    return 'feature_id'

  def collectionName():
    return "routes"

@dataclass
class Feature_Type_Id:
  id: str
  name: str

@dataclass
class Icon:
  ref: str

@dataclass
class Feature:
  routeId: str
  type: str
  title: str
  symbolRef: str
  coordinates: list

  def collectionName():
    return 'features'

  def to_dict():
    pass

  def routeIdField():
    return 'routeId'

  def typeField():
    return 'type'

  def titleField():
    return 'title'

  def symbolRefField():
    return 'symbolRef'

  def cooridnatesField():
    return 'coordinates'
