import './Dash.css';
import React, {useState , useEffect} from 'react';
import { useHistory, useLocation } from "react-router";
import { useNavigate,useParams } from "react-router-dom";
import './Dietplanmodal.css';
import Modal from 'react-modal';
import firebase from 'firebase';
import {
  getFirestore, query,
  getDocs, collection,
  where, addDoc, update 
}from "firebase/firestore";
import {getAuth} from "firebase/auth";
var ip = 'localhost'
var config = {
  apiKey: "AIzaSyCrtUrEBF8X0pQQU7_-GS9F5IaxX8mGtXU",
  authDomain: "make-it-cde4f.firebaseapp.com",
  databaseURL: "https://make-it-cde4f-default-rtdb.firebaseio.com",
  projectId: "make-it-cde4f",
  storageBucket: "make-it-cde4f.appspot.com",
  messagingSenderId: "835509810208",
  appId: "1:835509810208:web:cc696476ad076d008ef845"
  };
function Dashboard(props) {
  let {signIn,uname} = useParams();
  const db = firebase.firestore()
 const navigate = useNavigate();
 const location = useLocation();
 const [signedIn,setSignedIn] = useState(signIn=="signedIn"?"signedIn":"signedOut")
 const [Email,setEmail] = useState(uname==undefined?"Unknown":uname)
 const [fullName,setFullName] = useState('')
 const [newUserName,setNewUserName] = useState('')
 const [userName,setUserName] = useState('')
 const [newPassword,setNewPassword] = useState('')
 const [oldPassword,setOldPassword] = useState('')
 const [status,setStatus] = useState('None')
 const [reports,setReports] = useState([])
 const [urecipes,setRecipes] = useState([])
 const [uposts,setUPosts] = useState([])
 const [userPlan,setUserPlan] = useState([])
 const [siteUsers,setSiteUsers] = useState([])
 const [approved,setApproved] = useState('0')
 const [pending,setPending] = useState('0')
  const [modalopenRecipe, setmodalopenRecipe] = useState(false);
  const [Total,setTotal] = useState('0')
  const [postStats,setPostStats] = useState({
    t:'0',
    v:'0',
    p:'0',
    s:'0'
  })
  const [planStats,setPlanStats] = useState('0');
  const [uStats,setUStats] = useState('0');
  const [title,setTitle] = useState("")
  const [ingredient,setIng] = useState("")
  const [process,setProcess] = useState("")
  const [time,setTime] = useState("")
  const [pic,setPic] = useState("")
  const [web,setWeb] = useState("")
 useEffect(()=>{
    
    db.collection("feebacks")
  .get()
  .then(async function(querySnapshot) {
    var temp =[]
    await querySnapshot.forEach(function(doc) {
      temp.push({
        name:doc.data().name,
        email:doc.data().email,
        problem:doc.data().feedback,
        id:doc.id
      })
          
      });
    setReports(temp)
  });
  firebase.database().ref('Administrators/'+uname).on('value', (snapshot) => {
    var pass= snapshot.val();
    if(pass.fullName!=null){
      setUserName(pass.fullName);
  }else{
    alert('Invalid')
    
  }
  });
  db.collection("userRecipes")
  .get()
  .then(async function(querySnapshot) {
    var temp =[]
    await querySnapshot.forEach(function(doc) {
      temp.push({
        name:doc.data().title,
        webURL:doc.data().webURL,
        PicURL:doc.data().picURL,
        status:doc.data().status,
        process:doc.data().process,
        time:doc.data().time,
        ingredient:doc.data().ing,
        id:doc.id
      })
          
      });
    setRecipes(temp)
  });
  db.collection("posts")
  .get()
  .then(async function(querySnapshot) {
    var temp =[]
    await querySnapshot.forEach(function(doc) {
      temp.push({
        name:doc.data().name,
        description:doc.data().description,
        message:doc.data().message,
        photoUrl:doc.data().photoUrl,
        postPicURL:doc.data().postPicURL,
        postVideoURL:doc.data().postVideoURL,
        id:doc.id
      })
          
      });
    setUPosts(temp)
  });
  db.collection("users")
  .get()
  .then(async function(querySnapshot) {
    var temp =[]
    await querySnapshot.forEach(function(doc) {
      temp.push({
        name:doc.data().name,
        email:doc.data().email,
        imageLink:doc.data().imageLink,
        id:doc.id,
        udi:doc.data().uid
      })
          
      });
      setSiteUsers(temp)
  });
  if(userPlan.length==0){
  db.collection("userPlan")
  .get()
  .then(async function(querySnapshot) {
    var temp1 =[]

    await querySnapshot.forEach(function(doc) {
      temp1 = [...temp1,{
        plan:doc.data(),
        id:doc.id
      }]
          
      });
    await temp1.forEach((obj,i)=>{
        db.collection("users")
        .get()
        .then(async function(querySnapshot) {
          await querySnapshot.forEach(function(doc1) {
            if(doc1.id==obj.id){
              temp1[i]={...temp1[i],data:[doc1.data().name,doc1.data().email]}
            }
            });
            
              setUserPlan([...temp1])
        });
      })
  });
}
},[status])
 function createAccount (){
  setStatus('create')
 }
 function updatePassword (){
   setStatus('update')
 }
 function report (){
   setStatus('report')
 }
function recipes (){
  setStatus('recipes')
}
function posts (){
  setStatus('posts')
}
function users (){
  setStatus('users')
}
function uplan (){
  setStatus('uplans')
}
 function signOut (){
   setSignedIn("signedOut")
  navigate("/")
 }
 function back (){
  setStatus('None')
 }
 function update (){
  db.collection("userRecipes")
  .get()
  .then(async function(querySnapshot) {
    var temp ="" 
    var t=0;
    var p=0;
    var a=0;
    await querySnapshot.forEach(function(doc) {
      t=t+1
      if(doc.data().status=="pending"){
        p=p+1
      }else if(doc.data().status=="approved"){
        a=a+1
      }  
          
      });
    setApproved(a)
    setPending(p)
    setTotal(t)
    });
    db.collection("posts")
  .get()
  .then(async function(querySnapshot) {
    var temp ="" 
    var t=0;
    var v=0;
    var p=0;
    var s=0;
    await querySnapshot.forEach(function(doc) {
      s=s+1
      if(doc.data().message!="None"){
        t=t+1
      }else if(doc.data().postPicURL!="None"){
        p=p+1
      }else if(doc.data().postVideoURL!="None"){
        v=v+1
      }  
          
      });
    setPostStats({
      t:t,
      v:v,
      p:p,
      s:s
    })
    });

    db.collection("userPlan")
  .get()
  .then(async function(querySnapshot) {
    var temp ="" 
    var t=0;
    await querySnapshot.forEach(function(doc) {
      t=t+1
     
          
      });
    setPlanStats(t)
    });
    db.collection("users")
    .get()
    .then(async function(querySnapshot) {
      var temp ="" 
      var t=0;
      await querySnapshot.forEach(function(doc) {
        t=t+1
       
            
        });
      setUStats(t)
      });
 }
 
var SubmitCreateForm = (event)=>{
  event.preventDefault();
  firebase.database().ref('Administrators/'+newUserName).set({
    'password':newPassword,
    'fullName':fullName
  });
  setNewUserName('')
  setNewPassword('')
  setFullName('')
  alert('Administrator Created')
  setStatus('None')
}
var SubmitUpdateForm = (event)=>{
  event.preventDefault();
  var  update = false;
  firebase.database().ref('Administrators/'+Email).on('value', (snapshot) => {
    if(oldPassword==snapshot.val().password){
      update = true;
    }
  });
  if(update){
      firebase.database().ref('Administrators/'+Email).set({'password':newPassword});
      setOldPassword("")
      setNewPassword("")
      alert('Password Updated')
  }else{
      alert('Wrong Old Password')
  }  
}

 if(signedIn=='signedIn' && status=='None'){
  return (
    <div className="DashApp">
      <div className='DashBoard'>
        <div id='dashRow'>
          <div id='dashSectionL'>
            <p>{userName==''?"Administrators":userName.toUpperCase()}</p>
              <div id='dashOptions'>
                <p>Options</p>
                <button id='dashOptionsButton' onClick={createAccount}>Create New Account</button>
                <button id='dashOptionsButton' onClick={updatePassword}>Update Password</button>
                <button id='dashOptionsButton' onClick={report}>Reports</button>
                <button id='dashOptionsButton' onClick={recipes}>Recipies</button>
                <button id='dashOptionsButton' onClick={posts}>Posts</button>
                <button id='dashOptionsButton' onClick={users}>Users</button>
                <button id='dashOptionsButton' onClick={uplan}>User Plans</button>
                <button id='dashOptionsButtonLast' onClick={signOut}>Sign Out</button>
              </div>
          </div>
          <div id='dashSectionR'>
            <p>Database Statistics</p>
              <div id='dashStats'>
              <div id="dashStatBox">
                <div id='dashStatsRow'>
                  <p>Total Recipes: {Total}</p>
                  <p>Approved Recipes: {approved}</p>
                  <p>Pending Recipes: {pending}</p>
                </div>
                <div id='dashStatsRow'>
                  <p>Total Posts: {postStats.s}</p>
                  <p>Video Post: {postStats.v}</p>
                  <p>Text Posts: {postStats.t}</p>
                  <p>Picture Posts: {postStats.p}</p>
                </div>
                <div id='dashStatsRow'>
                  <p>Total Number Of Users: {uStats}</p>
                  <p>Total User Diet Plans: {planStats}</p>
                </div>
              </div>
              <div id='dashStatsReports'>
                <button id={'dashStatsReportsUpdate'}
                  onClick={update}
                >Update Statistics</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 }
 else if(signedIn=='signedIn' && status=='create'){
    return(
      <div className='dashCreateBox'>
        <form className="dashLoginBg" onSubmit={SubmitCreateForm}>
          <div className='inputHeader'>
            <p>SIGNUP FORM</p>
          </div> 
          <div className='inputCover'>
          <p>FULL NAME</p>
          <input
            type="text"
            value={fullName}
            onChange={(name)=>{setFullName(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <p>NEW USER NAME</p>
          <input
            type="text"
            value={newUserName}
            onChange={(name)=>{setNewUserName(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <p>NEW PASSWORD</p>
          <input
            type="password"
            value={newPassword}
            onChange={(name)=>{setNewPassword(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <input
            type="submit"
            value='Create'
          />
          </div>
        </form>
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
      </div>
    );
  }
 else if(signedIn=='signedIn' && status=='update'){
    return(
      <div className='dashCreateBox'>
        <form className="dashLoginBg" onSubmit={SubmitUpdateForm}>
          <div className='inputHeader'>
            <p>PASSWORD UPDATE FORM</p>
          </div> 
          <div className='inputCover'>
          <p>Old PASSWORD</p>
          <input
            type="text"
            value={oldPassword}
            onChange={(name)=>{setOldPassword(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <p>NEW PASSWORD</p>
          <input
            type="password"
            value={newPassword}
            onChange={(name)=>{setNewPassword(name.target.value)}}
          />
          </div>
          <div className='inputCover'>
          <input
            type="submit"
            value='Update'
          />
          </div>
        </form>
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
      </div>
    );
  }
 else if(signedIn=='signedIn' && status=='report'){
    return(
      <div className='reportBox'>
        <p id='reportHeader'>Reports</p>
        <div id='reports'>
        {
          reports.map(function(report, idx) {
              return( 
                <div id="report">
                  <div>
                  <p id='name'>Name: {report.name}</p>
                  <p id='name'>Email: {report.email}</p>
                  <p id='problem'>{report.problem}</p>
                  </div>
                  <div id="rbuttonBox">
                  <button
                  onClick={async()=>{
                    
                      db.collection("feebacks").doc(report.id).delete();
                     alert("Feedback Deleted")
                    setStatus("None")
                    
                  }}
                  id="rbutton">Delete</button>
                  </div>
                </div>
                );
          })
        }
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
        </div>
      </div>
      );
  }
  else if(signedIn=='signedIn' && status=='recipes'){
    return(
      <div className='reportBox'>
        <div className='recipeHeader'>
        <div className='rHeaderBox'>
        <p id='reportHeader'>Recipes</p>
        </div>
        <div className='rButtonBox'>
        <button id='rOptionsButton' onClick={
                  ()=>{
                    setmodalopenRecipe(true)
                    setTitle("")
                    setPic("")
                    setWeb("")
                  }
                }>Add New Recipe</button>
        </div>
        </div>
        <div id='reports'>
        {
          urecipes.map(function(recipe, idx) {
              return( 
                <div id="recipe">
                  <div>
                  <img id="recipeImg" src={recipe.PicURL} alt="Recipe"/>
                  </div>
                  <div id="rinfo">
                  <p id='rname'>Name: {recipe.name}</p>
                  <p id='rname'>Web URL: {recipe.webURL}</p>
                  <p id='rname'>Cooking Time: {recipe.time} Hours</p>
                  <p id='rname'>Recipe Ingredients: {recipe.ingredient}</p>
                  <p id='rname'>Cooking Process: {recipe.process}</p>
                  </div>
                  <div id="rbuttonBox">
                  <button
                  onClick={async()=>{
                    if(recipe.status=="pending"){
                    db.collection("userRecipes").doc(recipe.id).update({
                      status:"approved"
                    })
                    alert("Recipe Approved")
                    setStatus("None")
                  }
                    else{
                      db.collection("userRecipes").doc(recipe.id).delete();
                     alert("Recipe Deleted")
                    setStatus("None")
                    }
                  }}
                  id="rbutton">{recipe.status=="pending"?"Approve Recipe":"Delete"}</button>
                  </div>
                </div>
                );
          })
        }
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
        </div>
        <Modal className='Dietplan_modal' isOpen={modalopenRecipe} shouldCloseOnOverlayClick={false} onRequestClose={() => setmodalopenRecipe(false)}>
          <div className='Dietplan_search-container'>
            <h3 className='Dietplan_subheader'>
              Recipe Detials
            </h3>
            <div>
              <div className='Recipe_Input'>
                <h2>Recipe Title</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Title'
                  value={title}
                  onChange={(e)=>{
                    setTitle(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Photo Link</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Photo Link'
                  value={pic}
                  onChange={(e)=>{
                    setPic(e.target.value)
                  }}
                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Webpage Link</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Webpage Link'
                  value={web}
                  onChange={(e)=>{
                    setWeb(e.target.value)
                  }}
                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Ingredients</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Ingredients'
                  value={ingredient}
                  onChange={(e)=>{
                    setIng(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Cooking Time</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Cooking Time'
                  value={time}
                  onChange={(e)=>{
                    setTime(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Cooking Process</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Cooking Process'
                  value={process}
                  onChange={(e)=>{
                    setProcess(e.target.value)
                  }}

                />
              </div>
            <div className="buttonContainer">
            <button className="customButtons"
              onClick={async () => {
                if(title.length==0){
                  alert("Recipe Title Required")
                }else if(pic.length==0){
                  alert("Recipe Picture Link Required")
                }else if(web.length==0){
                  alert("Recipe Webpage Link Required")
                }else if(time.length==0){
                  alert("Recipe Cooking Time Required")
                }else if(process.length==0){
                  alert("Recipe Cooking Process Required")
                }else if(ingredient.length==0){
                  alert("Recipe Ingredients Required")
                }else{
                  db.collection("userRecipes").add({ 
                    title:title,
                    picURL:pic,
                    webURL:web,
                    status:"approved",
                    time:time,
                    process:process,
                    ing:ingredient,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  });
                  db.collection("Notification").add( {
                    id:uname, 
                    msg:"Recipe "+title+" added by "+uname+" (Administrator)",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  });
                alert("Recipe Added")
                setmodalopenRecipe(false)
                }
              }}       >
              Add Recipe
            </button>
            <button className="customButtons"
              onClick={() => setmodalopenRecipe(false)}       >
              Close
            </button>
          </div>
          </div>
          </div>
        </Modal>
      </div>
      );
  }
  else if(signedIn=='signedIn' && status=='posts'){
    return(
      <div className='reportBox'>
        <div className='recipeHeader'>
        <div className='rHeaderBox'>
        <p id='reportHeader'>Posts</p>
        </div>
        </div>
        <div id='reports'>
        {
          uposts.map(function(post, idx) {
              return( 
                <div id="recipe">
                  <div>
                  <img id="recipeImg" src={post.photoUrl} alt="Recipe"/>
                  </div>
                  <div id="rinfo">
                  <p id='rname'>Posted By: {post.name}</p>
                  <p id='rname'>Message: {post.message}</p>
                  <p id='rname'>Description: {post.description} Hours</p>
                  <p id='rname'>Post Pic: {post.postPicURL}</p>
                  <p id='rname'>VideoURL: {post.postVideoURL}</p>
                  </div>
                  <div id="rbuttonBox">
                  <button
                  onClick={async()=>{
                   
                      db.collection("posts").doc(post.id).delete();
                     alert("Post Deleted")
                    setStatus("None")
                    
                  }}
                  id="rbutton">Delete</button>
                  </div>
                </div>
                );
          })
        }
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
        </div>
        <Modal className='Dietplan_modal' isOpen={modalopenRecipe} shouldCloseOnOverlayClick={false} onRequestClose={() => setmodalopenRecipe(false)}>
          <div className='Dietplan_search-container'>
            <h3 className='Dietplan_subheader'>
              Recipe Detials
            </h3>
            <div>
              <div className='Recipe_Input'>
                <h2>Recipe Title</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Title'
                  value={title}
                  onChange={(e)=>{
                    setTitle(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Photo Link</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Photo Link'
                  value={pic}
                  onChange={(e)=>{
                    setPic(e.target.value)
                  }}
                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Webpage Link</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Webpage Link'
                  value={web}
                  onChange={(e)=>{
                    setWeb(e.target.value)
                  }}
                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Ingredients</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Ingredients'
                  value={ingredient}
                  onChange={(e)=>{
                    setIng(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Cooking Time</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Cooking Time'
                  value={time}
                  onChange={(e)=>{
                    setTime(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Cooking Process</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Cooking Process'
                  value={process}
                  onChange={(e)=>{
                    setProcess(e.target.value)
                  }}

                />
              </div>
            <div className="buttonContainer">
            <button className="customButtons"
              onClick={async () => {
                if(title.length==0){
                  alert("Recipe Title Required")
                }else if(pic.length==0){
                  alert("Recipe Picture Link Required")
                }else if(web.length==0){
                  alert("Recipe Webpage Link Required")
                }else if(time.length==0){
                  alert("Recipe Cooking Time Required")
                }else if(process.length==0){
                  alert("Recipe Cooking Process Required")
                }else if(ingredient.length==0){
                  alert("Recipe Ingredients Required")
                }else{
                  db.collection("userRecipes").add({ 
                    title:title,
                    picURL:pic,
                    webURL:web,
                    status:"approved",
                    time:time,
                    process:process,
                    ing:ingredient,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  });
                  db.collection("Notification").add( {
                    id:uname, 
                    msg:"Recipe "+title+" added by "+uname+" (Administrator)",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  });
                alert("Recipe Added")
                setmodalopenRecipe(false)
                }
              }}       >
              Add Recipe
            </button>
            <button className="customButtons"
              onClick={() => setmodalopenRecipe(false)}       >
              Close
            </button>
          </div>
          </div>
          </div>
        </Modal>
      </div>
      );
  }
  else if(signedIn=='signedIn' && status=='users'){
    return(
      <div className='reportBox'>
        <div className='recipeHeader'>
        <div className='rHeaderBox'>
        <p id='reportHeader'>Users</p>
        </div>
        </div>
        <div id='reports'>
        {
          siteUsers.map(function(u, idx) {
              return( 
                <div id="recipe">
                  <div>
                  <img id="recipeImg" src={u.imageLink} alt="Recipe"/>
                  </div>
                  <div id="rinfo">
                  <p id='rname'>User Name: {u.name}</p>
                  <p id='rname'>Email: {u.email}</p>
                  </div>
                  <div id="rbuttonBox">
                  
                  </div>
                </div>
                );
          })
        }
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
        </div>
        <Modal className='Dietplan_modal' isOpen={modalopenRecipe} shouldCloseOnOverlayClick={false} onRequestClose={() => setmodalopenRecipe(false)}>
          <div className='Dietplan_search-container'>
            <h3 className='Dietplan_subheader'>
              Recipe Detials
            </h3>
            <div>
              <div className='Recipe_Input'>
                <h2>Recipe Title</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Title'
                  value={title}
                  onChange={(e)=>{
                    setTitle(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Photo Link</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Photo Link'
                  value={pic}
                  onChange={(e)=>{
                    setPic(e.target.value)
                  }}
                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Webpage Link</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Webpage Link'
                  value={web}
                  onChange={(e)=>{
                    setWeb(e.target.value)
                  }}
                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Ingredients</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Ingredients'
                  value={ingredient}
                  onChange={(e)=>{
                    setIng(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Cooking Time</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Cooking Time'
                  value={time}
                  onChange={(e)=>{
                    setTime(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Cooking Process</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Cooking Process'
                  value={process}
                  onChange={(e)=>{
                    setProcess(e.target.value)
                  }}

                />
              </div>
            <div className="buttonContainer">
            <button className="customButtons"
              onClick={async () => {
                if(title.length==0){
                  alert("Recipe Title Required")
                }else if(pic.length==0){
                  alert("Recipe Picture Link Required")
                }else if(web.length==0){
                  alert("Recipe Webpage Link Required")
                }else if(time.length==0){
                  alert("Recipe Cooking Time Required")
                }else if(process.length==0){
                  alert("Recipe Cooking Process Required")
                }else if(ingredient.length==0){
                  alert("Recipe Ingredients Required")
                }else{
                  db.collection("userRecipes").add({ 
                    title:title,
                    picURL:pic,
                    webURL:web,
                    status:"approved",
                    time:time,
                    process:process,
                    ing:ingredient,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  });
                  db.collection("Notification").add( {
                    id:uname, 
                    msg:"Recipe "+title+" added by "+uname+" (Administrator)",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  });
                alert("Recipe Added")
                setmodalopenRecipe(false)
                }
              }}       >
              Add Recipe
            </button>
            <button className="customButtons"
              onClick={() => setmodalopenRecipe(false)}       >
              Close
            </button>
          </div>
          </div>
          </div>
        </Modal>
      </div>
      );
  }
  else if(signedIn=='signedIn' && status=='uplans'){
    return(
      <div className='reportBox'>
        <div className='recipeHeader'>
        <div className='rHeaderBox'>
        <p id='reportHeader'>User Plans</p>
        </div>
        </div>
        <div id='reports'>
        {
          userPlan.map(function(u, idx) {
            
            return( 
                <div key={idx} id="recipe">
                  <div>
                  </div>
                  <div id="rinfo">
                  <p id='rname'>User Name: {u.data[0]}</p>
                  <p id='rname'>Email: {u.data[1]}</p>
                  <p id='rname'>PLAN</p>
                  {u.plan['0']['0']!="" ||
                  u.plan['0']['1']!=""||
                  u.plan['0']['2']!=""?
                  <div>
                    <p id='rname'>Sunday: </p>
                    {u.plan['0']['0']!=""?
                    <p id='rname'>Breakfast: {u.plan['0']['0']} </p>:<p/>}
                    {u.plan['0']['1']!=""?
                    <p id='rname'>Lunch: {u.plan['0']['1']} </p>:<p/>}
                    {u.plan['0']['2']!=""?
                    <p id='rname'>Dinner: {u.plan['0']['2']} </p>:<p/>}
                  </div>
                  :<div></div>
                  }
                  {u.plan['1']['0']!="" ||
                  u.plan['1']['1']!=""||
                  u.plan['1']['2']!=""?
                  <div>
                    <p id='rname'>Monday: </p>
                    {u.plan['1']['0']!=""?
                    <p id='rname'>Breakfast: {u.plan['1']['0']} </p>:<p/>}
                    {u.plan['1']['1']!=""?
                    <p id='rname'>Lunch: {u.plan['1']['1']} </p>:<p/>}
                    {u.plan['1']['2']!=""?
                    <p id='rname'>Dinner: {u.plan['1']['2']} </p>:<p/>}
                  </div>
                  :<div></div>
                  }
                  {u.plan['2']['0']!="" ||
                  u.plan['2']['1']!=""||
                  u.plan['2']['2']!=""?
                  <div>
                    <p id='rname'>Tuesday: </p>
                    {u.plan['2']['0']!=""?
                    <p id='rname'>Breakfast: {u.plan['2']['0']} </p>:<p/>}
                    {u.plan['2']['1']!=""?
                    <p id='rname'>Lunch: {u.plan['2']['1']} </p>:<p/>}
                    {u.plan['2']['2']!=""?
                    <p id='rname'>Dinner: {u.plan['2']['2']} </p>:<p/>}
                  </div>
                  :<div></div>
                  }
                  {u.plan['3']['0']!="" ||
                  u.plan['3']['1']!=""||
                  u.plan['3']['2']!=""?
                  <div>
                    <p id='rname'>Wednessday: </p>
                    {u.plan['3']['0']!=""?
                    <p id='rname'>Breakfast: {u.plan['3']['0']} </p>:<p/>}
                    {u.plan['3']['1']!=""?
                    <p id='rname'>Lunch: {u.plan['3']['1']} </p>:<p/>}
                    {u.plan['3']['2']!=""?
                    <p id='rname'>Dinner: {u.plan['3']['2']} </p>:<p/>}
                  </div>
                  :<div></div>
                  }
                  {u.plan['4']['0']!="" ||
                  u.plan['4']['1']!=""||
                  u.plan['4']['2']!=""?
                  <div>
                    <p id='rname'>Thursday: </p>
                    {u.plan['4']['0']!=""?
                    <p id='rname'>Breakfast: {u.plan['4']['0']} </p>:<p/>}
                    {u.plan['4']['1']!=""?
                    <p id='rname'>Lunch: {u.plan['4']['1']} </p>:<p/>}
                    {u.plan['4']['2']!=""?
                    <p id='rname'>Dinner: {u.plan['4']['2']} </p>:<p/>}
                  </div>
                  :<div></div>
                  }
                  {u.plan['5']['0']!="" ||
                  u.plan['5']['1']!=""||
                  u.plan['5']['2']!=""?
                  <div>
                    <p id='rname'>Friday: </p>
                    {u.plan['5']['0']!=""?
                    <p id='rname'>Breakfast: {u.plan['5']['0']} </p>:<p/>}
                    {u.plan['5']['1']!=""?
                    <p id='rname'>Lunch: {u.plan['5']['1']} </p>:<p/>}
                    {u.plan['5']['2']!=""?
                    <p id='rname'>Dinner: {u.plan['5']['2']} </p>:<p/>}
                  </div>
                  :<div></div>
                  }
                  {u.plan['6']['0']!="" ||
                  u.plan['6']['1']!=""||
                  u.plan['6']['2']!=""?
                  <div>
                    <p id='rname'>Saturday: </p>
                    {u.plan['6']['0']!=""?
                    <p id='rname'>Breakfast: {u.plan['6']['0']} </p>:<p/>}
                    {u.plan['6']['1']!=""?
                    <p id='rname'>Lunch: {u.plan['6']['1']} </p>:<p/>}
                    {u.plan['6']['2']!=""?
                    <p id='rname'>Dinner: {u.plan['6']['2']} </p>:<p/>}
                  </div>
                  :<div></div>
                  }
                  </div>
                  <div id="rbuttonBox">
                  <button
                  onClick={async()=>{
                    
                      db.collection("userPlan").doc(u.id).delete();
                     alert("User Plan Deleted")
                    setStatus("None")
                    setUserPlan([])
                    
                  }}
                  id="rbutton">Delete</button>
                  </div>
                </div>
                );
          })
        }
        <div id='backBox'>
          <button id='reportButton' onClick={back}>Back</button>
        </div>
        </div>
        <Modal className='Dietplan_modal' isOpen={modalopenRecipe} shouldCloseOnOverlayClick={false} onRequestClose={() => setmodalopenRecipe(false)}>
          <div className='Dietplan_search-container'>
            <h3 className='Dietplan_subheader'>
              Recipe Detials
            </h3>
            <div>
              <div className='Recipe_Input'>
                <h2>Recipe Title</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Title'
                  value={title}
                  onChange={(e)=>{
                    setTitle(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Photo Link</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Photo Link'
                  value={pic}
                  onChange={(e)=>{
                    setPic(e.target.value)
                  }}
                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Webpage Link</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Webpage Link'
                  value={web}
                  onChange={(e)=>{
                    setWeb(e.target.value)
                  }}
                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Ingredients</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Ingredients'
                  value={ingredient}
                  onChange={(e)=>{
                    setIng(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Cooking Time</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Cooking Time'
                  value={time}
                  onChange={(e)=>{
                    setTime(e.target.value)
                  }}

                />
              </div>
              <div className='Recipe_Input'>
                <h2>Recipe Cooking Process</h2>
                <input
                  className='Recipe_Input-input'
                  id="rInpt"
                  type='text'
                  placeholder='Recipe Cooking Process'
                  value={process}
                  onChange={(e)=>{
                    setProcess(e.target.value)
                  }}

                />
              </div>
            <div className="buttonContainer">
            <button className="customButtons"
              onClick={async () => {
                if(title.length==0){
                  alert("Recipe Title Required")
                }else if(pic.length==0){
                  alert("Recipe Picture Link Required")
                }else if(web.length==0){
                  alert("Recipe Webpage Link Required")
                }else if(time.length==0){
                  alert("Recipe Cooking Time Required")
                }else if(process.length==0){
                  alert("Recipe Cooking Process Required")
                }else if(ingredient.length==0){
                  alert("Recipe Ingredients Required")
                }else{
                  db.collection("userRecipes").add({ 
                    title:title,
                    picURL:pic,
                    webURL:web,
                    status:"approved",
                    time:time,
                    process:process,
                    ing:ingredient,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  });
                  db.collection("Notification").add( {
                    id:uname, 
                    msg:"Recipe "+title+" added by "+uname+" (Administrator)",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                  });
                alert("Recipe Added")
                setmodalopenRecipe(false)
                }
              }}       >
              Add Recipe
            </button>
            <button className="customButtons"
              onClick={() => setmodalopenRecipe(false)}       >
              Close
            </button>
          </div>
          </div>
          </div>
        </Modal>
      </div>
      );
  }
  else if(signedIn!='signedIn'){
    return(
      <div className='dashCreateBox'>
        <form className="dashLoginBg">
          <div className='inputHeader'>
            <p>NOT SIGNED IN, PLEASE SIGN IN TO ACCESS DASHBOARD</p>
          </div> 
        </form>  
      </div>
    );
  }
}

export default Dashboard;
