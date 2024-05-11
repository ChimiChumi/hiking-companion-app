import { StyleSheet } from 'react-native';
import { normalize } from '../utils/formatters';

const searchStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#fff4ee',
    paddingBottom: normalize(12),
  },
  contentContainer: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: '#fff4ee',
  },
  textInput: {
    flex: 1,
    fontSize: normalize(16),
    fontFamily: 'Inter',
    marginLeft: normalize(16, 'width'),
    marginRight: normalize(9, 'width'),
    padding: normalize(8),
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'gray',
    color: 'black',
    backgroundColor: "white",
  },
  searchButton: {
    alignItems: 'flex-start',
    marginRight: normalize(12, 'width'),
    width: normalize(40),
  },
  itemContainer: {
    marginVertical: normalize(4),
    marginHorizontal: normalize(12, 'width'),
    paddingHorizontal: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    height: normalize(70),
    fontFamily: 'Inter',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: normalize(20),
    textAlignVertical: 'top',
  },
  cardSubtitle: {
    fontSize: normalize(15),
    fontStyle: 'italic',
  },
  rightStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: normalize(70),
  },
  rightImage: {
    height: normalize(33),
    width: normalize(33),
  },
  rightText: {
    fontSize: normalize(15),
    fontWeight: 'bold'
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 48,
  },
  noResultsText: {
    fontSize: normalize(24),
    color: 'gray',
  },
});

export default searchStyles;
