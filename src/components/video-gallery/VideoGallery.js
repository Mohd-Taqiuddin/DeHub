import React, { useEffect, useState } from 'react'
import { useHistory, Link } from "react-router-dom";
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
import './VideoGallery.css'

// export const [hash, setHash] = useState("");
// export const [title, setTitle] = useState("");
// export const [description, setDescription] = useState("");
export var currentHash = ""
export var currentTitle = ""
export var currentDescription = ""
export var videos = []

export default function VideoGallery({ account, contractData }) {
    const [postsData, setPostsData] = useState([])
    const [loading, setLoading] = useState(false)
    const [videoCount, setVideocount] = useState(0);
    const [hash, setHash] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [reload, setReload] = useState(false)

    const history = useHistory();

    const dtube = contractData;

    const client = new Web3Storage({ token: token });
  
    useEffect(() => {
      const loadPosts = async () => {
        try {
            setLoading(true)
            const videosCount = await contractData.methods.videoCount().call()
            console.log(videosCount)
            setVideocount(videosCount);
            // console.log(videoCount)

            // Load videos, sort by newest
            for (var i = videosCount; i >= 1; i--) {
                const video = await contractData.methods.videos(i).call();
                setPostsData([...postsData, video]);
            }

            const latest = await contractData.methods.videos(videosCount).call();
            setHash(latest.hash)
            setTitle(latest.title)
            setDescription(latest.description)
            currentHash = latest.hash
            currentTitle = latest.title
            currentDescription = latest.description
            videos = postsData
            // console.log(latest.hash)
            // console.log(currentHash)
            // console.log(currentHash)
            // console.log(currentTitle)
            // console.log(currentDescription)
            setLoading(false)
            setReload(true)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
      }
      loadPosts()
    }, [])

    const handleClick = async (event) => {
        console.log("clicked!!");
        const videosCount = await contractData.methods.videoCount().call()
        const latest = await contractData.methods.videos(videosCount).call();
        currentHash = latest.hash
        currentTitle = latest.title
        currentDescription = latest.description
        videos = postsData
        history.push("/video");
    }
  
    return (
      <div style={{ minHeight: '70vh', paddingBottom: '3rem' }}>
         {/* Add post's Data */}
         {
          loading ? (
            <CircularStatic />
          ) : (
            <div style={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                {postsData.length ? (
                    postsData.map((video, key) => {
                    return (
                        <div
                        className="card mb-4 text-center bg-secondary mx-auto"
                        style={{ width: "500px", height: "380   px" }}
                        key={key}
                        >
                        <div className="card-title bg-dark title">
                            <small className="text-white">
                            <b>{video.title}</b>
                            </small>
                        </div>
                        <div className='videoGallery'>
                            <p
                            onClick={handleClick}
                            >
                                <video
                                    src={`https://w3s.link/ipfs/${video.hash}`}
                                    style={{ width: "360px", height: "240px" }}
                                />
                                <div className='videoInfo'>
                                    <p>
                                        {video.title}
                                        <br/>
                                        {<span>by: {video.author}</span>}
                                        <br/>
                                        Description: {video.description}
                                    </p>
                                </div>
                            </p>
                        </div>
                        </div>
                    );
                    })) : (
                        <h2>No Videos Yet...</h2>

                    )
                }
              </Grid>
              <p className='uploadLink'>
                    Share a video?
                    <Link to="/upload-video">Click here</Link>
                </p>
            </div>
          )
        }
  
      </div>
    )
}
