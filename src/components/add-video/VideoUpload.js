import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import CircularStatic from '../commons/CircularProgressWithLabel'
import ImageListItem from '@material-ui/core/ImageListItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import { Grid } from '@material-ui/core'
import '../home-container/gallery/PostGallery.css'
import VideoPlayer from '../videoplayer/VideoPlayer'
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { token } from '../../WEB3_TOKEN'
import { Link } from 'react-router-dom'
import { SettingsInputAntenna } from '@material-ui/icons';
import '../video-gallery/VideoGallery.css';


function VideoUpload({ account, contractData }) {

    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    // const [hash, setHash] = useState("")

    const client = new Web3Storage({ token: token });
    const dtube = contractData;
    const history = useHistory();

    const captureFile = (event) => {
        event.preventDefault();
        const file = document.querySelector('input[type="file"]');
        return setFile(file)
    };

    const upload= async () => {
        setLoading(true)
        try{
            console.log("Submitting file to IPFS...")
            const videoFile = file
            //adding file to the IPFS
            const cid = await client.put(videoFile.files, { wrapWithDirectory: false });
            // console.log(account)
            // console.log(description)
            contractData.methods
                .uploadVideo(cid, title, description)
                .send({ from: account })
                .on("transactionHash", (hash) => {
                    setLoading(false)
                    history.push("/detube");
            });

        }
        catch(e) {
            console.log(e)
            setLoading(false)
        }
    }

    // const handleChange = (event) => {
    //     SetInput(event.target.value)
    // }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                setTitle(event.target.value);
                upload();
            }}
        >
            &nbsp;
            <input
                type="file"
                accept=".mp4, .mov, .mkv .ogg .wmv"
                onChange={captureFile}
                style={{ width: "250px" }}
            />
            <div className="form-group mr-sm-2">
                <input
                    id="videoTitle"
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    defaultValue={title}
                    className="form-control-sm mt-3 mr-3"
                    placeholder="Video Title"
                    required
                />
            </div>
            <div className="form-group mr-lg-6">
                <input
                    id="videoDescription"
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    defaultValue={description}
                    className="form-control-lg mt-3 mr-3"
                    placeholder="Video Description"
                    required
                />
            </div>
            <button
            type="submit"
            className="btn border border-dark btn-primary btn-block btn-sm"
            >
            Upload
            </button>
            &nbsp;
        </form>
    )
}

export default VideoUpload