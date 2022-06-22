import { dbService } from "fbase";
import { doc, deleteDoc } from "firebase/firestore";

const Nweet = ({ nweetObj, isOwner }) => {
	const onDeleteClick = async() => {
		const ok = window.confirm("삭제 for real?");
		console.log(ok);
		if (ok) {
			console.log(nweetObj.id);
			deleteDoc(doc(dbService, "nweets", nweetObj.id));
		}
	};
	
	return (
		<div>
			<h4>{nweetObj.text}</h4>
			{isOwner && (
				<>
					<button onClick={onDeleteClick}>Delete Nweet</button>
					<button>Edit Nweet</button>
				</>
			)}

		</div>
	);
};

export default Nweet;