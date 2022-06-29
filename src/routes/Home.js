import {dbService, storageService} from "fbase";
import { addDoc, getDocs, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Home = ({ userObj }) => {
	const [nweet, setNweet] = useState("");
	const [nweets, setNweets] = useState([]);
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
	
	
	
	const onSubmit = async (event) => {
		event.preventDefault();
		/* await addDoc(collection(dbService, "nweets"), {
			text: nweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
		});
		setNweet(""); */
		let attachmentUrl = "";
		if( attachment !== "" ) {
			const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
			const response = await uploadString(attachmentRef, attachment, "data_url");
			console.log(getDownloadURL(response.ref));
			attachmentUrl = await getDownloadURL(response.ref);

		}
		const nweetObj = {
			text: nweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			attachmentUrl
		}
		await addDoc(collection(dbService, "nweets"),(nweetObj));
		setNweet("");
		setAttachment("");
		//const message = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';

	};
	
	const onChange = (event) => {
		event.preventDefault();
		const {
			target: { value },
		} = event;
		setNweet(value);
	};
	
	const onFileChange = (event) => {
		const {
			target: { files },
		} = event;
		const theFile = files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};
		reader.readAsDataURL(theFile);
	};
	
	const onClearAttachment = () => setAttachment("");
	
	return (
		<>
			<form onSubmit={onSubmit}>
				<input
					value={nweet}
					onChange={onChange}
					type="text"
					placeholder="write something"
					maxLength={120}
				/>
				<input type="file" accept="image/*" onChange={onFileChange} />
				<input type="submit" value="Nweet" />
				{attachment && (
					<div>	
						<img src={attachment} width="50px" height="50px" />
						<button onClick={onClearAttachment}>Clear</button>
					</div>
				)}
			</form>
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