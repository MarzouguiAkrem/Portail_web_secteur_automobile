import React, { useEffect, useState, useContext } from "react";
import axios from 'axios'
import { RiShieldCheckLine as Verified } from "react-icons/ri";
import { FaRegStar as StarOutline } from "react-icons/fa";
import { FaCheck as Check } from "react-icons/fa";
import "./Profile.css";
import { toast } from 'react-toastify';
import { GlobalState } from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import { SvgIcon } from "@mui/material";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Button } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { Container } from "@mui/material";
import { makeStyles } from '@mui/styles';
import DatePicker from '@mui/lab/DatePicker';


const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));
function HomeIcon(props) {
    return (
      <SvgIcon  {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        
      </SvgIcon>
    );
  }
  

const ProfileForm = (props) => {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [isAdmin] = state.userAPI.isAdmin
    const [isProf] = state.userAPI.isProf

    const [name, setName] = useState(props.name);
    const [email, setEmail] = useState(props.email);
    const [description, setDescription] = useState(props.description);
    const [birthdate, setBirthdate] = useState(props.birthdate);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [image, setImage] = useState(false);
    
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const classes = useStyles();

    const handleSubmit = (e) => {
        e.preventDefault();
        const updateData = {
            usrimg: image.url,
            name: name,
            email: email,
            birthdate: birthdate,
            description: description
        }
        if (password) {
            updateData.password = password;
            updateData.confirmPassword = confirmPassword
        }
        console.log("updateData", updateData);
        axios.patch('/user', updateData, {
            headers: { Authorization: token }
        })
            .then(res => {
                props.setIsEditing(false);
                setPassword("");
                setConfirmPassword("");
                props.setName(res.data.name);
                props.setEmail(res.data.email);
                props.setBirthdate(res.data.DateNaissance);
                props.setDescription(res.data.description);
                console.log(res.data);
                toast.success('Données mises à jour avec succès', { position: toast.POSITION.TOP_RIGHT })
            })
            .catch(err => {
                toast.error(err.response.data.msg, { position: toast.POSITION.TOP_RIGHT })
            });
    }
    const handleUpload = async e => {
        e.preventDefault()
        try {
            const file = e.target.files[0]

            if (!file) return toast.error('file not exist!', { position: toast.POSITION.TOP_RIGHT })

            if (file.size > 1024 * 1024) // 1mb
                return toast.warning('Size too large!', { position: toast.POSITION.TOP_RIGHT })

            if (file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
                return toast.error('file format in incorrect!', { position: toast.POSITION.TOP_RIGHT })

            let formData = new FormData()
            formData.append('file', file)

            
            const res = await axios.post('/api/upload', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })
            setLoading(false)
            setImage(res.data)
            
        } catch (err) {
            toast.error(err.response.data.msg, { position: toast.POSITION.TOP_RIGHT })
        }
    }

    const handleDestroy = async () => {
        setIsLoading(true);
        try {
            setLoading(true)
            await axios.post('/api/destroy', { public_id: image.public_id }, {
                headers: { Authorization: token }
            })
            setLoading(false)
            
            setImage(false)
        } catch (err) {
            toast.error(err.response.data.msg, { position: toast.POSITION.TOP_RIGHT })
            setIsLoading(true);
        }
    }
    const styleUpload = {
        display: image ? "block" : "none"
    }


    return (<Container className="edit_profile" component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Typography component="h1" variant="h5">
           Mise à jour Profil 
            </Typography>
            <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <div className="upload2">
                                                <input type="file" name="file" id="file_up2" onChange={handleUpload} />
                            {
                                loading ? <div id="file_img2"><Loading /></div>

                                    : <div id="file_img2" style={styleUpload}>
                                        <img src={image ? image.url : ''} alt="" />
                                        <span onClick={handleDestroy}>X</span>
                                    </div>
                            }
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField className="update"
                            onChange={e => setName(e.target.value)}
                            value={name}
                            autoComplete="name"
                            name="name"
                            variant="outlined"
                            required
                            fullWidth
                            id="name"
                            label="Nom"
                            autoFocus
                            style={{input: {border: 'none !important'}}}
                        />
                        <TextField className="update"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="Email"
                            autoComplete="email"
                        />
                        <TextField className="update"
                            onChange={e => setDescription(e.target.value)}
                            value={description}
                            variant="outlined"
                            required
                            fullWidth
                            id="description"
                            label="Description"
                            name="Description"
                            autoComplete="description"
                        />
                        <DatePicker
                            margin="normal"
                            id="birthdate-dialog"
                            label="Date de naissance"
                            format="MM/DD/yyyy"
                            maxDate="2002-01-01"
                            minDate="1970-01-01"
                            fullWidth
                            value={birthdate}
                            onChange={(date) => setBirthdate(date)}
                            ButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField className="update"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <TextField className="update"
                            onChange={e => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            variant="outlined"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="confirm mot de passe"
                            type="password"
                            id="confirmPassword"
                            autoComplete="current-password"
                        />
                    </Grid>
                    <Button
                        onClick={handleSubmit}
                        type="submit"
                        fullWidth
                        color="secondary"
                        className={classes.submit}
                    >
                        Enregistrer
                    </Button>
                </Grid>
            </form>
        </div>
    </Container>
    );
}


const Profile = () => {
    const state = useContext(GlobalState)
    const [token] = state.token

    const [name, setName] = useState("");
    const [usrimg, setUserImage] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [birthdate, setBirthdate] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userInfo, setUserInfo] = useState({});

    const [isEditing, setIsEditing] = useState(false);
    const classes = useStyles();
    // const { setShowMenu } = useConsumeContext();
    // const sessionUser = useSelector(state => state.session.user);
    // const joinedDate = format(parseISO(sessionUser?.createdAt), "yyyy");
    // const dispatch = useDispatch();
    // const bookings = useSelector(state => state.booking);
    // const [bookingsLength, setBookingsLength] = useState(bookings?.length);

    // useEffect(() => {
    //     setShowMenu(false);
    //     dispatch(getBookings(sessionUser?.id));
    // }, [dispatch, sessionUser?.id, setShowMenu, bookingsLength]);

    // useEffect(() => {
    //     setBookingsLength(bookings?.length)
    // }, [bookings?.length]);

    useEffect(() => {

        if (token) {
            axios.get('/user', {
                headers: { Authorization: token }
            })
                .then(res => {
                    if (!res) return toast.error("Error getting user.", { position: toast.POSITION.BOTTOM_CENTER })
                    setName(res.data.name);
                    setEmail(res.data.email);
                    setDescription(res.data.description);
                    setBirthdate(res.data.DateNaissance);
                    setUserImage(res.data.usrimg);
                    setUserInfo(res.data);
                    console.log(res.data);
                })
                .catch(err => {
                    toast.error(err.response.data.msg, { position: toast.POSITION.BOTTOM_CENTER })
                });
        }

    }, []);


    return (
        <div className="profile__container">
            <div className="profile__info-container">
                <div className="profile__details">
                    <div className="profile__avatar">
                        <img src={usrimg} alt="" />
                    </div>
                    <div className="profile__identity-icons">
                        <StarOutline id="star-outline-icon" />
                        <p>{userInfo.role === 0 ? "Membre" : userInfo.role === 1 ? 'Administrateur' : 'Professionnel'}</p>
                    </div>
                    <div className="profile__identity-icons">
                        <Verified id="verified-icon" />
                        <p>Identité vérifiée</p>
                    </div>
                </div>
                <div className="profile__verification">
                    <h1> Email:</h1>
                    {/* <div className="verification__checks">
                        <Check id="check-icon" />
                        <p>facebook :</p>
                    </div> */}
                    <div className="verification__checks">
                       
                        <Check id="check-icon" />
                        <HomeIcon  color="secondary" />   <p>: {email}</p>
                    </div>
                    <p>,</p>
                    <h1>Date de naissance:</h1>
                    <div className="verification__checks">
                        <Check id="check-icon" />
                       <DateRangeIcon  color="secondary" /> <p>:{birthdate?.substring(0, 10)}</p>
                    </div>
                    {/* <div className="verification__checks">
                        <Check id="check-icon" />
                        <p>twitter :</p>
                    </div> */}
                    {/* <div className="learn__more"><span>Learn more</span> about how confirming account info helps keep the Airbnb community secure.</div> */}
                </div>
            </div>
            <div className="booking__info-container">
                <div className="user__profile-info-container">
                   <strong> <h1> {name}</h1></strong>
                   <h3>Bio</h3>
                                <p>{description}</p>
                    <h6>Rejoint 'AutoRoom' à la date : {userInfo.createdAt?.substring(0,10)}</h6>
                
                    {
                        isEditing ? <ProfileForm
                            setIsEditing={setIsEditing}
                            name={name} setName={setName}
                            email={email} setEmail={setEmail}
                            password={password} setPassword={setPassword}
                            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                            description={description} setDescription={setDescription}
                            birthdate={birthdate} setBirthdate={setBirthdate}>
                        </ProfileForm> :
                            <>
                               
                                {/* <div>
                                    <Home id="home-icon" />
                                    <p>{email}</p>
                                </div> */}
                                {/* <div>
                                    <Speaks id="speaks-icon" />
                                    <p>Speaks English</p>
                                </div> */}
                            </>
                    }
                </div>
                <div onClick={e => setIsEditing(!isEditing)} className="profile__edit-container"><span>{isEditing ? "" : <Button
                        type="submit"
                        fullWidth
                        color="secondary"
                        className={classes.submit}
                    >
                        Mofifier profil
                    </Button>}</span></div>
                {/* <div className="all__bookings-container">
                    {bookings?.length > 0 ? <h2>Upcoming trips</h2> : <h2>No upcoming trips</h2>}
                    {Array.from(bookings)?.map(booking => <BookingResult booking={booking} key={booking.id}/>)}
                </div> */}
            </div>
        </div>
    )
}

export default Profile;