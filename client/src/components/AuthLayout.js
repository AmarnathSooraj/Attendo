
import {
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';
import Colors from '../constants/colors';

export default function AuthLayout({ children, imageSource, text }) {

  return (
    <View style={style.container}>
      <View style={style.firstView}>
        <Image
          source={imageSource}
          style={{
            width: 250,
            height: 250,
            resizeMode: "cover",
          }}
        />
      </View>
      <Text style={style.subheading}>{text}</Text>
      <View style={style.secondView}>
        {children}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  subheading: {
    fontSize: 18,
    color: Colors.grey
  },
  firstView: {
    justifyContent: "center",
    alignItems: 'center',
  },
  secondView: {
    flex: 1,
  }
});

