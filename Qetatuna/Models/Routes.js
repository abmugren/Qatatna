import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import SplashScreen from './Components/SplashScreen';
import WelcomeScreen from './Components/WelcomeScreen';
import ChooseLoginType from './Components/ChooseLoginType';
import LoginManager from './Components/LoginManager';
import LoginMember from './Components/LoginMember';
import ForgotPassword from './Components/ForgotPassword';
import Register from './Components/Register';
import HomeRoutes from './Components/HomeRoutes';

const Routes = createStackNavigator(
   {
      SplashScreen: {
         screen: SplashScreen,
         navigationOptions: ({ navigation }) => ({
            header: null,
         }),
      },
      WelcomeScreen: {
         screen: WelcomeScreen,
         navigationOptions: ({ navigation }) => ({
            header: null,
         }),
      },
      ChooseLoginType: {
         screen: ChooseLoginType,
         navigationOptions: ({ navigation }) => ({
            header: null,
         }),
      },
      LoginManager: {
         screen: LoginManager,
         navigationOptions: ({ navigation }) => ({
            header: null,
         }),
      },
      LoginMember: {
         screen: LoginMember,
         navigationOptions: ({ navigation }) => ({
            header: null,
         }),
      },
      ForgotPassword: {
         screen: ForgotPassword,
         navigationOptions: ({ navigation }) => ({
            header: null,
         }),
      },
      Register: {
         screen: Register,
         navigationOptions: ({ navigation }) => ({
            header: null,
         }),
      },
      HomeRoutes: {
         screen: HomeRoutes,
         navigationOptions: ({ navigation }) => ({
            header: null,
         }),
      },
   },
   {
      initialRouteName: "SplashScreen"
   }
);

const AppContainer = createAppContainer(Routes);

export default AppContainer;