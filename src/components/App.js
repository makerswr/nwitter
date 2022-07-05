import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
	const [userObj, setUserObj] = useState(null);
	
	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setUserObj({
					uid: user.uid,
					displayName: user.displayName,
					updateProfile: (newProfile) => {
						user.updateProfile(newProfile);
					},	
				});
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});	
	}, []);
	
	const refreshUserObj = (newDisplayName) => {
		// const user = authService.currentUser;
		setUserObj({
			uid: userObj.uid,
			displayName: newDisplayName,
			updateProfile: (newProfile) => {
				userObj.updateProfile(newProfile);
			},	
		});
	};
	
	return (
		<>
			{init ? (
				<AppRouter  refreshUserObj={refreshUserObj} isLoggedIn={Boolean(userObj)} userObj={userObj}/>
			) : (
				"initializing..."
			)}
			<footer>&copy; {new Date().getFullYear()} Nwitter</footer>
		</>
	);
}

export default App;
