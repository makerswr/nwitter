import { dbService } from "fbase";
import { addDoc, getDocs, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
	const [nweets, setNweets] = useState([]);
	const [nweet, setNweet] = useState("");
	const [attachment, setAttachment] = useState("");
	
	useEffect(() => {
		onSnapshot(collection(dbService, "nweets"), (snapshot) => {
			const newArray = snapshot.docs.map((document) => ({
				id: document.id,
				...document.data(),
			}));
			setNweets(newArray);
		});	
	}, []);
	
	return (
		<>
			<NweetFactory userObj={userObj} />
			<div>
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
		</>
	);
};

export default Home;