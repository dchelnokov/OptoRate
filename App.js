import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import VoteScreen from "./src/screens/VoteScreen";
import ResultsScreen from "./src/screens/ResultsScreen";
import SettingScreen from "./src/screens/SettingScreen";
import { LocationProvider } from "./src/hooks/ContextProvider";

const navigator = createStackNavigator(
  {
    Vote: VoteScreen,
    Result: ResultsScreen,
    Settings: SettingScreen
  },
  {initialRouteName: 'Vote',
    defaultNavigationOptions: {
      'headerShown': false,
    }
  }

);
const AppContainer = createAppContainer(navigator);

const App = () => {
  return (
    <LocationProvider>
      <AppContainer />
    </LocationProvider>
  );
};
export default App;
