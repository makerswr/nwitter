import { authService, dbService } from "fbase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth";


const Profile = ({ userObj }) => {
	const navigate = useNavigate();
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
	const onLogOutClick = () => {
		authService.signOut();
		navigate("/");
	};
	
	const onChange = (event) => {
		const {
			target: {value},
		} = event;
		setNewDisplayName(value);
	};
	/* const getMyNweets = async () => {
		const q = query(collection(dbService, "nweets"), where("creatorId", "==", userObj.uid), orderBy("createdAt", "asc"));
		const nweets = await getDocs(q);
		nweets.forEach((doc) => {
			console.log(doc.id, " => ", doc.data());
		}); 
		console.log(nweets.docs.map((doc) => doc.data()));
	};
	
	useEffect(() => {
		getMyNweets();
	}, []);
	
	*/
	const onSubmit = async (event) => {
		event.preventDefault();
		if (userObj.displayName !== newDisplayName) {
			await updateProfile(userObj, { displayName: newDisplayName});
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
		</>
	);
};

export default Profile;