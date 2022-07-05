import { authService, dbService } from "fbase";
import { useEffect, useState, location } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy, onSnapshot } from "firebase/firestore";
import { updateProfile, signOut } from "firebase/auth";
import MyNweets from "components/MyNweets";



const Profile = ({ userObj, refreshUserObj }) => {
	const navigate = useNavigate();
	const [myNweets, setMyNweets] = useState([]);
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	
	const onLogOutClick = () => {
		signOut(authService);
		// console.log("logout succesful");
		navigate("/");
		window.location.reload(false);
	};
	
	const onChange = (event) => {
		const {
			target: {value},
		} = event;
		setNewDisplayName(value);
	};
	
	const getMyNweets = async () => {
		const q = query(collection(dbService, "nweets"), where("creatorId", "==", userObj.uid), orderBy("createdAt", "asc"));
		const nweets = await getDocs(q); //nweets = unsubscribe
		nweets.forEach((doc) => {
			// console.log(doc.id, " => ", doc.data());
			setMyNweets(prev => [doc.data(), ...prev])
		}); 
		/* onSnapshot(collection(dbService, "nweets"), (snapshot) => {
			const myNweets = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setMyNweets(myNweets); 
		};*/
		//return nweets;
		// console.log(nweets.docs.map((doc) => doc.data()));
	};
	
	useEffect(() => {
		getMyNweets();
	}, []);
	
	
	const onSubmit = async (event) => {
		event.preventDefault();
		if (userObj.displayName !== newDisplayName) {
			await updateProfile(authService.currentUser, { displayName: newDisplayName });
			refreshUserObj(newDisplayName);
		}
	};
	
	return (
		<>
			<form onSubmit={onSubmit}>
				<input onChange={onChange}
					   type="text" 
					   placeholder="Display name"
					   value={newDisplayName}
				/>
				<input type="submit" value="Update Profile" />
			</form>
			<button onClick={onLogOutClick}>Log Out</button>
			<div>
				{myNweets && myNweets.map((docs) => <MyNweets myNweetObj={docs} key={docs.createdAt} /> )}
			</div>
		</>
	);
};

export default Profile;