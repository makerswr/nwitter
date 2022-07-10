import { dbService } from "fbase";
import { addDoc, getDocs, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
	const [nweets, setNweets] = useState([]);
	const [nweet, setNweet] = useState("");
	const [attachment, setAttachment] = useState("");
	
	const getNweets = () => {
		const q = query(collection(dbService, "nweets"), orderBy("createdAt", "desc"));
		const usbs = onSnapshot(q, (snapshot) => {
			const newArray = snapshot.docs.map((document) => ({
				id: document.id,
				...document.data(),
			}));
			setNweets(newArray);
		});	
		return usbs;
	}
	
	useEffect(() => {	
		const usbs = getNweets();
		return () => {
			usbs();
		};
	}, []);
	
	return (
		<div className="container">
			<NweetFactory userObj={userObj} />
			<div style={{ marginTop: 30}}>
				{nweets.map(nweet => {
					return(
						<Nweet 
							key={nweet.id}
							nweetObj={nweet}
							isOwner={nweet.creatorId === userObj.uid}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default Home;